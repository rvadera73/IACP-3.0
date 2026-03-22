# IACP 3.0 - Product Requirements Document (PRD)

**Version:** 3.1  
**Date:** March 22, 2026  
**Status:** Aligned with Architecture  
**References:** 
- `docs/ARCHITECTURE.md` - Enterprise architecture
- `docs/DATA_MODEL.md` - Domain data model  
- `docs/DECISIONS.md` - Architecture Decision Records (ADR-001 to ADR-018)
- `src/core/rbac.ts` - Role-based access control
- `src/types.ts` - TypeScript type definitions

---

## 1. Executive Summary

### 1.1 Purpose

The **Intelligent Adjudicatory Case Portal (IACP) 3.0** is a unified web-based electronic filing and case management system for the Department of Labor's Office of Administrative Law Judges (OALJ). It replaces legacy paper-based and fragmented digital workflows with a modern, AI-powered platform.

### 1.2 Business Objectives

| Objective | Target | Baseline |
|-----------|--------|----------|
| Reduce manual intake time | 80-90% reduction | Manual processing |
| Reduce deficient filings | 95% reduction | ~30% deficiency rate |
| Improve decision turnaround | 20% faster | Variable by case type |
| Enhance judicial collaboration | Real-time redlining | Email-based review |
| Increase transparency | 100% public case visibility | Limited access |

### 1.3 Scope

**In Scope (v1.0):**
- Public Portal: Case search, e-filing, status tracking (Google OAuth)
- Internal Portal: Clerk/Judge/Attorney-Advisor dashboards
- AI-powered intake validation (PII detection, signature verification)
- Auto-docketing (AI score ≥ 90)
- Smart judge assignment (40% workload + 30% geography + 20% expertise + 10% rotation)
- Hearing scheduling with Pro Se rules (14-day notice, certified mail)
- Judicial workspace (bench memos, draft decisions, redline, sign/release)
- Event-sourced docket (immutable audit trail)
- Party-centric data model (persons/orgs span multiple cases)

**Out of Scope (v1.0):**
- Login.gov integration (deferred to v1.1)
- Legacy data migration (separate project)
- Mobile native apps (responsive web only)
- Offline capabilities (service worker)

---

## 2. System Architecture Overview

### 2.1 Architecture Decisions

All architecture decisions are recorded in `docs/DECISIONS.md`. Key decisions:

| ADR | Decision | Impact |
|-----|----------|--------|
| ADR-001 | Python + FastAPI backend | Auto OpenAPI docs, async-native |
| ADR-002 | Single PostgreSQL database | Schema-level separation, not per-service DBs |
| ADR-004 | Google Pub/Sub event bus | Async inter-service communication |
| ADR-005 | Event-sourced docket | Immutable events, natural audit trail |
| ADR-006 | Party-centric data model | Person/org records span multiple cases |
| ADR-009 | Two frontend apps | Public Portal + Internal Portal |
| ADR-012 | Sealed document isolation | Separate GCS bucket with restricted IAM |

### 2.2 Service Map

```
┌────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                           │
│                   (All FastAPI on Cloud Run)                    │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ public-gateway   │  │ internal-gateway │                    │
│  │ Port: 8000       │  │ Port: 8010       │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
│           │                     │                               │
│  ┌────────▼─────────────────────▼─────────┐                    │
│  │          DOMAIN SERVICES                │                    │
│  │  court-record (8001)  │  filing-review (8002)               │
│  │  document-mgmt (8003) │  scheduling (8004)                  │
│  │  judicial-work (8005) │  ai-engine (8006)                   │
│  │  notification (8007)  │  identity (8008)                    │
│  └─────────────────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────┘
```

### 2.3 Technology Stack

| Layer | Technology | ADR |
|-------|------------|-----|
| Frontend | React 19, TypeScript, Vite, TailwindCSS 4 | ADR-009 |
| Backend | Python 3.11+, FastAPI, Pydantic v2 | ADR-001 |
| Database | PostgreSQL 15 (Cloud SQL) | ADR-002 |
| Real-time | Firestore | ADR-003 |
| Event Bus | Google Pub/Sub | ADR-004 |
| Storage | GCS (3 buckets) | ADR-012 |
| Auth | Google OAuth 2.0 (v1.0) | ADR-007 |
| RBAC | PyCasbin | ADR-010 |

