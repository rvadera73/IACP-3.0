-- ============================================================================
-- IACP 3.0 - PostgreSQL Database Schema
-- ============================================================================
-- Version: 3.0
-- Date: March 22, 2026
-- Database: PostgreSQL 15 (Cloud SQL)
-- 
-- References:
-- - docs/ARCHITECTURE.md (Section 5: Data Architecture)
-- - docs/DATA_MODEL.md (Complete entity definitions)
-- - docs/DECISIONS.md (ADR-002: Single PostgreSQL, ADR-005: Event Sourcing)
--
-- Schemas:
-- - core: cases, parties, case_parties, docket_events
-- - filing: filings, deficiencies, validation_results
-- - document: documents, document_versions, exhibits
-- - scheduling: hearings, courtrooms, court_reporters
-- - judicial: bench_memos, decision_drafts, draft_versions
-- - identity: users, roles, permissions, sessions
-- - ai: ai_requests, ai_results
-- - notification: notifications, service_records
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================================
-- CORE SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS core;

-- Person (Party-Centric Root)
-- Every individual or organization in the system
CREATE TABLE core.person (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('individual', 'organization')),
    prefix VARCHAR(50),
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    suffix VARCHAR(50),
    organization_name VARCHAR(200),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address_line_1 VARCHAR(200),
    address_line_2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    country VARCHAR(2) DEFAULT 'US',
    bar_number VARCHAR(50),
    bar_state VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    CONSTRAINT chk_person_individual CHECK (
        (person_type = 'individual' AND first_name IS NOT NULL AND last_name IS NOT NULL) OR
        (person_type = 'organization' AND organization_name IS NOT NULL)
    )
);

CREATE INDEX idx_person_email ON core.person(email);
CREATE INDEX idx_person_name ON core.person USING gin(last_name gin_trgm_ops, first_name gin_trgm_ops);
CREATE INDEX idx_person_bar ON core.person(bar_number) WHERE bar_number IS NOT NULL;

-- User (Internal Staff)
CREATE TABLE core."user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID UNIQUE REFERENCES core.person(id),
    google_oauth_id VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL,
    office VARCHAR(50),
    chambers_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Valid roles (extend as needed)
    CONSTRAINT chk_user_role CHECK (
        role IN (
            'docket_clerk', 'legal_assistant', 'attorney_advisor', 'alj',
            'chief_judge', 'sys_admin', 'board_docket_clerk',
            'board_legal_assistant', 'board_attorney_advisor', 'board_member'
        )
    )
);

CREATE INDEX idx_user_role ON core."user"(role);
CREATE INDEX idx_user_office ON core."user"(office);

