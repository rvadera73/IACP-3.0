-- ============================================================================
-- IACP 3.0 - Development Seed Data
-- ============================================================================
-- Purpose: Populate database with mock data for development/testing
-- Environment: Development ONLY (not for production)
-- 
-- Usage:
--   psql -h localhost -U postgres -d iacp -f database/seed_data.sql
-- ============================================================================

-- ============================================================================
-- CORE SCHEMA
-- ============================================================================

-- Insert sample persons
INSERT INTO core.person (person_type, first_name, last_name, email, phone, address_line_1, city, state, zip_code, bar_number, bar_state) VALUES
('individual', 'Robert', 'Martinez', 'r.martinez@email.com', '(412) 555-0123', '456 Miner Street', 'Pittsburgh', 'PA', '15202', NULL, NULL),
('individual', 'Sarah', 'Chen', 's.chen@email.com', '(415) 555-0456', '789 Bay Street', 'San Francisco', 'CA', '94109', NULL, NULL),
('individual', 'James', 'Thompson', 'j.thompson@email.com', '(412) 555-0789', '321 Coal Road', 'Pittsburgh', 'PA', '15203', NULL, NULL),
('individual', 'Maria', 'Santos', 'm.santos@email.com', '(212) 555-0321', '654 Harbor View', 'New York', 'NY', '10001', NULL, NULL),
('individual', 'John', 'Doe', 'john.doe@legalaid.org', '(412) 555-1000', '100 Legal Way', 'Pittsburgh', 'PA', '15201', 'PA12345', 'PA'),
('individual', 'Jane', 'Smith', 'jane.smith@hansenlaw.com', '(412) 555-2000', '200 Law Street', 'Pittsburgh', 'PA', '15202', 'PA23456', 'PA'),
('individual', 'Michael', 'Johnson', 'm.johnson@defenseassoc.com', '(212) 555-3000', '300 Defense Plaza', 'New York', 'NY', '10002', 'NY34567', 'NY'),
('individual', 'Patricia', 'Williams', 'p.williams@workersrights.org', '(415) 555-4000', '400 Rights Boulevard', 'San Francisco', 'CA', '94110', 'CA45678', 'CA');

-- Organization persons
INSERT INTO core.person (person_type, organization_name, email, phone, address_line_1, city, state, zip_code) VALUES
('organization', 'Harbor Freight Inc.', 'legal@harborfreight.com', '(412) 555-5000', '500 Industrial Park', 'Pittsburgh', 'PA', '15204'),
('organization', 'Apex Coal Mining', 'legal@apexcoal.com', '(412) 555-6000', '600 Mining Road', 'Pittsburgh', 'PA', '15205'),
('organization', 'Port Authority', 'hr@portauth.gov', '(212) 555-7000', '700 Port Authority', 'New York', 'NY', '10003'),
('organization', 'TechCorp Industries', 'legal@techcorp.com', '(202) 555-8000', '800 Tech Circle', 'Washington', 'DC', '20001');

-- Insert sample users (internal staff)
-- First, get person IDs for attorneys
DO $$
DECLARE
    v_person_id UUID;
BEGIN
    -- Get John Doe (attorney)
    SELECT id INTO v_person_id FROM core.person WHERE email = 'john.doe@legalaid.org';
    INSERT INTO core."user" (person_id, google_oauth_id, role, office, is_active)
    VALUES (v_person_id, 'google-oauth-john', 'attorney_advisor', 'pittsburgh', TRUE);
    
    -- Get Jane Smith (attorney)
    SELECT id INTO v_person_id FROM core.person WHERE email = 'jane.smith@hansenlaw.com';
    INSERT INTO core."user" (person_id, google_oauth_id, role, office, is_active)
    VALUES (v_person_id, 'google-oauth-jane', 'attorney_advisor', 'pittsburgh', TRUE);
END $$;

-- Insert ALJs
INSERT INTO core."user" (person_id, google_oauth_id, role, office, is_active) VALUES
((SELECT id FROM core.person WHERE email = 'm.johnson@defenseassoc.com'), 'google-oauth-michael', 'alj', 'pittsburgh', TRUE),
((SELECT id FROM core.person WHERE email = 'p.williams@workersrights.org'), 'google-oauth-patricia', 'alj', 'san_francisco', TRUE);