---

## 3. User Roles & Permissions

### 3.1 Role Registry

**Source:** `src/core/rbac.ts`, `docs/DATA_MODEL.md`

#### OALJ Roles (Adjudication: BLA, LHC, PER)

| Role | Display | Permissions |
|------|---------|-------------|
| `OALJ Docket Clerk` | Operations | canDocket, canAssign, canViewAllCases, canTransferCase |
| `OALJ Legal Assistant` | Chambers Support | canScheduleHearing, canManageExhibits |
| `OALJ Attorney-Advisor` | Chambers Support | canDraftDecision |
| `Administrative Law Judge` | Judicial | canDraftDecision, canSignDecision, canSealDocument, canCloseRecord, canViewAllCases, canTransferCase |

#### Boards Roles (Appellate: BRB, ARB, ECAB)

| Role | Display | Permissions |
|------|---------|-------------|
| `Board Docket Clerk` | Operations | canDocket, canAssign, canViewAllCases, canTransferCase |
| `Board Legal Assistant` | Chambers Support | canScheduleHearing |
| `Board Attorney-Advisor` | Chambers Support | canDraftDecision |
| `Board Member` | Judicial | canDraftDecision, canSignDecision, canSealDocument, canCloseRecord, canViewAllCases, canTransferCase |

### 3.2 Permission Matrix

See `src/core/rbac.ts` for complete `ROLE_PERMISSIONS` implementation.

---

## 4. Case Types & Programs

### 4.1 OALJ Case Types (v1.0)

**Source:** `src/constants.ts`, `docs/DATA_MODEL.md`

| Code | Name | Statute | Characteristics |
|------|------|---------|-----------------|
| **BLA** | Black Lung Benefits Act | 30 USC §901+ | Pneumoconiosis claims, 270-day deadline |
| **LHC** | Longshore & Harbor Workers' Comp | 33 USC §901+ | Maritime injury/death |
| **PER** | BALCA/PERM | 20 C.F.R. §656 | Labor certification appeals |

### 4.2 Boards Case Types (v1.0)

| Code | Name | Appeals From |
|------|------|--------------|
| **BRB** | Benefits Review Board | BLA, LHC, LDA, DCW |
| **ARB** | Administrative Review Board | Whistleblower, OFCCP, DBA, SCA |
| **ECAB** | Employees' Comp Appeals Board | FECA (separate system) |

### 4.3 Case Numbering Format

```
YYYYTTTNNNNNN
│   │  │
│   │  └── Sequential (5-6 digits)
│   └───── Case type (BLA, LHC, PER, etc.)
└───────── Fiscal year (4 digits)

Example: 2026BLA00011 = 11th BLA case in FY2026
```

---

## 5. Functional Requirements

### 5.1 Public Portal (External)

#### FR-PUB-001: Case Search
**Priority:** P0  
**User Story:** As a member of the public, I want to search for case information so that I can research legal matters.

**Acceptance Criteria:**
- [ ] Search by case number, party name, attorney
- [ ] Filter by case type, date range, status
- [ ] View docket entries (public only)
- [ ] View public documents
- [ ] Sealed documents hidden
- [ ] PII redacted from public view

---

#### FR-PUB-002: Electronic Filing
**Priority:** P0  
**User Story:** As an attorney/claimant, I want to file documents electronically so that I can initiate or participate in cases.

**Acceptance Criteria:**
- [ ] Google OAuth authentication required
- [ ] Upload multiple documents (max 50MB each, 100MB total)
- [ ] AI real-time validation (PII, signature, completeness)
- [ ] Receive instant Intake ID
- [ ] Track filing status

---

### 5.2 Internal Portal - Docket Clerk

#### FR-CLK-001: Priority Intake Queue
**Priority:** P0  
**User Story:** As a docket clerk, I want to see new filings sorted by urgency and completeness so that I can prioritize my work.

**Acceptance Criteria:**
- [ ] Dashboard displays all pending intakes
- [ ] Sorted by AI-detected urgency (statute of limitations, emergency)
- [ ] Completeness score visible (0-100)
- [ ] Filter by case type, channel (UFS/Email/Paper), status
- [ ] Bulk actions for similar filings

**Data:** `src/data/mockDataEnhanced.ts` → `INTAKE_QUEUE[]`