-- Case Type Registry
CREATE TABLE core.case_type_registry (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    statute VARCHAR(100),
    division VARCHAR(20) NOT NULL CHECK (division IN ('OALJ', 'BOARDS')),
    appeal_board VARCHAR(10),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert initial case types
INSERT INTO core.case_type_registry (code, name, statute, division, appeal_board, description) VALUES
('BLA', 'Black Lung Benefits Act', '30 USC §901+', 'OALJ', 'BRB', 'Pneumoconiosis claims from coal miners'),
('LHC', 'Longshore and Harbor Workers Compensation', '33 USC §901+', 'OALJ', 'BRB', 'Maritime worker injury/death claims'),
('PER', 'BALCA/PERM Labor Certification', '20 C.F.R. §656', 'OALJ', 'ARB', 'Immigration labor certification appeals'),
('BRB', 'Benefits Review Board Appeal', '20 C.F.R. §801', 'BOARDS', NULL, 'Appellate review of BLA/LHC decisions'),
('ARB', 'Administrative Review Board Appeal', '20 C.F.R. §802', 'BOARDS', NULL, 'Appellate review of whistleblower/OFCCP cases'),
('ECAB', 'Employees Compensation Appeals Board', '5 USC §8101+', 'BOARDS', NULL, 'Federal workers compensation appeals');

-- Case (Central Aggregate)
CREATE TABLE core.case (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    docket_number VARCHAR(20) UNIQUE NOT NULL,
    case_type VARCHAR(3) NOT NULL REFERENCES core.case_type_registry(code),
    title VARCHAR(500) NOT NULL,
    current_phase VARCHAR(50) NOT NULL DEFAULT 'intake',
    current_status VARCHAR(50) NOT NULL DEFAULT 'pending_review',
    assigned_judge_id UUID REFERENCES core."user"(id),
    assigned_chambers UUID,
    
    -- Referral Information
    referring_agency VARCHAR(50),
    referring_office VARCHAR(100),
    referral_date DATE,
    referral_document_id UUID,
    
    -- Docketing
    docketed_date DATE,
    docketed_by UUID REFERENCES core."user"(id),
    docket_method VARCHAR(20) CHECK (docket_method IN ('auto', 'manual')),
    ai_docket_score FLOAT,
    
    -- SLA Tracking
    statutory_deadline DATE,
    deadline_type VARCHAR(50),
    sla_status VARCHAR(20) DEFAULT 'green' CHECK (sla_status IN ('green', 'amber', 'red', 'breached', 'na')),
    
    -- Case Details (BLA-specific)
    mine_state VARCHAR(2),
    responsible_operator VARCHAR(200),
    
    -- Disposition
    disposition_type VARCHAR(50),
    disposition_date DATE,
    closed_date DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES core."user"(id),
    is_sealed BOOLEAN DEFAULT FALSE,
    
    -- Phase validation
    CONSTRAINT chk_case_phase CHECK (
        current_phase IN (
            'intake', 'docketed', 'assigned', 'pre_hearing', 'hearing',
            'post_hearing', 'decision', 'closed', 'appealed', 'remanded'
        )
    ),
    
    -- Status validation
    CONSTRAINT chk_case_status CHECK (
        current_status IN (
            'pending_review', 'deficient', 'auto_docketed', 'manually_docketed',
            'awaiting_assignment', 'assigned', 'discovery', 'motions_pending',
            'hearing_scheduled', 'hearing_in_progress', 'hearing_continued',
            'record_open', 'record_closed', 'draft_in_progress', 'draft_submitted',
            'decision_issued', 'settled', 'dismissed', 'transferred',
            'on_appeal', 'remanded'
        )
    )
);

CREATE INDEX idx_case_docket_number ON core.case(docket_number);
CREATE INDEX idx_case_type ON core.case(case_type);
CREATE INDEX idx_case_phase ON core.case(current_phase);
CREATE INDEX idx_case_status ON core.case(current_status);
CREATE INDEX idx_case_assigned_judge ON core.case(assigned_judge_id);
CREATE INDEX idx_case_sla ON core.case(sla_status, statutory_deadline);
CREATE INDEX idx_case_title ON core.case USING gin(title gin_trgm_ops);

-- Case Party (Junction - Party-Centric Model)
CREATE TABLE core.case_party (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.person(id),
    role_in_case VARCHAR(50) NOT NULL,
    represented_by UUID REFERENCES core.person(id),
    service_method VARCHAR(20) DEFAULT 'electronic' CHECK (service_method IN ('electronic', 'mail', 'both')),
    service_address VARCHAR(500),
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    withdrawn_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'deceased')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (case_id, person_id, role_in_case),
    
    CONSTRAINT chk_party_role CHECK (
        role_in_case IN (
            'claimant', 'complainant', 'employer', 'responsible_operator',
            'insurance_carrier', 'respondent', 'director_owcp', 'intervenor',
            'amicus', 'claimant_attorney', 'employer_attorney', 'solicitor'
        )
    )
);

CREATE INDEX idx_case_party_case ON core.case_party(case_id);
CREATE INDEX idx_case_party_person ON core.case_party(person_id);
CREATE INDEX idx_case_party_role ON core.case_party(role_in_case);

-- Docket Event (Event-Sourced - Immutable)
CREATE TABLE core.docket_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    sequence_number BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(20) NOT NULL CHECK (event_category IN ('filing', 'order', 'notice', 'action', 'system')),
    title VARCHAR(500) NOT NULL,
    event_data JSONB NOT NULL,
    document_id UUID,
    actor_id UUID,
    actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('internal_user', 'external_party', 'system')),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (case_id, sequence_number)
);

CREATE INDEX idx_docket_event_case ON core.docket_event(case_id);
CREATE INDEX idx_docket_event_type ON core.docket_event(event_type);
CREATE INDEX idx_docket_event_occurred ON core.docket_event(occurred_at);
CREATE INDEX idx_docket_event_actor ON core.docket_event(actor_id);
CREATE INDEX idx_docket_event_data ON core.docket_event USING gin(event_data);