-- Additional internal users for offices referenced later in the seed data
INSERT INTO core.person (person_type, first_name, last_name, email, city, state)
VALUES
('individual', 'Michael', 'Ross', 'michael.ross@dol.gov', 'New York', 'NY'),
('individual', 'Amelia', 'Grant', 'amelia.grant@dol.gov', 'Washington', 'DC'),
('individual', 'Dana', 'Clerk', 'dana.clerk@dol.gov', 'Pittsburgh', 'PA');

INSERT INTO core."user" (person_id, google_oauth_id, role, office, is_active) VALUES
((SELECT id FROM core.person WHERE email = 'michael.ross@dol.gov'), 'google-oauth-ross', 'alj', 'new_york', TRUE),
((SELECT id FROM core.person WHERE email = 'amelia.grant@dol.gov'), 'google-oauth-grant', 'alj', 'washington_dc', TRUE),
((SELECT id FROM core.person WHERE email = 'dana.clerk@dol.gov'), 'google-oauth-dana', 'docket_clerk', 'pittsburgh', TRUE);

-- Insert sample cases
INSERT INTO core.case (docket_number, case_type, title, current_phase, current_status, assigned_judge_id, docketed_date, docketed_by, docket_method, ai_docket_score, statutory_deadline, sla_status, referring_agency, referring_office, mine_state, responsible_operator) VALUES
-- BLA Cases
('2026BLA00011', 'BLA', 'Robert Martinez v. Harbor Freight Inc.', 'docketed', 'awaiting_assignment', NULL, '2026-03-15', NULL, 'auto', 98.0, '2026-12-10', 'green', 'owcp', 'Pittsburgh', 'PA', 'Harbor Freight Inc.'),
('2026BLA00012', 'BLA', 'James Thompson v. Apex Coal Mining', 'assigned', 'discovery', 
    (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'pittsburgh' LIMIT 1), 
    '2026-03-01', NULL, 'auto', 95.0, '2026-11-14', 'green', 'owcp', 'Pittsburgh', 'PA', 'Apex Coal Mining'),
('2024BLA00042', 'BLA', 'Estate of R. Kowalski v. Pittsburgh Coal Co.', 'pre_hearing', 'hearing_scheduled', 
    (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'pittsburgh' LIMIT 1), 
    '2024-01-16', NULL, 'manual', 92.0, '2026-08-18', 'amber', 'owcp', 'Pittsburgh', 'PA', 'Pittsburgh Coal Co.'),

-- LHC Cases
('2025LHC00128', 'LHC', 'Maria Santos v. Atlantic Dockworkers', 'hearing', 'hearing_in_progress', 
    (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'new_york' LIMIT 1),
    '2025-06-02', NULL, 'auto', 96.0, NULL, 'na', 'owcp', 'New York', NULL, NULL),
('2026LHC00089', 'LHC', 'Sarah Chen v. Pacific Stevedoring', 'docketed', 'awaiting_assignment', NULL, '2026-03-14', NULL, 'manual', 65.0, NULL, 'na', 'owcp', 'San Francisco', NULL, NULL),

-- PER Cases
('2024PER00015', 'PER', 'TechCorp Industries v. BALCA', 'post_hearing', 'draft_in_progress', 
    (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'washington_dc' LIMIT 1),
    '2024-06-16', NULL, 'auto', 90.0, NULL, 'na', 'oflc', 'Washington DC', NULL, NULL);

-- Insert case parties
DO $$
DECLARE
    v_case_id UUID;
    v_person_id UUID;
BEGIN
    -- Robert Martinez case
    SELECT id INTO v_case_id FROM core.case WHERE docket_number = '2026BLA00011';
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'r.martinez@email.com';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method)
    VALUES (v_case_id, v_person_id, 'claimant', 'mail');
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'legal@harborfreight.com';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method, represented_by)
    VALUES (v_case_id, v_person_id, 'employer', 'electronic', 
            (SELECT id FROM core.person WHERE email = 'jane.smith@hansenlaw.com'));
    
    -- James Thompson case
    SELECT id INTO v_case_id FROM core.case WHERE docket_number = '2026BLA00012';
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'j.thompson@email.com';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method, represented_by)
    VALUES (v_case_id, v_person_id, 'claimant', 'electronic',
            (SELECT id FROM core.person WHERE email = 'john.doe@legalaid.org'));
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'legal@apexcoal.com';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method, represented_by)
    VALUES (v_case_id, v_person_id, 'employer', 'electronic',
            (SELECT id FROM core.person WHERE email = 'jane.smith@hansenlaw.com'));
    
    -- Maria Santos case
    SELECT id INTO v_case_id FROM core.case WHERE docket_number = '2025LHC00128';
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'm.santos@email.com';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method, represented_by)
    VALUES (v_case_id, v_person_id, 'claimant', 'electronic',
            (SELECT id FROM core.person WHERE email = 'p.williams@workersrights.org'));
    
    SELECT id INTO v_person_id FROM core.person WHERE email = 'hr@portauth.gov';
    INSERT INTO core.case_party (case_id, person_id, role_in_case, service_method, represented_by)
    VALUES (v_case_id, v_person_id, 'employer', 'electronic',
            (SELECT id FROM core.person WHERE email = 'm.johnson@defenseassoc.com'));