---

#### FR-CLK-002: Auto-Docketing
**Priority:** P0  
**User Story:** As a docket clerk, I want to convert verified filings into docket records with one click so that I can process cases efficiently.

**Acceptance Criteria:**
- [ ] Click "Docket" on filing with AI score ≥ 90
- [ ] System runs AI validation
- [ ] Generates docket number (YYYY-TTT-NNNNNN)
- [ ] Creates initial docket events
- [ ] Confirmation displayed

**Service:** `src/services/autoDocketing.ts` → `autoDocketFiling()`

---

#### FR-CLK-003: Smart Judge Assignment
**Priority:** P0  
**User Story:** As a docket clerk, I want the system to suggest optimal judge assignments so that I can balance workloads and leverage expertise.

**Acceptance Criteria:**
- [ ] Click "Assign" on docketed case
- [ ] System displays Top 3 judge suggestions
- [ ] Each shows:
  - Current workload (cases/weighted load)
  - Geographic expertise (office match)
  - Case type expertise (specialty)
  - 270-day compliance rate
- [ ] AI provides reasons for each suggestion
- [ ] Clerk can override with reason

**Algorithm:**
```
score = (
  workloadScore * 0.40 +      // Lower load = higher
  geographyScore * 0.30 +     // Same office = higher
  expertiseScore * 0.20 +     // Specialty match = higher
  rotationScore * 0.10        // Least recent = higher
)
```

**Service:** `src/services/smartAssignment.ts` → `getSuggestedJudges()`

---

#### FR-CLK-004: Deficiency Management
**Priority:** P0  
**User Story:** As a docket clerk, I want to generate deficiency notices automatically so that I can return incomplete filings efficiently.

**Acceptance Criteria:**
- [ ] System identifies deficiencies via AI
- [ ] Types: Missing Signature, Illegible Field, Missing Required Field, Invalid Format, Missing Document
- [ ] Clerk reviews and confirms
- [ ] System generates "Return to Filer" notice
- [ ] Notice lists all deficiencies with deadline (14 days)
- [ ] Filer receives email
- [ ] System tracks resubmission

**Data:** `src/data/mockDataEnhanced.ts` → `Deficiency[]`, `DEFICIENCY_NOTICES[]`

---

### 5.3 Internal Portal - Legal Assistant

#### FR-LA-001: Smart Hearing Scheduler
**Priority:** P0  
**User Story:** As a legal assistant, I want to schedule hearings with optimal dates so that I can coordinate judge, courtroom, and court reporter availability.

**Acceptance Criteria:**
- [ ] System suggests 3 optimal dates
- [ ] Dates consider:
  - Judge availability
  - Courtroom availability
  - Court reporter availability
- [ ] Pro Se rules enforced:
  - 14-day notice required
  - Certified mail service required
- [ ] Represented parties: 7-day notice, electronic service OK
- [ ] Notice of Hearing generated automatically
- [ ] Service validation before confirm

**Service:** `src/services/smartScheduler.ts`:
- `findOptimalHearingDates()`
- `generateNoticeOfHearing()`
- `dispatchCourtReporter()`
- `validateProSeService()`

---

### 5.4 Internal Portal - Judge

#### FR-JDG-001: 270-Day Deadline Tracking
**Priority:** P0  
**User Story:** As a judge, I want to see upcoming and overdue deadlines so that I can manage my caseload and remain compliant.

**Acceptance Criteria:**
- [ ] Dashboard shows deadline alerts (Red/Amber/Green)
- [ ] Red: Cases overdue (>270 days)
- [ ] Amber: Cases due within 30 days (240-270 days)
- [ ] Green: Cases on track (<240 days)
- [ ] Click alert to view affected cases
- [ ] Weekly reminder emails

**Regulation:** 20 C.F.R. § 725.458 (Black Lung 270-day rule)

---

#### FR-JDG-002: Redline Decision Editor
**Priority:** P0  
**User Story:** As a law clerk/attorney-advisor, I want to draft decisions with tracked changes so that judges can review my work efficiently.

**Acceptance Criteria:**
- [ ] Rich text editor
- [ ] All changes tracked:
  - Yellow: Added text
  - Green: Corrected text
  - Red strikethrough: Deleted text