-- Sequence trigger for docket_event
CREATE OR REPLACE FUNCTION core.set_docket_event_sequence()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sequence_number IS NULL THEN
        SELECT COALESCE(MAX(sequence_number), 0) + 1 INTO NEW.sequence_number
        FROM core.docket_event WHERE case_id = NEW.case_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_docket_event_sequence
    BEFORE INSERT ON core.docket_event
    FOR EACH ROW EXECUTE FUNCTION core.set_docket_event_sequence();

-- ============================================================================
-- FILING SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS filing;

-- Filing
CREATE TABLE filing.filing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intake_id VARCHAR(20) UNIQUE NOT NULL,
    case_id UUID REFERENCES core.case(id),
    filing_type VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    submitted_by_person_id UUID REFERENCES core.person(id),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'deficient', 'rejected')),
    description TEXT,
    ai_analysis TEXT,
    document_url VARCHAR(500),
    file_name VARCHAR(255),
    channel VARCHAR(20) CHECK (channel IN ('efs_electronic', 'email', 'mail', 'fax')),
    
    -- Metadata
    form_number VARCHAR(50),
    is_urgent BOOLEAN DEFAULT FALSE,
    bar_number VARCHAR(50),
    
    -- Extracted data (JSONB for flexibility)
    extracted_metadata JSONB,
    
    -- AI Findings
    identity_match_status VARCHAR(20),
    identity_match_details TEXT,
    redaction_scan_status VARCHAR(20),
    redaction_scan_details TEXT,
    redaction_count INTEGER DEFAULT 0,
    timeliness_status VARCHAR(20),
    timeliness_details TEXT,
    deficiency_detection_status VARCHAR(20),
    deficiency_detection_details TEXT,
    auto_notice BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_filing_intake_id ON filing.filing(intake_id);
CREATE INDEX idx_filing_case_id ON filing.filing(case_id);
CREATE INDEX idx_filing_status ON filing.filing(status);
CREATE INDEX idx_filing_submitted ON filing.filing(submitted_at);
CREATE INDEX idx_filing_metadata ON filing.filing USING gin(extracted_metadata);

-- Deficiency
CREATE TABLE filing.deficiency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filing_id UUID NOT NULL REFERENCES filing.filing(id) ON DELETE CASCADE,
    deficiency_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning')),
    auto_fixable BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMP WITH TIME ZONE,
    corrected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_deficiency_type CHECK (
        deficiency_type IN (
            'missing_signature', 'illegible_field', 'missing_required_field',
            'invalid_format', 'missing_document'
        )
    )
);

CREATE INDEX idx_deficiency_filing ON filing.deficiency(filing_id);
CREATE INDEX idx_deficiency_type ON filing.deficiency(deficiency_type);
CREATE INDEX idx_deficiency_severity ON filing.deficiency(severity);

-- Validation Result
CREATE TABLE filing.validation_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filing_id UUID UNIQUE NOT NULL REFERENCES filing.filing(id) ON DELETE CASCADE,
    ai_score FLOAT NOT NULL,
    is_auto_docket_ready BOOLEAN DEFAULT FALSE,
    validation_details JSONB,
    validated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validated_by UUID REFERENCES core."user"(id)
);

CREATE INDEX idx_validation_filing ON filing.validation_result(filing_id);
CREATE INDEX idx_validation_score ON filing.validation_result(ai_score);
CREATE INDEX idx_validation_ready ON filing.validation_result(is_auto_docket_ready);

-- ============================================================================
-- DOCUMENT SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS document;