END $$;

-- Insert docket events
INSERT INTO core.docket_event (case_id, event_type, event_category, title, event_data, actor_type, occurred_at) VALUES
-- 2026BLA00011
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'CASE_REFERRED', 'action', 'Case Referred to OALJ', 
 '{"referring_agency": "owcp", "referral_date": "2026-03-15", "program_office": "Pittsburgh"}', 'system', '2026-03-15 09:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'FILING_RECEIVED', 'filing', 'LS-203 Claim Form Filed', 
 '{"filing_type": "claim_form", "channel": "efs_electronic", "filer_id": "person-uuid"}', 'external_party', '2026-03-15 09:23:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'FILING_VALIDATED', 'system', 'AI Validation Complete', 
 '{"ai_score": 98, "deficiencies": [], "is_auto_docketed": true}', 'system', '2026-03-15 09:24:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'CASE_DOCKETED', 'action', 'Case Docketed', 
 '{"docket_number": "2026BLA00011", "method": "auto"}', 'system', '2026-03-15 09:25:00'),

-- 2026BLA00012
((SELECT id FROM core.case WHERE docket_number = '2026BLA00012'), 'CASE_REFERRED', 'action', 'Case Referred to OALJ', 
 '{"referring_agency": "owcp", "referral_date": "2026-02-28"}', 'system', '2026-02-28 10:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00012'), 'FILING_RECEIVED', 'filing', 'LS-203 Claim Form Filed', 
 '{"filing_type": "claim_form", "channel": "efs_electronic"}', 'external_party', '2026-02-28 10:15:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00012'), 'FILING_VALIDATED', 'system', 'AI Validation Complete', 
 '{"ai_score": 95, "deficiencies": [], "is_auto_docketed": true}', 'system', '2026-02-28 10:16:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00012'), 'CASE_DOCKETED', 'action', 'Case Docketed', 
 '{"docket_number": "2026BLA00012", "method": "auto"}', 'system', '2026-03-01 08:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00012'), 'JUDGE_ASSIGNED', 'action', 'Judge Assigned', 
 '{"judge_id": "judge-uuid", "assignment_method": "smart", "assignment_score": 0.85}', 'internal_user', '2026-03-05 09:00:00'),

-- 2024BLA00042
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'CASE_REFERRED', 'action', 'Case Referred to OALJ', 
 '{"referring_agency": "owcp", "referral_date": "2024-01-15"}', 'system', '2024-01-15 10:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'CASE_DOCKETED', 'action', 'Case Docketed', 
 '{"docket_number": "2024BLA00042", "method": "manual"}', 'system', '2024-01-16 08:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'JUDGE_ASSIGNED', 'action', 'Judge Assigned', 
 '{"judge_id": "judge-uuid"}', 'internal_user', '2024-01-20 09:00:00'),
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'HEARING_SCHEDULED', 'action', 'Hearing Scheduled', 
 '{"hearing_id": "hearing-uuid", "date": "2026-04-15", "location": "Pittsburgh"}', 'internal_user', '2026-02-15 10:00:00');

-- ============================================================================
-- FILING SCHEMA
-- ============================================================================