- [ ] Comments inline
- [ ] Version history (v1, v2, v3)
- [ ] Judge can accept/reject changes
- [ ] Final version ready for signature

**Component:** `src/components/oalj/JudgeRedlineView.tsx`

---

#### FR-JDG-003: Electronic Signature
**Priority:** P0  
**User Story:** As a judge, I want to sign decisions electronically so that I can release decisions without physical presence.

**Acceptance Criteria:**
- [ ] Click "Sign & Release"
- [ ] System applies electronic signature
- [ ] Signature includes:
  - Judge name
  - Date/time
  - Cryptographic hash
- [ ] Decision marked as "Signed"
- [ ] NEF generated and served to parties
- [ ] Document sealed (read-only)

**Compliance:** E-SIGN Act (15 U.S.C. § 7001)

---

### 5.5 Internal Portal - Attorney-Advisor

#### FR-AA-001: Bench Memorandum Editor
**Priority:** P1  
**User Story:** As an attorney-advisor, I want to draft bench memos so that I can support judges with legal analysis.

**Acceptance Criteria:**
- [ ] Template-based drafting
- [ ] Link to case documents/exhibits
- [ ] Legal research integration
- [ ] Submit for judge review

---

#### FR-AA-002: Legal Research Tools
**Priority:** P1  
**User Story:** As an attorney-advisor, I want to search case law and regulations so that I can support accurate legal analysis.

**Acceptance Criteria:**
- [ ] Search interface for case law
- [ ] Database includes:
  - Supreme Court cases
  - Circuit Court cases
  - BRB/ARB/ECAB precedents
- [ ] Regulations database (20 C.F.R.)
- [ ] Citation format checker

**Component:** `src/components/oalj/LegalResearchTools.tsx`

---

### 5.6 Event Registry

**Source:** `docs/DATA_MODEL.md` - Event Type Registry

| Event Type | Category | Trigger | Payload |
|-----------|----------|---------|---------|
| `filing.submitted` | filing | Public portal submission | filing_id, case_type, channel |
| `filing.validated` | system | AI validation complete | ai_score, deficiencies[], is_auto_docketed |
| `filing.auto_docketed` | action | Score ≥ 90 | docket_number, clerk_id |
| `case.docketed` | action | Docket number assigned | docket_number, method |
| `case.assigned` | action | Judge assigned | judge_id, assignment_score |
| `hearing.scheduled` | action | Date set | hearing_id, date, location |
| `decision.signed` | order | ALJ signs | decision_id, document_id |
| `decision.released` | notice | Served to parties | service_list[], method |
| `sla.alert.amber` | system | 30-90 days remaining | case_id, days_remaining |
| `sla.alert.red` | system | <30 days remaining | case_id, days_remaining |
| `sla.alert.breached` | system | Deadline passed | case_id, days_overdue |

---

## 6. Data Model Summary

### 6.1 Core Entities

**Full definitions:** `docs/DATA_MODEL.md` Section 4

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **Person** | Individual or organization | id, type, name, contact, bar_number |
| **User** | Internal staff | id, person_id, role, office, chambers_id |
| **Case** | Adjudicatory matter | id, docket_number, case_type, phase, status, assigned_judge_id, sla_deadline |
| **CaseParty** | Party in case | id, case_id, person_id, role_in_case, represented_by |
| **DocketEvent** | Immutable event | id, case_id, event_type, event_data, actor_id, occurred_at |
| **Document** | Filed/stored doc | id, case_id, type, gcs_path, access_level, is_sealed |
| **DocumentVersion** | Version history | id, document_id, version_number, gcs_path, change_note |
| **Hearing** | Scheduled hearing | id, case_id, format, date, location, judge_id, status |

### 6.2 Party-Centric Model

```
                    ┌─────────────┐
                    │   PERSON    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌──────▼──┐  ┌─────▼────┐
       │  USER   │  │  PARTY  │  │REPRESEN- │
       │(internal│  │(external│  │ TATION   │
       │ staff)  │  │ party)  │  │(atty)    │
       └────┬────┘  └────┬────┘  └──────────┘
            │            │
            │     ┌──────▼──────┐
            │     │ CASE_PARTY  │
            │     └──────┬──────┘
            │            │
    ┌───────▼────────────▼───────┐
    │          CASE              │
    └─────────┬─────────────────┘
              │
          ┌───┴───────┐
          │           │
   ┌──────▼──┐  ┌────▼────┐
   │ DOCKET  │  │DOCUMENT │
   │ EVENT   │  │         │
   └─────────┘  └─────────┘
```

