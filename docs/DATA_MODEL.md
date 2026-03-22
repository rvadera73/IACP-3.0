# IACP 3.0 — Domain Data Model

> This document defines the DOL OALJ adjudication domain model from first principles.
> It is the single source of truth for all entity definitions, relationships, and business rules.
>
> Last updated: 2026-03-22

---

## 1. Domain Context: DOL OALJ Adjudication

### What OALJ Does
The Office of Administrative Law Judges (OALJ) is the **administrative trial court** for the U.S. Department of Labor. ALJs conduct formal hearings and issue decisions on ~50 case types across workers' compensation, whistleblower protection, labor standards enforcement, and immigration labor certification.

### What OALJ Does NOT Handle
- FECA (Federal Employees' Compensation Act) — handled by ECAB
- OSHA enforcement — handled by OSHRC
- Mine safety — handled by FMSHRC
- Labor relations — handled by NLRB

### Adjudication Flow (Simplified)
```
OWCP / Agency Program                        OALJ                           Appeals Board
────────────────────                    ─────────────                    ──────────────
Claim filed with DOL
     │
OWCP investigation
     │
Initial determination
(Proposed Decision & Order)
     │
Party requests hearing ─────────────►  Case referred to OALJ
                                            │
                                       Case docketed
                                            │
                                       Judge assigned
                                            │
                                       Pre-hearing
                                       (discovery, motions)
                                            │
                                       Formal hearing
                                            │
                                       ALJ Decision & Order   ────►   Appeal to BRB/ARB
                                                                            │
                                                                       Board Decision
                                                                            │
                                                                       Federal Court
                                                                       (if further appeal)
```

---

## 2. Case Type Registry

### Case Type Categories

| Category | Acronyms | Appeal Board | Description |
|----------|----------|-------------|-------------|
| **Workers' Compensation** | BLA, LHC, LDA, LHK, DCW | BRB | Occupational disease/injury claims |
| **Whistleblower** | AIR, CAA, ERA, SOX, SWD, TSC, CRA, and others | ARB | Employee protection / retaliation |
| **Contract Compliance** | OFC | ARB | OFCCP enforcement (E.O. 11246) |
| **Wage & Hour** | DBA, SCA | ARB | Davis-Bacon Act, Service Contract Act |
| **Immigration** | INA | BALCA | Alien labor certification |
| **Fair Labor Standards** | FLS | ARB | FLSA enforcement |
| **Other** | DCA, MSA, RIS, and others | Varies | Debt collection, mine safety mods, ERISA |

### Case Numbering Format
```
YYYYTTTNNNNNN
│   │  │
│   │  └── Sequential number (5-6 digits, zero-padded)
│   └───── Case type acronym (3 letters)
└───────── Fiscal year (4 digits, federal FY starts Oct 1)

Examples:
  2026BLA00011  — 11th Black Lung case in FY2026
  2026LHC00345  — 345th Longshore case in FY2026
  2026SOX00007  — 7th Sarbanes-Oxley whistleblower case in FY2026
```

### v1.0 Scope: Primary Case Types
For v1.0, we focus on the highest-volume OALJ case types:

| Code | Full Name | Statute | Key Characteristics |
|------|-----------|---------|---------------------|
| **BLA** | Black Lung Benefits Act | 30 USC §901+ | Miner pneumoconiosis claims. Responsible operator identified. OWCP refers after PD&O. 80% appeal rate by operators. |
| **LHC** | Longshore & Harbor Workers' Comp | 33 USC §901+ | Maritime injury/death. Informal conference precedes formal hearing. |
| **LDA** | Defense Base Act | 42 USC §1651+ | Extension of LHWCA to overseas contractors |
| **DCW** | DC Workers' Compensation | 36 DC Code | LHWCA extension for District of Columbia |

v1.1+ will add whistleblower (SOX, ERA, etc.), OFCCP, DBA/SCA, and INA/BALCA.

---

## 3. Entity Relationship Diagram

```
                                    ┌──────────────┐
                                    │    PERSON     │
                                    │              │
                                    │ id           │
                                    │ type (indiv/ │
                                    │   org)       │
                                    │ name         │
                                    │ contact_info │
                                    │ identifiers  │
                                    └──────┬───────┘
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                       ┌──────▼──┐  ┌──────▼──┐  ┌─────▼────┐
                       │  USER   │  │  PARTY  │  │REPRESEN- │
                       │(internal│  │(external│  │ TATION   │
                       │ staff)  │  │ party)  │  │(atty-    │
                       │         │  │         │  │ client)  │
                       │ role    │  │ type    │  │          │
                       │ office  │  │(claimant│  │ person → │
                       │ chambers│  │employer │  │ party    │
                       └────┬────┘  │insurer) │  │ case     │
                            │       └────┬────┘  └──────────┘
                            │            │
                            │     ┌──────▼──────┐
                            │     │ CASE_PARTY  │  (junction)
                            │     │             │
                            │     │ case_id     │
                            │     │ party_id    │
                            │     │ role_in_case│
                            │     │ status      │
                            │     └──────┬──────┘
                            │            │
                    ┌───────▼────────────▼───────┐
                    │          CASE              │
                    │                           │
                    │ id                        │
                    │ docket_number             │
                    │ case_type                 │
                    │ title (caption)           │
                    │ current_phase             │
                    │ current_status            │
                    │ assigned_judge_id → USER  │
                    │ referral_date             │
                    │ docketed_date             │
                    │ sla_deadline              │
                    │ district_office           │
                    └─────────┬─────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
   ┌──────▼──────┐    ┌──────▼──────┐    ┌───────▼──────┐
   │DOCKET_EVENT │    │  DOCUMENT   │    │   HEARING    │
   │(event log)  │    │             │    │              │
   │             │    │ id          │    │ id           │
   │ id          │    │ case_id     │    │ case_id      │
   │ case_id     │    │ type        │    │ type         │
   │ event_type  │    │ title       │    │ format       │
   │ event_data  │    │ filed_by    │    │ date/time    │
   │ actor_id    │    │ filed_date  │    │ location     │
   │ occurred_at │    │ gcs_path    │    │ judge_id     │
   │ seq_number  │    │ access_level│    │ status       │
   └─────────────┘    │ version     │    └──────────────┘
                      └──────┬──────┘
                             │
                      ┌──────▼──────┐
                      │  DOC_VERSION│
                      │             │
                      │ version_num │
                      │ gcs_path    │
                      │ created_by  │
                      │ created_at  │
                      │ change_note │
                      └─────────────┘
```

---

## 4. Core Entities

### 4.1 Person (Party-Centric Root)

The foundational entity. Every individual or organization in the system is a Person first.

```
PERSON
├── id                  UUID (PK)
├── person_type         ENUM: 'individual', 'organization'
├── prefix              VARCHAR (Mr., Ms., Dr., Hon.)
├── first_name          VARCHAR
├── middle_name         VARCHAR (nullable)
├── last_name           VARCHAR
├── suffix              VARCHAR (Jr., Sr., III, Esq.)
├── organization_name   VARCHAR (if org type)
├── email               VARCHAR (nullable, unique if present)
├── phone               VARCHAR (nullable)
├── address_line_1      VARCHAR
├── address_line_2      VARCHAR (nullable)
├── city                VARCHAR
├── state               VARCHAR(2)
├── zip_code            VARCHAR(10)
├── country             VARCHAR (default 'US')
├── bar_number          VARCHAR (nullable — for attorneys)
├── bar_state           VARCHAR(2) (nullable)
├── created_at          TIMESTAMP
├── updated_at          TIMESTAMP
└── is_active           BOOLEAN (default true)
```

**Business rules:**
- A Person can be a party in multiple cases (party-centric design)
- Attorneys have bar_number and bar_state populated
- Organizations use organization_name (first_name/last_name null)
- Email is the primary external identifier for deduplication

### 4.2 User (Internal Staff)

Internal OALJ staff who use the CMS. Extends Person.

```
USER
├── id                  UUID (PK)
├── person_id           UUID → PERSON (FK)
├── google_oauth_id     VARCHAR (unique — from Google OAuth)
├── role                ENUM: see Role Registry below
├── office              ENUM: 'headquarters', 'boston', 'covington',
│                         'newport_news', 'san_francisco',
│                         'cherry_hill', 'pittsburgh',
│                         'washington_dc', 'cincinnati'
├── chambers_id         UUID → CHAMBERS (nullable — for ALJ/AA/LA)
├── is_active           BOOLEAN
├── last_login          TIMESTAMP
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

**Role Registry (v1.0):**
| Role Code | Display Name | Category |
|-----------|-------------|----------|
| `docket_clerk` | OALJ Docket Clerk | Operations |
| `legal_assistant` | OALJ Legal Assistant | Chambers Support |
| `attorney_advisor` | OALJ Attorney-Advisor | Chambers Support |
| `alj` | Administrative Law Judge | Judicial |
| `chief_judge` | Chief Administrative Law Judge | Judicial (Admin) |
| `sys_admin` | System Administrator | IT |

### 4.3 Case

The central aggregate. Represents a matter before OALJ.

```
CASE
├── id                  UUID (PK)
├── docket_number       VARCHAR (unique) — format: YYYYTTTNNNNNN
├── case_type           VARCHAR(3) → CASE_TYPE_REGISTRY
├── title               VARCHAR — case caption (e.g., "Smith v. ABC Coal Co.")
├── current_phase       ENUM: see Phase Registry
├── current_status      ENUM: see Status Registry
├── assigned_judge_id   UUID → USER (nullable)
├── assigned_chambers   UUID → CHAMBERS (nullable)
│
│ ── Referral Information ──
├── referring_agency    ENUM: 'owcp', 'ofccp', 'whd', 'oflc', 'other'
├── referring_office    VARCHAR — originating OWCP/agency office
├── referral_date       DATE — when agency referred to OALJ
├── referral_document_id UUID → DOCUMENT (nullable)
│
│ ── Docketing ──
├── docketed_date       DATE (nullable — null until docketed)
├── docketed_by         UUID → USER (nullable)
├── docket_method       ENUM: 'auto', 'manual'
├── ai_docket_score     FLOAT (nullable — AI validation score)
│
│ ── SLA Tracking ──
├── statutory_deadline  DATE (nullable)
├── deadline_type       VARCHAR — e.g., '270_day', 'none', 'custom'
├── sla_status          ENUM: 'green', 'amber', 'red', 'breached', 'na'
│
│ ── Case Details (BLA-specific) ──
├── mine_state          VARCHAR(2) (nullable — BLA: state where miner worked)
├── responsible_operator VARCHAR (nullable — BLA: identified employer)
│
│ ── Disposition ──
├── disposition_type    ENUM: 'decision', 'settlement', 'dismissal',
│                         'remand', 'transfer', null
├── disposition_date    DATE (nullable)
├── closed_date         DATE (nullable)
│
│ ── Metadata ──
├── created_at          TIMESTAMP
├── updated_at          TIMESTAMP
├── created_by          UUID → USER
└── is_sealed           BOOLEAN (default false)
```

**Phase Registry (Case Lifecycle FSM):**
```
INTAKE → DOCKETED → ASSIGNED → PRE_HEARING → HEARING → POST_HEARING → DECISION → CLOSED
                                                                           │
                                                                     ┌─────┴─────┐
                                                                     │           │
                                                                  APPEALED   REMANDED
```

| Phase | Description | Entry Condition |
|-------|-------------|----------------|
| `intake` | Filed but not yet docketed | Filing received |
| `docketed` | Docket number assigned | Validation passed (auto or manual) |
| `assigned` | ALJ assigned | Docket clerk assigns judge |
| `pre_hearing` | Discovery, motions, scheduling | Judge assigned |
| `hearing` | Formal hearing in progress | Hearing date set and commenced |
| `post_hearing` | Record closed, awaiting decision | Hearing concluded |
| `decision` | ALJ has issued Decision & Order | Decision signed |
| `closed` | Case concluded | No appeal filed within deadline |
| `appealed` | Party filed appeal to BRB/ARB | Notice of appeal received |
| `remanded` | Appeals board returned to OALJ | Remand order received |

**Status Registry:**
| Status | Applicable Phase(s) | Description |
|--------|---------------------|-------------|
| `pending_review` | intake | Awaiting docket clerk review |
| `deficient` | intake | Filing has deficiencies |
| `auto_docketed` | docketed | AI auto-docketed (score ≥ threshold) |
| `manually_docketed` | docketed | Docket clerk manually docketed |
| `awaiting_assignment` | docketed | Docketed but no judge assigned |
| `assigned` | assigned | Judge assigned, no hearing scheduled |
| `discovery` | pre_hearing | Discovery period open |
| `motions_pending` | pre_hearing | Pending motions before hearing |
| `hearing_scheduled` | pre_hearing | Hearing date confirmed |
| `hearing_in_progress` | hearing | Hearing underway |
| `hearing_continued` | hearing | Hearing paused, will resume |
| `record_open` | post_hearing | Post-hearing briefs being submitted |
| `record_closed` | post_hearing | Record closed for decision |
| `draft_in_progress` | post_hearing | Attorney-advisor drafting decision |
| `draft_submitted` | post_hearing | Draft submitted to ALJ |
| `decision_issued` | decision | ALJ signed and issued D&O |
| `settled` | any (before decision) | Parties reached settlement |
| `dismissed` | any | Case dismissed (voluntary or involuntary) |
| `transferred` | any | Case transferred to another ALJ |
| `on_appeal` | appealed | Appeal pending at BRB/ARB |
| `remanded` | remanded | Returned from appeals board |

### 4.4 Case Party (Junction)

Links persons to cases with their role in the case.

```
CASE_PARTY
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── person_id           UUID → PERSON (FK)
├── role_in_case        ENUM: see Party Role Registry
├── represented_by      UUID → PERSON (nullable — attorney)
├── service_method      ENUM: 'electronic', 'mail', 'both'
├── service_address     VARCHAR (if different from person address)
├── joined_date         DATE
├── withdrawn_date      DATE (nullable)
├── status              ENUM: 'active', 'withdrawn', 'deceased'
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP

UNIQUE CONSTRAINT: (case_id, person_id, role_in_case)
```

**Party Role Registry:**
| Role | Description | Applicable Case Types |
|------|-------------|----------------------|
| `claimant` | Person claiming benefits | BLA, LHC, LDA, DCW |
| `complainant` | Person filing complaint | Whistleblower, OFCCP |
| `employer` | Named employer/respondent | BLA, LHC, LDA, DCW |
| `responsible_operator` | Identified liable operator (BLA) | BLA |
| `insurance_carrier` | Employer's insurer | LHC, LDA, DCW |
| `respondent` | Named respondent | Whistleblower, OFCCP, DBA |
| `director_owcp` | OWCP Director (party of interest) | BLA, LHC |
| `intervenor` | Party granted intervention | Any |
| `amicus` | Friend of the court | Any |
| `claimant_attorney` | Attorney for claimant | Any |
| `employer_attorney` | Attorney for employer | Any |
| `solicitor` | DOL Solicitor's Office | Any |

### 4.5 Docket Event (Event-Sourced)

Immutable event log. The docket IS the case history. Append-only.

```
DOCKET_EVENT
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── sequence_number     BIGINT (auto-increment per case)
├── event_type          VARCHAR → EVENT_TYPE_REGISTRY
├── event_category      ENUM: 'filing', 'order', 'notice', 'action', 'system'
├── title               VARCHAR — human-readable description
├── event_data          JSONB — structured payload per event type
├── document_id         UUID → DOCUMENT (nullable — if event has attachment)
├── actor_id            UUID → USER or PERSON (who triggered)
├── actor_type          ENUM: 'internal_user', 'external_party', 'system'
├── occurred_at         TIMESTAMP WITH TIME ZONE
├── is_public           BOOLEAN (default true — false for sealed events)
└── created_at          TIMESTAMP
```

**Event Type Registry (partial — v1.0 core events):**

| Event Type | Category | Trigger | Payload Fields |
|-----------|----------|---------|----------------|
| `CASE_REFERRED` | action | OWCP refers to OALJ | referring_agency, referral_date, program_office |
| `FILING_RECEIVED` | filing | Filing submitted via EFS or mail | filing_type, channel, filer_id |
| `FILING_VALIDATED` | system | AI validation complete | ai_score, deficiencies[], is_auto_docketed |
| `CASE_DOCKETED` | action | Docket number assigned | docket_number, method (auto/manual), clerk_id |
| `DEFICIENCY_ISSUED` | notice | Filing deficiencies identified | deficiency_list[], deadline_to_cure |
| `DEFICIENCY_CURED` | filing | Claimant corrected deficiencies | corrected_fields[] |
| `JUDGE_ASSIGNED` | action | ALJ assigned to case | judge_id, assignment_method, assignment_score |
| `CASE_TRANSFERRED` | action | Case reassigned to different ALJ | from_judge_id, to_judge_id, reason |
| `HEARING_SCHEDULED` | action | Hearing date set | hearing_id, date, time, format, location |
| `HEARING_RESCHEDULED` | action | Hearing date changed | hearing_id, old_date, new_date, reason |
| `HEARING_HELD` | action | Hearing occurred | hearing_id, duration_minutes, witnesses[] |
| `HEARING_CONTINUED` | action | Hearing paused | hearing_id, continuation_date |
| `RECORD_CLOSED` | action | ALJ closes record for decision | closed_by, close_reason |
| `EXHIBIT_FILED` | filing | Exhibit submitted | exhibit_number, description, filed_by |
| `MOTION_FILED` | filing | Motion submitted | motion_type, filed_by, opposition_deadline |
| `MOTION_DECIDED` | order | ALJ rules on motion | motion_id, ruling (granted/denied), order_id |
| `ORDER_ISSUED` | order | ALJ issues procedural order | order_type, document_id |
| `DRAFT_SUBMITTED` | action | AA submits draft to ALJ | draft_id, draft_version |
| `DECISION_SIGNED` | order | ALJ signs Decision & Order | decision_type, document_id |
| `DECISION_SERVED` | notice | Decision served on parties | service_list[], service_method |
| `APPEAL_FILED` | filing | Notice of appeal to BRB/ARB | appeal_board, notice_date |
| `CASE_REMANDED` | action | Board returns case | remand_order_id, remand_instructions |
| `CASE_SETTLED` | action | Settlement reached | settlement_date |
| `CASE_DISMISSED` | action | Case dismissed | dismissal_type, reason |
| `CASE_CLOSED` | action | Final closure | closed_by, close_reason |
| `SLA_ALERT` | system | Deadline approaching | alert_level (green/amber/red), days_remaining |
| `DOCUMENT_SEALED` | action | Document or case sealed | sealed_by, seal_reason, document_ids[] |
| `PARTY_ADDED` | action | New party joins case | party_id, role_in_case |
| `PARTY_WITHDRAWN` | action | Party withdraws | party_id, withdrawal_date |
| `NOTICE_SENT` | notice | Any notice sent to parties | notice_type, recipients[], delivery_method |

### 4.6 Document

Metadata for all documents stored in GCS.

```
DOCUMENT
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── document_type       ENUM: see Document Type Registry
├── title               VARCHAR
├── description         VARCHAR (nullable)
├── filed_by_person_id  UUID → PERSON (nullable)
├── filed_by_user_id    UUID → USER (nullable)
├── filed_date          TIMESTAMP
├── filing_channel      ENUM: 'efs_electronic', 'email', 'mail', 'fax', 'system_generated'
│
│ ── Storage ──
├── current_version     INTEGER (default 1)
├── gcs_bucket          VARCHAR — which bucket (standard, sealed, generated)
├── gcs_path            VARCHAR — object path in GCS
├── file_name           VARCHAR — original filename
├── file_size_bytes     BIGINT
├── mime_type           VARCHAR — e.g., 'application/pdf'
├── checksum_sha256     VARCHAR — integrity verification
│
│ ── Access Control ──
├── access_level        ENUM: 'public', 'parties_only', 'internal', 'chambers', 'sealed'
├── is_sealed           BOOLEAN (default false)
├── sealed_by           UUID → USER (nullable)
├── sealed_date         TIMESTAMP (nullable)
├── seal_reason         VARCHAR (nullable)
│
│ ── Exhibit Tracking ──
├── is_exhibit          BOOLEAN (default false)
├── exhibit_number      VARCHAR (nullable) — e.g., 'CX-1', 'EX-A'
├── exhibit_party       ENUM: 'claimant', 'employer', 'director', null
│
│ ── AI Processing ──
├── ocr_processed       BOOLEAN (default false)
├── ocr_confidence      FLOAT (nullable)
├── ai_summary          TEXT (nullable)
│
│ ── Metadata ──
├── created_at          TIMESTAMP
├── updated_at          TIMESTAMP
└── is_deleted          BOOLEAN (default false) — soft delete
```

**Document Type Registry:**

| Type | Category | Who Creates | Access Default |
|------|----------|-------------|---------------|
| `petition` | filing | Claimant | parties_only |
| `claim_form` | filing | Claimant | parties_only |
| `response` | filing | Employer/Respondent | parties_only |
| `motion` | filing | Any party | parties_only |
| `brief` | filing | Any party | parties_only |
| `stipulation` | filing | Joint parties | parties_only |
| `evidence_medical` | exhibit | Any party | parties_only |
| `evidence_employment` | exhibit | Any party | parties_only |
| `evidence_other` | exhibit | Any party | parties_only |
| `transcript` | record | Court reporter | internal |
| `bench_memo` | chambers | Attorney-Advisor | chambers |
| `draft_decision` | chambers | Attorney-Advisor | chambers |
| `decision_order` | order | ALJ | public (after service) |
| `supplemental_order` | order | ALJ | public |
| `notice_hearing` | notice | System/LA | parties_only |
| `notice_deficiency` | notice | System/Clerk | parties_only |
| `notice_assignment` | notice | System | parties_only |
| `correspondence` | other | Any | varies |
| `subpoena` | order | ALJ | parties_only |

### 4.7 Document Version

Version history for documents. Immutable — new versions are new rows.

```
DOCUMENT_VERSION
├── id                  UUID (PK)
├── document_id         UUID → DOCUMENT (FK)
├── version_number      INTEGER
├── gcs_path            VARCHAR — versioned object path
├── file_size_bytes     BIGINT
├── checksum_sha256     VARCHAR
├── change_note         VARCHAR (nullable) — what changed
├── created_by          UUID → USER
├── created_at          TIMESTAMP
└── is_current          BOOLEAN (default true)

UNIQUE CONSTRAINT: (document_id, version_number)
```

### 4.8 Hearing

```
HEARING
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── hearing_type        ENUM: 'initial', 'continued', 'supplemental', 'oral_argument'
├── hearing_format      ENUM: 'in_person', 'telephonic', 'video', 'hybrid'
├── status              ENUM: 'scheduled', 'rescheduled', 'held', 'continued',
│                         'cancelled', 'postponed'
├── scheduled_date      DATE
├── scheduled_time      TIME
├── estimated_duration  INTERVAL — e.g., '2 hours'
├── actual_duration     INTERVAL (nullable)
│
│ ── Location ──
├── courtroom_id        UUID → COURTROOM (nullable)
├── location_name       VARCHAR (nullable — for off-site hearings)
├── location_address    VARCHAR (nullable)
├── video_link          VARCHAR (nullable — for video hearings)
│
│ ── Personnel ──
├── judge_id            UUID → USER (FK)
├── court_reporter_id   UUID → PERSON (nullable)
├── legal_assistant_id  UUID → USER (nullable)
│
│ ── Record ──
├── transcript_id       UUID → DOCUMENT (nullable)
├── notes               TEXT (nullable)
│
│ ── Metadata ──
├── created_at          TIMESTAMP
├── updated_at          TIMESTAMP
├── created_by          UUID → USER
└── cancelled_reason    VARCHAR (nullable)
```

### 4.9 Chambers

An ALJ's chambers — the organizational unit for judge + staff.

```
CHAMBERS
├── id                  UUID (PK)
├── judge_id            UUID → USER (FK, unique)
├── name                VARCHAR — e.g., "Chambers of Hon. Jane Smith"
├── office_location     VARCHAR — district office
├── phone               VARCHAR (nullable)
├── is_active           BOOLEAN
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

### 4.10 Judicial Work Product

Bench memos and decision drafts — chambers-only access.

```
BENCH_MEMO
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── chambers_id         UUID → CHAMBERS (FK)
├── author_id           UUID → USER (FK) — Attorney-Advisor
├── title               VARCHAR
├── content             TEXT — rich text / markdown
├── status              ENUM: 'draft', 'submitted', 'reviewed', 'archived'
├── submitted_to_judge  TIMESTAMP (nullable)
├── judge_notes         TEXT (nullable) — ALJ feedback
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP

DECISION_DRAFT
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK)
├── chambers_id         UUID → CHAMBERS (FK)
├── author_id           UUID → USER (FK)
├── current_version     INTEGER (default 1)
├── decision_type       ENUM: 'decision_order', 'supplemental_decision',
│                         'order_dismissal', 'order_remand'
├── content             TEXT — rich text
├── status              ENUM: 'draft', 'submitted', 'revision_requested',
│                         'approved', 'signed', 'released'
├── submitted_at        TIMESTAMP (nullable)
├── signed_at           TIMESTAMP (nullable)
├── signed_by           UUID → USER (nullable) — ALJ who signed
├── released_at         TIMESTAMP (nullable)
├── released_document_id UUID → DOCUMENT (nullable) — final PDF
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP

DRAFT_VERSION
├── id                  UUID (PK)
├── draft_id            UUID → DECISION_DRAFT (FK)
├── version_number      INTEGER
├── content             TEXT — snapshot of draft at this version
├── change_note         VARCHAR (nullable)
├── redline_diff        TEXT (nullable) — diff from previous version
├── created_by          UUID → USER
├── created_at          TIMESTAMP
└── is_current          BOOLEAN
```

### 4.11 Courtroom

```
COURTROOM
├── id                  UUID (PK)
├── name                VARCHAR — e.g., "Hearing Room 3"
├── office              VARCHAR — district office
├── capacity            INTEGER
├── has_video           BOOLEAN
├── has_recording       BOOLEAN
├── is_active           BOOLEAN
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

### 4.12 Notification

```
NOTIFICATION
├── id                  UUID (PK)
├── case_id             UUID → CASE (nullable)
├── recipient_user_id   UUID → USER (nullable — internal)
├── recipient_person_id UUID → PERSON (nullable — external)
├── notification_type   ENUM: 'case_assigned', 'hearing_scheduled',
│                         'decision_issued', 'filing_received',
│                         'sla_alert', 'deficiency', 'system'
├── channel             ENUM: 'email', 'in_app', 'both'
├── subject             VARCHAR
├── body                TEXT
├── status              ENUM: 'pending', 'sent', 'delivered', 'failed', 'read'
├── sent_at             TIMESTAMP (nullable)
├── read_at             TIMESTAMP (nullable)
├── external_id         VARCHAR (nullable — SendGrid message ID)
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

### 4.13 AI Request/Result Tracking

```
AI_REQUEST
├── id                  UUID (PK)
├── case_id             UUID → CASE (nullable)
├── document_id         UUID → DOCUMENT (nullable)
├── request_type        ENUM: 'auto_docket_validation', 'smart_assignment',
│                         'document_analysis', 'ocr', 'chatbot_query',
│                         'case_summary'
├── request_payload     JSONB
├── response_payload    JSONB (nullable)
├── confidence_score    FLOAT (nullable)
├── model_used          VARCHAR — e.g., 'gemini-2.0-flash'
├── token_count_input   INTEGER (nullable)
├── token_count_output  INTEGER (nullable)
├── latency_ms          INTEGER (nullable)
├── status              ENUM: 'pending', 'completed', 'failed', 'timeout'
├── error_message       VARCHAR (nullable)
├── created_at          TIMESTAMP
└── completed_at        TIMESTAMP (nullable)
```

### 4.14 SLA Tracking

```
SLA_TRACKING
├── id                  UUID (PK)
├── case_id             UUID → CASE (FK, unique)
├── deadline_type       VARCHAR — e.g., '270_day'
├── start_date          DATE — when clock starts (referral or docketing)
├── deadline_date       DATE — computed deadline
├── paused_at           DATE (nullable) — if SLA clock paused
├── pause_reason        VARCHAR (nullable)
├── resumed_at          DATE (nullable)
├── total_paused_days   INTEGER (default 0)
├── current_alert       ENUM: 'green', 'amber', 'red', 'breached'
├── last_alert_sent     TIMESTAMP (nullable)
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

---

## 5. Sealed Document Access Log

Separate audit table for any access to sealed documents/cases.

```
SEALED_ACCESS_LOG
├── id                  UUID (PK)
├── case_id             UUID → CASE (nullable)
├── document_id         UUID → DOCUMENT (nullable)
├── accessed_by         UUID → USER (FK)
├── access_type         ENUM: 'view', 'download', 'modify', 'seal', 'unseal'
├── ip_address          VARCHAR
├── user_agent          VARCHAR
├── reason              VARCHAR (nullable)
├── accessed_at         TIMESTAMP
└── created_at          TIMESTAMP
```

---

## 6. Comparison with EF-CMS (US Tax Court)

| EF-CMS Entity | IACP 3.0 Equivalent | Similarity | Notes |
|---------------|---------------------|-----------|-------|
| Case | Case | HIGH | Both are central aggregate with lifecycle states |
| Petitioner | Claimant (via Case_Party) | HIGH | Different name, same concept |
| Respondent (IRS) | Employer/Responsible Operator (via Case_Party) | MEDIUM | Tax Court has single respondent; OALJ has multiple party types |
| Practitioner | Attorney (via Person + Case_Party) | HIGH | Both track bar numbers, representations |
| DocketEntry | Docket_Event | HIGH | Both are immutable event logs. EF-CMS uses event codes; we use event_type registry |
| TrialSession | Hearing | MEDIUM | Tax Court has "sessions" with multiple cases; OALJ typically one case per hearing |
| WorkItem | (Not in v1.0) | — | EF-CMS has work queue items; we use dashboard filters instead |
| Message | (Not in v1.0) | — | Internal messaging deferred |
| CaseDeadline | SLA_Tracking | MEDIUM | EF-CMS has generic deadlines; we have statutory 270-day tracking |
| Correspondence | Document (type=correspondence) | HIGH | Same concept |

### Adopted EF-CMS Patterns
1. **Entity constants registry** — single source of truth for all enums (case types, statuses, event codes)
2. **Event code system** — standardized event types for docket entries (not free-text)
3. **Party-centric model** — persons linked to cases via junction table
4. **Factory pattern** — different case creation paths (BLA, LHC, whistleblower)
5. **Access-controlled views** — PublicCase vs RestrictedCase (we have access_level on documents)

### Divergences from EF-CMS
1. **Event sourcing** — we use true event sourcing (case state derived from events); EF-CMS stores current state directly
2. **Separate document versioning** — EF-CMS treats amended filings as new documents; we track versions within a document entity
3. **Chambers model** — EF-CMS doesn't have chambers (Tax Court structure is different); we model ALJ chambers with AA and LA assignments
4. **SLA tracking** — EF-CMS doesn't have statutory deadlines like the 270-day rule
5. **AI integration** — not present in EF-CMS; first-class concern in IACP

---

## 7. PostgreSQL Schema Organization

```sql
-- Schema mapping to services
CREATE SCHEMA core;        -- cases, persons, case_parties, docket_events, chambers, courtrooms
CREATE SCHEMA filing;      -- filings (subset of docket_events + validation state)
CREATE SCHEMA document;    -- documents, document_versions, sealed_access_log
CREATE SCHEMA scheduling;  -- hearings
CREATE SCHEMA judicial;    -- bench_memos, decision_drafts, draft_versions
CREATE SCHEMA identity;    -- users, roles, permissions, sessions
CREATE SCHEMA ai;          -- ai_requests
CREATE SCHEMA notification;-- notifications
CREATE SCHEMA reporting;   -- materialized views, SLA snapshots
```

Each domain service owns its schema and has read access to `core` schema.

---

*This data model is the foundation for API contracts, event schemas, and frontend data structures. Changes require Solution Architect + PO approval.*