-- Insert sample filings
INSERT INTO filing.filing (intake_id, case_id, filing_type, category, submitted_by_person_id, status, description, channel, extracted_metadata, ai_analysis) VALUES
('INT-2026-00089', (SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'claim_form', 'initiating', 
 (SELECT id FROM core.person WHERE email = 'r.martinez@email.com'), 'accepted', 'LS-203 Claim Form for Black Lung Benefits', 'efs_electronic',
 '{"claimantName": "Robert Martinez", "employerName": "Harbor Freight Inc.", "dateOfInjury": "2025-08-15"}'::jsonb,
 'Complete filing with all required fields. Medical evidence included. Signature verified.'),
('INT-2026-00090', (SELECT id FROM core.case WHERE docket_number = '2026LHC00089'), 'claim_form', 'initiating',
 (SELECT id FROM core.person WHERE email = 's.chen@email.com'), 'deficient', 'LS-203 Claim Form for Longshore Benefits', 'email',
 '{"claimantName": "Sarah Chen", "employerName": "Pacific Stevedoring"}'::jsonb,
 'Missing signature and illegible SSN field. Deficiency notice sent.');

-- Insert deficiencies
INSERT INTO filing.deficiency (filing_id, deficiency_type, field_name, description, severity, auto_fixable) VALUES
((SELECT id FROM filing.filing WHERE intake_id = 'INT-2026-00090'), 'missing_signature', 'signature', 'No signature detected on claim form', 'critical', FALSE),
((SELECT id FROM filing.filing WHERE intake_id = 'INT-2026-00090'), 'illegible_field', 'ssn', 'SSN field could not be read from scan', 'critical', FALSE);

-- Insert validation results
INSERT INTO filing.validation_result (filing_id, ai_score, is_auto_docket_ready, validation_details) VALUES
((SELECT id FROM filing.filing WHERE intake_id = 'INT-2026-00089'), 98.0, TRUE, 
 '{"signatureDetected": true, "piiDetected": false, "allFieldsComplete": true}'::jsonb),
((SELECT id FROM filing.filing WHERE intake_id = 'INT-2026-00090'), 65.0, FALSE,
 '{"signatureDetected": false, "piiDetected": false, "allFieldsComplete": false, "deficiencies": ["missing_signature", "illegible_ssn"]}'::jsonb);

-- ============================================================================
-- DOCUMENT SCHEMA
-- ============================================================================

-- Insert sample documents
INSERT INTO document.document (case_id, document_type, title, filed_by_person_id, filing_channel, gcs_bucket, gcs_path, file_name, file_size_bytes, mime_type, checksum_sha256, access_level, current_version) VALUES
-- 2026BLA00011 documents
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'claim_form', 'LS-203 Claim Form', 
 (SELECT id FROM core.person WHERE email = 'r.martinez@email.com'), 'efs_electronic',
 'iacp-documents-dev', 'filings/2026/03/2026BLA00011-claim-form.pdf', 'LS-203_Claim_Form.pdf',
 2097152, 'application/pdf', 'abc123def456...', 'parties_only', 1),
((SELECT id FROM core.case WHERE docket_number = '2026BLA00011'), 'evidence_medical', 'Medical Reports - Dr. Johnson',
 (SELECT id FROM core.person WHERE email = 'r.martinez@email.com'), 'efs_electronic',
 'iacp-documents-dev', 'exhibits/2026/03/2026BLA00011-medical-reports.pdf', 'Medical_Reports.pdf',
 4718592, 'application/pdf', 'def456ghi789...', 'parties_only', 1),

-- 2024BLA00042 documents
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'claim_form', 'LS-203 Claim Form - Estate of R. Kowalski',
 (SELECT id FROM core.person WHERE email = 'john.doe@legalaid.org'), 'efs_electronic',
 'iacp-documents-dev', 'filings/2024/01/2024BLA00042-claim-form.pdf', 'Claim_Form.pdf',
 2516582, 'application/pdf', 'ghi789jkl012...', 'parties_only', 1),
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'evidence_employment', 'Employment Records - Pittsburgh Coal Co.',
 (SELECT id FROM core.person WHERE email = 'jane.smith@hansenlaw.com'), 'efs_electronic',
 'iacp-documents-dev', 'exhibits/2024/02/2024BLA00042-employment-records.pdf', 'Employment_Records.pdf',
 3355443, 'application/pdf', 'jkl012mno345...', 'parties_only', 1),
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'transcript', 'Deposition Transcript - Dr. Smith',
 (SELECT id FROM core.person WHERE email = 'john.doe@legalaid.org'), 'efs_electronic',
 'iacp-documents-dev', 'transcripts/2024/03/2024BLA00042-deposition-dr-smith.pdf', 'Deposition_Transcript.pdf',
 8912896, 'application/pdf', 'mno345pqr678...', 'parties_only', 1);