### 6.3 Database Schemas

**Source:** `docs/ARCHITECTURE.md` Section 5.5

```sql
-- PostgreSQL schemas (logical separation)
core          -- cases, parties, case_parties, docket_events
filing        -- filings, deficiencies, validation_results
document      -- documents, document_versions, exhibits
scheduling    -- hearings, courtrooms, reporters
judicial      -- bench_memos, decision_drafts, draft_versions
identity      -- users, roles, permissions, sessions
ai            -- ai_requests, ai_results
notification  -- notifications, service_records
reporting     -- materialized views, aggregates
```

---

## 7. Case Lifecycle

### 7.1 Phase Registry (FSM)

**Source:** `docs/DATA_MODEL.md`, ADR-011

```
INTAKE → DOCKETED → ASSIGNED → PRE_HEARING → HEARING → POST_HEARING → DECISION → CLOSED
                                                                        │
                                                                  ┌─────┴─────┐
                                                                  │           │
                                                               APPEALED   REMANDED
```

| Phase | Entry Condition |
|-------|-----------------|
| `intake` | Filing received |
| `docketed` | Validation passed (AI score ≥ 90 or clerk approved) |
| `assigned` | Judge assigned |
| `pre_hearing` | Discovery, motions, scheduling |
| `hearing` | Formal hearing commenced |
| `post_hearing` | Record closed for decision |
| `decision` | ALJ issued Decision & Order |
| `closed` | No appeal within deadline |
| `appealed` | Notice of appeal filed |
| `remanded` | Returned from appeals board |

### 7.2 Status Registry

| Status | Phase | Description |
|--------|-------|-------------|
| `pending_review` | intake | Awaiting clerk review |
| `deficient` | intake | Has deficiencies |
| `auto_docketed` | docketed | AI auto-docketed |
| `awaiting_assignment` | docketed | No judge assigned |
| `discovery` | pre_hearing | Discovery open |
| `hearing_scheduled` | pre_hearing | Date confirmed |
| `draft_in_progress` | post_hearing | AA drafting |
| `decision_issued` | decision | ALJ signed |
| `settled` | any | Parties settled |
| `dismissed` | any | Case dismissed |

---

## 8. Document Management

### 8.1 Storage Architecture

**Source:** ADR-012

```
GCS Buckets (per environment):
├── iacp-documents-{env}/       # Standard documents
│   ├── filings/
│   ├── exhibits/
│   ├── decisions/
│   └── notices/
│
├── iacp-sealed-{env}/          # RESTRICTED IAM
│   ├── sealed-filings/
│   ├── in-camera/
│   └── sealed-orders/
│
└── iacp-generated-{env}/       # System-generated
    ├── docket-sheets/
    ├── hearing-notices/
    └── deficiency-notices/
```

### 8.2 Document Type Registry

| Type | Category | Access Default |
|------|----------|---------------|
| `petition`, `claim_form` | filing | parties_only |
| `motion`, `brief` | filing | parties_only |
| `evidence_medical`, `evidence_employment` | exhibit | parties_only |
| `transcript` | record | internal |
| `bench_memo`, `draft_decision` | chambers | chambers |
| `decision_order` | order | public (after service) |
| `notice_hearing`, `notice_deficiency` | notice | parties_only |

### 8.3 PDF Generation

**Source:** ADR-013

- **Tool:** WeasyPrint + Jinja2 templates
- **Format:** PDF/A for archival compliance
- **Templates:** `services/document-mgmt/templates/`

---

## 9. Security & Compliance

### 9.1 Authentication

**Source:** ADR-007, ADR-008

| User Type | Method (v1.0) | Method (v1.1) |
|-----------|---------------|---------------|
| Public | Google OAuth | Login.gov |
| Internal | Google OAuth + SSO mock | Login.gov + PIV/CAC |
| Service-to-Service | API keys (Secret Manager) | Same |

### 9.2 Authorization

**Source:** ADR-010

- **Engine:** PyCasbin + fastapi-authz
- **Model:** RBAC with policy-based rules
- **Storage:** PostgreSQL `identity` schema