-- Document
CREATE TABLE document.document (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    filed_by_person_id UUID REFERENCES core.person(id),
    filed_by_user_id UUID REFERENCES core."user"(id),
    filed_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    filing_channel VARCHAR(50) CHECK (filing_channel IN (
        'efs_electronic', 'email', 'mail', 'fax', 'system_generated'
    )),
    
    -- Storage
    current_version INTEGER DEFAULT 1,
    gcs_bucket VARCHAR(100) NOT NULL,
    gcs_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    
    -- Access Control
    access_level VARCHAR(20) NOT NULL DEFAULT 'parties_only' CHECK (
        access_level IN ('public', 'parties_only', 'internal', 'chambers', 'sealed')
    ),
    is_sealed BOOLEAN DEFAULT FALSE,
    sealed_by UUID REFERENCES core."user"(id),
    sealed_date TIMESTAMP WITH TIME ZONE,
    seal_reason TEXT,
    
    -- Exhibit Tracking
    is_exhibit BOOLEAN DEFAULT FALSE,
    exhibit_number VARCHAR(20),
    exhibit_party VARCHAR(20) CHECK (exhibit_party IN ('claimant', 'employer', 'director', NULL)),
    
    -- AI Processing
    ocr_processed BOOLEAN DEFAULT FALSE,
    ocr_confidence FLOAT,
    ai_summary TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_document_case ON document.document(case_id);
CREATE INDEX idx_document_type ON document.document(document_type);
CREATE INDEX idx_document_filed ON document.document(filed_date);
CREATE INDEX idx_document_access ON document.document(access_level);
CREATE INDEX idx_document_sealed ON document.document(is_sealed);
CREATE INDEX idx_document_exhibit ON document.document(is_exhibit);
CREATE INDEX idx_document_title ON document.document USING gin(title gin_trgm_ops);

-- Document Version
CREATE TABLE document.document_version (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES document.document(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    gcs_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    change_note TEXT,
    created_by UUID NOT NULL REFERENCES core."user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    
    UNIQUE (document_id, version_number)
);

CREATE INDEX idx_doc_version_document ON document.document_version(document_id);
CREATE INDEX idx_doc_version_number ON document.document_version(version_number);

-- ============================================================================
-- SCHEDULING SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS scheduling;

-- Courtroom
CREATE TABLE scheduling.courtroom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    office VARCHAR(50) NOT NULL,
    capacity INTEGER,
    video_conference_enabled BOOLEAN DEFAULT TRUE,
    address VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courtroom_office ON scheduling.courtroom(office);

-- Court Reporter
CREATE TABLE scheduling.court_reporter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES core.person(id),
    office VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reporter_office ON scheduling.court_reporter(office);

-- Hearing
CREATE TABLE scheduling.hearing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    hearing_type VARCHAR(50) NOT NULL CHECK (hearing_type IN (
        'initial', 'continued', 'supplemental', 'oral_argument'
    )),
    hearing_format VARCHAR(20) NOT NULL CHECK (hearing_format IN (
        'in_person', 'telephonic', 'video', 'hybrid'
    )),
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'rescheduled', 'held', 'continued', 'cancelled', 'postponed'
    )),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration INTERVAL,
    actual_duration INTERVAL,
    
    -- Location
    courtroom_id UUID REFERENCES scheduling.courtroom(id),
    location_name VARCHAR(200),
    location_address VARCHAR(500),
    video_link VARCHAR(500),
    
    -- Personnel
    judge_id UUID NOT NULL REFERENCES core."user"(id),
    court_reporter_id UUID REFERENCES scheduling.court_reporter(id),
    legal_assistant_id UUID REFERENCES core."user"(id),
    
    -- Record
    transcript_id UUID REFERENCES document.document(id),
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES core."user"(id),
    cancelled_reason TEXT
);

CREATE INDEX idx_hearing_case ON scheduling.hearing(case_id);
CREATE INDEX idx_hearing_date ON scheduling.hearing(scheduled_date);
CREATE INDEX idx_hearing_status ON scheduling.hearing(status);
CREATE INDEX idx_hearing_judge ON scheduling.hearing(judge_id);

-- Hearing Participant
CREATE TABLE scheduling.hearing_participant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hearing_id UUID NOT NULL REFERENCES scheduling.hearing(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.person(id),
    role VARCHAR(50) NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'expected' CHECK (
        attendance_status IN ('expected', 'confirmed', 'attended', 'excused', 'absent')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hearing_part_hearing ON scheduling.hearing_participant(hearing_id);
CREATE INDEX idx_hearing_part_person ON scheduling.hearing_participant(person_id);

-- ============================================================================
-- JUDICIAL SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS judicial;

-- Bench Memo
CREATE TABLE judicial.bench_memo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    legal_issue TEXT,
    standard_of_review TEXT,
    recommended_outcome TEXT,
    clerk_notes TEXT,
    created_by UUID NOT NULL REFERENCES core."user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bench_memo_case ON judicial.bench_memo(case_id);
CREATE INDEX idx_bench_memo_created ON judicial.bench_memo(created_by);

-- Decision Draft
CREATE TABLE judicial.decision_draft (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id) ON DELETE CASCADE,
    draft_type VARCHAR(50) NOT NULL CHECK (draft_type IN ('order', 'fdo', 'notice', 'decision')),
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'ready_for_review', 'revise', 'approved', 'released'
    )),
    version INTEGER NOT NULL DEFAULT 1,
    clerk_comments TEXT,
    judge_comments TEXT,
    redlines JSONB,
    created_by UUID NOT NULL REFERENCES core."user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decision_draft_case ON judicial.decision_draft(case_id);