-- Insert document versions
INSERT INTO document.document_version (document_id, version_number, gcs_path, file_size_bytes, checksum_sha256, change_note, created_by)
SELECT 
    id, 1, gcs_path, file_size_bytes, checksum_sha256, 'Initial version',
    (SELECT id FROM core."user" LIMIT 1)
FROM document.document;

-- ============================================================================
-- SCHEDULING SCHEMA
-- ============================================================================

-- Insert courtrooms
INSERT INTO scheduling.courtroom (name, office, capacity, video_conference_enabled, address) VALUES
('Room 402', 'pittsburgh', 30, TRUE, '1000 Liberty Avenue, Pittsburgh, PA 15222'),
('Room 405', 'pittsburgh', 25, TRUE, '1000 Liberty Avenue, Pittsburgh, PA 15222'),
('Room 301', 'new_york', 35, TRUE, '201 Varick Street, New York, NY 10014'),
('Room 201', 'san_francisco', 30, TRUE, '90 7th Street, San Francisco, CA 94103'),
('Room 101', 'washington_dc', 45, TRUE, '800 K Street NW, Washington, DC 20001');

-- Insert court reporters
DO $$
DECLARE
    v_person_id UUID;
BEGIN
    -- Create court reporter persons
    INSERT INTO core.person (person_type, first_name, last_name, email, phone, city, state)
    VALUES ('individual', 'Jennifer', 'Smith', 'j.smith@courtreporters.com', '(412) 555-9001', 'Pittsburgh', 'PA')
    RETURNING id INTO v_person_id;
    INSERT INTO scheduling.court_reporter (person_id, office, is_active)
    VALUES (v_person_id, 'pittsburgh', TRUE);
    
    INSERT INTO core.person (person_type, first_name, last_name, email, phone, city, state)
    VALUES ('individual', 'Michael', 'Johnson', 'm.johnson@courtreporters.com', '(412) 555-9002', 'Pittsburgh', 'PA')
    RETURNING id INTO v_person_id;
    INSERT INTO scheduling.court_reporter (person_id, office, is_active)
    VALUES (v_person_id, 'pittsburgh', TRUE);
    
    INSERT INTO core.person (person_type, first_name, last_name, email, phone, city, state)
    VALUES ('individual', 'Amanda', 'Brown', 'a.brown@courtreporters.com', '(212) 555-9003', 'New York', 'NY')
    RETURNING id INTO v_person_id;
    INSERT INTO scheduling.court_reporter (person_id, office, is_active)
    VALUES (v_person_id, 'new_york', TRUE);
END $$;

-- Insert hearings
INSERT INTO scheduling.hearing (case_id, hearing_type, hearing_format, status, scheduled_date, scheduled_time, estimated_duration, courtroom_id, judge_id, court_reporter_id, notes) VALUES
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 'initial', 'in_person', 'scheduled', 
 '2026-04-15', '10:00:00', '2 hours',
 (SELECT id FROM scheduling.courtroom WHERE name = 'Room 402'),
 (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'pittsburgh' LIMIT 1),
 (SELECT id FROM scheduling.court_reporter WHERE office = 'pittsburgh' LIMIT 1),
 'Initial hearing on pneumoconiosis claim'),
((SELECT id FROM core.case WHERE docket_number = '2025LHC00128'), 'continued', 'hybrid', 'held',
 '2026-03-10', '09:00:00', '4 hours',
 (SELECT id FROM scheduling.courtroom WHERE name = 'Room 301'),
 (SELECT id FROM core."user" WHERE role = 'alj' AND office = 'new_york' LIMIT 1),
 (SELECT id FROM scheduling.court_reporter WHERE office = 'new_york' LIMIT 1),
 'Day 1 of evidentiary hearing - Claimant and medical testimony');

-- ============================================================================
-- JUDICIAL SCHEMA
-- ============================================================================

-- Insert bench memos
INSERT INTO judicial.bench_memo (case_id, legal_issue, standard_of_review, recommended_outcome, clerk_notes, created_by) VALUES
((SELECT id FROM core.case WHERE docket_number = '2024BLA00042'), 
 'Whether claimant established clinical pneumoconiosis under 20 C.F.R. § 718.202',
 'Preponderance of the evidence',
 'Recommend finding pneumoconiosis based on qualifying pulmonary function tests and medical opinion',
 'Key issues: 1) Qualifying PFTs (FEV1 52% predicted), 2) Medical opinion from treating physician Dr. Smith, 3) 17 years coal mine employment',
 (SELECT id FROM core."user" WHERE role = 'attorney_advisor' LIMIT 1));