### 9.3 Sealed Document Isolation

**Source:** ADR-012

- **Physical isolation:** Separate GCS bucket
- **IAM:** Restricted to ALJ + authorized staff
- **Audit:** Separate access log table
- **Compliance:** Post-2025 CM/ECF breach best practices

### 9.4 Regulatory Compliance

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| E-SIGN Act | Electronic signatures | Cryptographic hashes on signed docs |
| Privacy Act 1974 | PII protection | AI redaction, access controls |
| 20 C.F.R. § 725.458 | 270-day BLA deadline | SLA tracking, alerts |
| 20 C.F.R. § 702.341 | Service rules | Pro Se certified mail validation |
| WCAG 2.1 AA | Accessibility | Automated + manual testing |

---

## 10. Success Metrics

### 10.1 Key Performance Indicators

| KPI | Baseline | Target | Measurement |
|-----|----------|--------|-------------|
| Intake processing time | 45 min/case | 9 min/case | Time study |
| Deficiency rate | ~30% | < 5% | Analytics |
| 270-day compliance | 85% | > 95% | Dashboard |
| Hearing scheduling time | 3 days | < 1 day | Time study |
| User satisfaction | N/A | > 4.0/5.0 | Survey |
| System uptime | N/A | > 99.9% | Monitoring |

### 10.2 Business Outcomes

| Outcome | Metric | Target Date |
|---------|--------|-------------|
| Reduced manual labor | 80-90% intake time reduction | 6 months post-launch |
| Faster adjudication | 20% reduction in avg. duration | 12 months post-launch |
| Improved accuracy | 95% reduction in deficient filings | 3 months post-launch |
| Enhanced transparency | 100% public case visibility | Launch |

---

## 11. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ALJ** | Administrative Law Judge |
| **OALJ** | Office of Administrative Law Judges |
| **OWCP** | Office of Workers' Compensation Programs |
| **BRB** | Benefits Review Board |
| **ARB** | Administrative Review Board |
| **ECAB** | Employees' Compensation Appeals Board |
| **BLA** | Black Lung Benefits Act |
| **LHC** | Longshore and Harbor Workers' Compensation Act |
| **PER** | PERM/BALCA (labor certification) |
| **NEF** | Notice of Electronic Filing |
| **PD&O** | Proposed Decision & Order |
| **D&O** | Decision & Order |

### Appendix B: Mock Data Sources

| Data Type | Source File |
|-----------|-------------|
| Intake Queue | `src/data/mockDataEnhanced.ts` → `INTAKE_QUEUE[]` |
| Judges | `src/data/mockDataEnhanced.ts` → `JUDGES[]` |
| Court Reporters | `src/data/mockDataEnhanced.ts` → `COURT_REPORTERS[]` |
| Courtrooms | `src/data/mockDataEnhanced.ts` → `COURTROOMS[]` |
| Deficiency Notices | `src/data/mockDataEnhanced.ts` → `DEFICIENCY_NOTICES[]` |
| Comprehensive Cases | `src/data/mockCaseData.ts` → `COMPREHENSIVE_MOCK_CASES` |
| Dashboard Data | `src/data/mockDashboardData.ts` → `MOCK_CASE_FOLDERS` |

### Appendix C: Service Interfaces

**Auto-Docketing:** `src/services/autoDocketing.ts`
```typescript
autoDocketFiling(filingData, caseType, documentText): AutoDocketResult
generateDeficiencyNotice(caseId, deficiencies[]): string
```

**Smart Assignment:** `src/services/smartAssignment.ts`
```typescript
getSuggestedJudges(caseType, office, currentLoad): AssignmentResult
```

**Smart Scheduling:** `src/services/smartScheduler.ts`
```typescript
findOptimalHearingDates(options): HearingSchedule[]
generateNoticeOfHearing(caseNumber, claimant, employer, schedule, parties): NoticeOfHearing
dispatchCourtReporter(office, date, caseNumber): ReporterDispatch
validateProSeService(parties, proposedMethod): ServiceValidation
```

---

**Document History:**

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | March 22, 2026 | Initial from external references |
| 3.1 | March 22, 2026 | Aligned with IACP 3.0 architecture (ADR-001 to ADR-018) |