CREATE INDEX idx_decision_draft_status ON judicial.decision_draft(status);
CREATE INDEX idx_decision_draft_content ON judicial.decision_draft USING gin(content gin_trgm_ops);

-- ============================================================================
-- IDENTITY SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS identity;

-- Role
CREATE TABLE identity.role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permission
CREATE TABLE identity.permission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session
CREATE TABLE identity.session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core."user"(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    mfa_verified BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_user ON identity.session(user_id);
CREATE INDEX idx_session_expires ON identity.session(expires_at);
CREATE INDEX idx_session_token ON identity.session(token_hash);

-- ============================================================================
-- AI SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS ai;

-- AI Request
CREATE TABLE ai.ai_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    model_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES core."user"(id)
);

CREATE INDEX idx_ai_request_type ON ai.ai_request(request_type);
CREATE INDEX idx_ai_request_created ON ai.ai_request(created_at);
CREATE INDEX idx_ai_request_data ON ai.ai_request USING gin(input_data);

-- AI Result
CREATE TABLE ai.ai_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES ai.ai_request(id),
    result_data JSONB NOT NULL,
    confidence_score FLOAT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_result_request ON ai.ai_result(request_id);
CREATE INDEX idx_ai_result_confidence ON ai.ai_result(confidence_score);
CREATE INDEX idx_ai_result_data ON ai.ai_result USING gin(result_data);

-- ============================================================================
-- NOTIFICATION SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS notification;

-- Notification
CREATE TABLE notification.notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_person_id UUID REFERENCES core.person(id),
    recipient_user_id UUID REFERENCES core."user"(id),
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'in_app')),
    subject VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES core."user"(id)
);

CREATE INDEX idx_notification_recipient ON notification.notification(recipient_person_id);
CREATE INDEX idx_notification_status ON notification.notification(status);
CREATE INDEX idx_notification_created ON notification.notification(created_at);

-- Service Record
CREATE TABLE notification.service_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES core.case(id),
    docket_event_id UUID REFERENCES core.docket_event(id),
    document_id UUID REFERENCES document.document(id),
    served_to_person_id UUID NOT NULL REFERENCES core.person(id),
    served_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    service_method VARCHAR(20) NOT NULL CHECK (service_method IN (
        'electronic', 'mail', 'fax', 'personal', 'certified'
    )),
    tracking_number VARCHAR(100),
    signer VARCHAR(200),
    proof_document_id UUID REFERENCES document.document(id),
    is_compliant BOOLEAN DEFAULT TRUE,
    compliance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES core."user"(id)
);

CREATE INDEX idx_service_record_case ON notification.service_record(case_id);
CREATE INDEX idx_service_record_served ON notification.service_record(served_to_person_id);
CREATE INDEX idx_service_record_method ON notification.service_record(service_method);

-- ============================================================================
-- REPORTING SCHEMA (Materialized Views)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS reporting;

-- Case Metrics Materialized View
CREATE MATERIALIZED VIEW reporting.case_metrics AS
SELECT
    c.case_type,
    c.current_phase,
    c.current_status,
    c.sla_status,
    c.assigned_judge_id,
    COUNT(*) as case_count,
    AVG(EXTRACT(DAY FROM (CURRENT_DATE - c.docketed_date))) as avg_days_pending
FROM core.case c
WHERE c.is_sealed = FALSE
GROUP BY c.case_type, c.current_phase, c.current_status, c.sla_status, c.assigned_judge_id;

CREATE UNIQUE INDEX idx_case_metrics ON reporting.case_metrics(case_type, current_phase, current_status, sla_status, assigned_judge_id);

-- Judge Workload Materialized View
CREATE MATERIALIZED VIEW reporting.judge_workload AS
SELECT
    u.id as judge_id,
    u.person_id,
    p.first_name || ' ' || p.last_name as judge_name,
    u.office,
    COUNT(c.id) as active_cases,
    COUNT(CASE WHEN c.sla_status = 'red' THEN 1 END) as red_alerts,
    COUNT(CASE WHEN c.sla_status = 'amber' THEN 1 END) as amber_alerts,
    COUNT(CASE WHEN c.current_phase = 'decision' THEN 1 END) as decisions_pending