-- Insert decision drafts
INSERT INTO judicial.decision_draft (case_id, draft_type, content, status, version, clerk_comments, created_by) VALUES
((SELECT id FROM core.case WHERE docket_number = '2024PER00015'), 'decision', 
 'DECISION AND ORDER...

FINDINGS OF FACT:

1. Petitioner TechCorp Industries filed a PERM labor certification application on...

CONCLUSIONS OF LAW:

1. The Administrative Law Judge correctly found that...

ORDER:

Accordingly, the Administrative Law Judges Decision and Order is...

', 'draft', 1, 'Initial draft - needs review of legal citations',
 (SELECT id FROM core."user" WHERE role = 'attorney_advisor' LIMIT 1));

-- ============================================================================
-- IDENTITY SCHEMA
-- ============================================================================

-- Insert sample sessions
INSERT INTO identity.session (user_id, token_hash, mfa_verified, ip_address, user_agent, expires_at)
SELECT 
    id, 
    'hashed-token-' || id, 
    TRUE, 
    '192.168.1.100', 
    'Mozilla/5.0...',
    CURRENT_TIMESTAMP + INTERVAL '24 hours'
FROM core."user" 
WHERE is_active = TRUE
LIMIT 5;

-- ============================================================================
-- AI SCHEMA
-- ============================================================================

-- Insert sample AI requests/results
INSERT INTO ai.ai_request (request_type, input_data, model_name, created_by) VALUES
('validation', 
 '{"filing_id": "filing-uuid", "document_text": "CLAIM FOR BENEFITS...", "fields": ["ssn", "signature", "dateOfInjury"]}',
 'gemini-2.0-flash',
 (SELECT id FROM core."user" LIMIT 1)),
('assignment',
 '{"case_type": "BLA", "office": "pittsburgh", "current_judge_loads": {"judge1": 24, "judge2": 18}}',
 'gemini-2.0-flash',
 (SELECT id FROM core."user" LIMIT 1));

INSERT INTO ai.ai_result (request_id, result_data, confidence_score, processing_time_ms)
SELECT 
    id,
    '{"ai_score": 98, "deficiencies": [], "is_auto_docket_ready": true}'::jsonb,
    0.98,
    1250
FROM ai.ai_request 
WHERE request_type = 'validation'
LIMIT 1;

-- ============================================================================
-- NOTIFICATION SCHEMA
-- ============================================================================

-- Insert sample notifications
INSERT INTO notification.notification (recipient_person_id, notification_type, channel, subject, content, status, created_by)
SELECT
    p.id,
    'hearing_scheduled',
    'email',
    'Notice of Hearing - 2024BLA00042',
    'You are hereby notified that a hearing will be held on April 15, 2026 at 10:00 AM...',
    'sent',
    (SELECT id FROM core."user" LIMIT 1)
FROM core.person p
WHERE p.email IN ('john.doe@legalaid.org', 'jane.smith@hansenlaw.com');

-- Insert service records
INSERT INTO notification.service_record (case_id, served_to_person_id, service_method, tracking_number, is_compliant)
SELECT
    (SELECT id FROM core.case WHERE docket_number = '2024BLA00042'),
    (SELECT id FROM core.person WHERE email = 'john.doe@legalaid.org'),
    'electronic',
    NULL,
    TRUE;

-- ============================================================================
-- REFRESH MATERIALIZED VIEWS
-- ============================================================================

REFRESH MATERIALIZED VIEW reporting.case_metrics;
REFRESH MATERIALIZED VIEW reporting.judge_workload;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show case count by type
SELECT case_type, COUNT(*) as case_count 
FROM core.case 
GROUP BY case_type;

-- Show docket events per case
SELECT c.docket_number, COUNT(de.id) as event_count
FROM core.case c
LEFT JOIN core.docket_event de ON c.id = de.case_id
GROUP BY c.docket_number
ORDER BY c.docket_number;

-- Show party representation
SELECT 
    c.docket_number,
    cp.role_in_case,
    p.first_name || ' ' || p.last_name as party_name,
    CASE WHEN cp.represented_by IS NOT NULL THEN 'Yes' ELSE 'No' END as represented
FROM core.case_party cp
JOIN core.case c ON cp.case_id = c.id
JOIN core.person p ON cp.person_id = p.id
ORDER BY c.docket_number, cp.role_in_case;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