FROM core."user" u
LEFT JOIN core.person p ON u.person_id = p.id
LEFT JOIN core.case c ON c.assigned_judge_id = u.id AND c.current_phase NOT IN ('closed', 'appealed')
WHERE u.role IN ('alj', 'board_member')
GROUP BY u.id, u.person_id, p.first_name, p.last_name, u.office;

CREATE UNIQUE INDEX idx_judge_workload ON reporting.judge_workload(judge_id);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_person_updated_at BEFORE UPDATE ON core.person
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON core."user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_updated_at BEFORE UPDATE ON core.case
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_party_updated_at BEFORE UPDATE ON core.case_party
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Case number generation function
CREATE OR REPLACE FUNCTION core.generate_docket_number(
    p_case_type VARCHAR(3),
    p_fiscal_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR(20) AS $$
DECLARE
    v_fiscal_year INTEGER;
    v_sequence INTEGER;
    v_docket_number VARCHAR(20);
BEGIN
    -- Use current fiscal year if not provided
    v_fiscal_year := COALESCE(p_fiscal_year, 
        EXTRACT(YEAR FROM CURRENT_DATE) + CASE 
            WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10 THEN 1 
            ELSE 0 
        END
    );
    
    -- Get next sequence number for this case type and year
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(docket_number FROM 8) AS INTEGER)
    ), 0) + 1 INTO v_sequence
    FROM core.case
    WHERE docket_number LIKE v_fiscal_year || p_case_type || '%';
    
    -- Format: YYYYTTTNNNNNN
    v_docket_number := v_fiscal_year || p_case_type || LPAD(v_sequence::TEXT, 6, '0');
    
    RETURN v_docket_number;
END;
$$ LANGUAGE plpgsql;

-- SLA deadline calculation function
CREATE OR REPLACE FUNCTION core.calculate_sla_deadline(
    p_case_type VARCHAR(3),
    p_filed_date DATE
)
RETURNS DATE AS $$
BEGIN
    -- Only BLA has 270-day statutory deadline
    IF p_case_type = 'BLA' THEN
        RETURN p_filed_date + INTERVAL '270 days';
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default roles
INSERT INTO identity.role (name, display_name, category, permissions) VALUES
('docket_clerk', 'OALJ Docket Clerk', 'OALJ', '["canDocket", "canAssign", "canViewAllCases", "canTransferCase"]'),
('legal_assistant', 'OALJ Legal Assistant', 'OALJ', '["canScheduleHearing", "canManageExhibits"]'),
('attorney_advisor', 'OALJ Attorney-Advisor', 'OALJ', '["canDraftDecision"]'),
('alj', 'Administrative Law Judge', 'OALJ', '["canDraftDecision", "canSignDecision", "canSealDocument", "canCloseRecord", "canViewAllCases", "canTransferCase"]'),
('board_docket_clerk', 'Board Docket Clerk', 'BOARDS', '["canDocket", "canAssign", "canViewAllCases", "canTransferCase"]'),
('board_legal_assistant', 'Board Legal Assistant', 'BOARDS', '["canScheduleHearing"]'),
('board_attorney_advisor', 'Board Attorney-Advisor', 'BOARDS', '["canDraftDecision"]'),
('board_member', 'Board Member', 'BOARDS', '["canDraftDecision", "canSignDecision", "canSealDocument", "canCloseRecord", "canViewAllCases", "canTransferCase"]');

-- Insert default permissions
INSERT INTO identity.permission (name, resource, action, description) VALUES
('canDocket', 'case', 'create', 'Can docket new cases'),
('canAssign', 'case', 'update', 'Can assign judges to cases'),
('canScheduleHearing', 'hearing', 'create', 'Can schedule hearings'),
('canDraftDecision', 'decision', 'create', 'Can draft decisions'),
('canSignDecision', 'decision', 'sign', 'Can sign and release decisions'),
('canSealDocument', 'document', 'seal', 'Can seal documents'),
('canCloseRecord', 'case', 'close', 'Can close case record'),
('canViewAllCases', 'case', 'read', 'Can view all cases'),
('canTransferCase', 'case', 'transfer', 'Can transfer cases'),
('canManageExhibits', 'document', 'manage', 'Can manage exhibits');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
