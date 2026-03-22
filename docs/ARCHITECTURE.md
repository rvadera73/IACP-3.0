# IACP 3.0 — Enterprise Architecture

> This document supersedes the service decomposition in PROJECT_CHARTER.md Section 5.
> Last updated: 2026-03-22

---

## 1. Design Philosophy

IACP 3.0 is designed as a **reusable eCourt platform**, not a single-purpose app. The architecture draws from:

- **OASIS ECF 5.0** — Major Design Elements (MDEs) for e-filing ecosystem
- **NIEM (National Information Exchange Model)** — data exchange standards for justice systems
- **Event Sourcing** — the court docket is inherently an immutable event log
- **CQRS** — separate write path (filings, orders, actions) from read path (search, dashboards, reports)
- **Party-centric data model** — a person/organization record spans multiple cases (Tyler Odyssey pattern)

### Core Principles

| # | Principle | Rationale |
|---|-----------|-----------|
| 1 | **Single source of truth** | One PostgreSQL database; separation through RBAC and network zones, not separate data stores |
| 2 | **Event-sourced docket** | Every case action is an immutable event; current state derived from event replay; docket = audit trail |
| 3 | **Party-centric, not case-centric** | Person/org records link to multiple cases; enables holistic judicial views |
| 4 | **Domain-driven decomposition** | Services aligned to functional court domains (ECF MDEs), not technical layers |
| 5 | **Async-first integration** | Public portal ↔ internal CMS communicate via event bus, not synchronous calls |
| 6 | **AI as co-pilot, not autopilot** | All AI decisions are suggestions; human-in-the-loop for all judicial actions |
| 7 | **Sealed document isolation** | Sealed/confidential documents have separate storage path and access controls |
| 8 | **Standards-ready** | Data models aligned with NIEM; filing format aligned with ECF 5.0 concepts |

---

## 2. Functional Domain Map

The platform is decomposed into **functional domains**, each representing a bounded context:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     IACP 3.0 eCourt Platform                          │
│                                                                       │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │  ELECTRONIC  │ │   FILING     │ │   COURT      │ │   COURT      │  │
│  │  FILING      │ │   REVIEW     │ │   RECORD     │ │   SCHEDULING │  │
│  │  (EFS/EFSP)  │ │   (EFM)      │ │   (CMS Core) │ │              │  │
│  │              │ │              │ │              │ │              │  │
│  │ Public-facing│ │ Validation,  │ │ Docketing,   │ │ Hearings,    │  │
│  │ case filing, │ │ AI scoring,  │ │ case lifecycle│ │ courtrooms,  │  │
│  │ doc upload,  │ │ deficiency   │ │ party mgmt,  │ │ reporters,   │  │
│  │ status check │ │ detection    │ │ assignments  │ │ notices      │  │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘  │
│         │                │                │                │          │
│  ┌──────┴────────────────┴────────────────┴────────────────┴───────┐  │
│  │                      EVENT BUS (Google Pub/Sub)                  │  │
│  │    filing.submitted │ case.docketed │ hearing.scheduled │ ...    │  │
│  └──────┬────────────────────┬────────────────────┬────────────────┘  │
│         │                    │                    │                    │
│  ┌──────┴───────┐ ┌─────────┴──────┐ ┌──────────┴─────┐             │
│  │  DOCUMENT    │ │  NOTIFICATION  │ │  AI / ML       │             │
│  │  MANAGEMENT  │ │  & SERVICE     │ │  SERVICE       │             │
│  │              │ │                │ │                │             │
│  │ Versioning,  │ │ Email, in-app, │ │ Auto-docket,   │             │
│  │ exhibits,    │ │ legal service  │ │ smart assign,  │             │
│  │ retention,   │ │ of process,    │ │ doc analysis,  │             │
│  │ sealed docs, │ │ party notices  │ │ chatbot,       │             │
│  │ PDF/A, audit │ │                │ │ OCR            │             │
│  └──────────────┘ └────────────────┘ └────────────────┘             │
│                                                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                  │
│  │  JUDICIAL    │ │  IDENTITY &  │ │  REPORTING & │                  │
│  │  WORKSPACE   │ │  ACCESS      │ │  ANALYTICS   │                  │
│  │              │ │              │ │              │                  │
│  │ Bench memos, │ │ Google OAuth,│ │ Dashboards,  │                  │
│  │ draft orders,│ │ JWT, RBAC,   │ │ SLA tracking,│                  │
│  │ redline,     │ │ user mgmt,   │ │ caseload     │                  │
│  │ sign/release │ │ sealed access│ │ statistics   │                  │
│  └──────────────┘ └──────────────┘ └──────────────┘                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Domain → ECF 5.0 MDE Alignment

| IACP Domain | ECF 5.0 MDE | Description |
|-------------|-------------|-------------|
| Electronic Filing (EFS) | Filing Assembly MDE | Public portal for composing and submitting filings |
| Filing Review | Filing Review MDE | Validates, scores, and routes filings (AI-powered) |
| Court Record | Court Record MDE | Core CMS — docketing, case lifecycle, party management |
| Court Scheduling | Court Scheduling MDE | Hearing scheduling, resource management |
| Notification & Service | Legal Service MDE | Electronic service of process, notices |
| Document Management | (Cross-cutting) | DMS supporting all domains |
| Judicial Workspace | (Internal) | Judge-specific tools (bench, chambers) |
| Identity & Access | (Infrastructure) | AuthN/AuthZ across all domains |
| AI/ML Service | (Cross-cutting) | Intelligence layer for all domains |
| Reporting & Analytics | (Cross-cutting) | Dashboards and statistics |

---

## 3. System Architecture

### 3.1 Zone Architecture

> **ADR-009**: Two frontend applications, aligned to security zones.

```
╔══════════════════════════════════════════════════════════════════════╗
║                         PUBLIC ZONE (DMZ)                            ║
║                                                                      ║
║   ┌─────────────────────────────────────────────────┐               ║
║   │         Public Portal (React SPA)                │               ║
║   │   Combined public access + e-filing              │               ║
║   │                                                   │               ║
║   │ • Case status search    • New case filing         │               ║
║   │ • Public documents      • Document upload         │               ║
║   │ • Hearing calendar      • Filing status tracking  │               ║
║   │ • Court information     • Case access requests    │               ║
║   │ (unauthenticated)       (Google OAuth for filers) │               ║
║   └─────────────────────────┬───────────────────────┘               ║
║                              │                                       ║
║   ┌──────────────────────────▼──────────────────────┐               ║
║   │            PUBLIC API GATEWAY                      │              ║
║   │    (FastAPI — rate limiting, auth, validation)     │              ║
║   │    Cloud Run — public ingress                      │              ║
║   └─────────────────────┬────────────────────────────┘              ║
╠═════════════════════════╪════════════════════════════════════════════╣
║                         │     INTEGRATION ZONE                       ║
║                         ▼                                            ║
║   ┌─────────────────────────────────────────────────┐               ║
║   │              EVENT BUS (Google Pub/Sub)           │               ║
║   │                                                   │               ║
║   │  Topics:                                         │               ║
║   │  • filing.submitted    • case.docketed           │               ║
║   │  • case.assigned       • hearing.scheduled       │               ║
║   │  • document.uploaded   • decision.signed         │               ║
║   │  • notice.generated    • sla.alert               │               ║
║   │  • ai.validation.complete                        │               ║
║   └─────────────────────┬───────────────────────────┘               ║
╠═════════════════════════╪════════════════════════════════════════════╣
║                         │     INTERNAL ZONE                          ║
║                         ▼                                            ║
║   ┌─────────────────────────────────────────────────┐               ║
║   │          INTERNAL API GATEWAY                     │               ║
║   │  (FastAPI — RBAC enforcement, internal routing)   │               ║
║   │  Cloud Run — internal ingress only                │               ║
║   └──────────────────────┬──────────────────────────┘               ║
║                          │                                           ║
║   ┌──────────────────────▼──────────────────────────┐               ║
║   │       Internal Portal (React SPA)                │               ║
║   │   Combined CMS + judicial workspace              │               ║
║   │                                                   │               ║
║   │ • Clerk dashboard       • ALJ dashboard           │               ║
║   │ • Legal Asst dashboard  • Bench memos             │               ║
║   │ • Atty-Advisor dashboard• Draft decisions         │               ║
║   │ • Admin console         • Sign & release          │               ║
║   │ (role-based routing, SSO mock)                    │               ║
║   └───────────────────────────────────────────────── ┘               ║
╠══════════════════════════════════════════════════════════════════════╣
║                         DATA ZONE                                    ║
║                                                                      ║
║   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐          ║
║   │  Cloud SQL   │  │  Cloud       │  │  Cloud Storage   │          ║
║   │  PostgreSQL  │  │  Firestore   │  │  (GCS)           │          ║
║   │              │  │              │  │                   │          ║
║   │ • Cases      │  │ • Real-time  │  │ • Documents      │          ║
║   │ • Parties    │  │   presence   │  │ • Exhibits       │          ║
║   │ • Docket     │  │ • Live       │  │ • Sealed (sep.)  │          ║
║   │   events     │  │   notifs     │  │ • Generated PDFs │          ║
║   │ • Documents  │  │ • Chat       │  │                   │          ║
║   │   metadata   │  │   sessions   │  │                   │          ║
║   │ • Users/RBAC │  │              │  │                   │          ║
║   └──────────────┘  └──────────────┘  └──────────────────┘          ║
║                                                                      ║
║   ┌──────────────────────────────────────────────────────┐          ║
║   │              Vertex AI (Gemini 2.0 Flash)             │          ║
║   │  • Auto-docketing validation    • Document OCR/analysis│         ║
║   │  • Smart case assignment        • Legal research chat  │         ║
║   └──────────────────────────────────────────────────────┘          ║
╚══════════════════════════════════════════════════════════════════════╝
```

### 3.2 Key Architecture Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| AD1 | **Single PostgreSQL database** (not per-service DBs) | Court data is deeply relational; party-centric model requires joins across cases, filings, hearings. Separation via schemas, not databases. |
| AD2 | **Google Pub/Sub as event bus** (not Kafka) | Serverless, managed, GCP-native. Sufficient for our throughput. Avoids managing Kafka cluster. |
| AD3 | **Two API gateways** (public + internal) | Network-level separation between public-facing and internal systems. Different auth, rate limits, and access patterns. |
| AD4 | **Monorepo with domain modules** (not polyrepo) | Shared domain models, event contracts, and utilities must stay in sync. Single CI pipeline with per-module builds. |
| AD5 | **Event sourcing for docket** | Docket entries are immutable events. Case state derived from event log. Natural audit trail. |
| AD6 | **CQRS for search/reporting** | Write path: normalized PostgreSQL. Read path: materialized views / denormalized tables for dashboards and search. |
| AD7 | **Sealed documents in separate GCS bucket** | Physical isolation of sealed/confidential documents with separate IAM policies and audit logging. |
| AD8 | **Frontend: two apps by security zone** (ADR-009) | Public Portal (public access + e-filing) and Internal Portal (CMS + judicial workspace). Two apps aligned to network zones, not three. Shared UI via `libs/ui-components`. |
| AD9 | **Backend: domain services, not layer services** | Services organized by court domain (filing-review, court-record, scheduling), not technical layer (auth-service, document-service). |

---

## 4. Service Decomposition (Domain-Aligned)

Instead of arbitrary microservices, services align to **court functional domains**:

### 4.1 Service Map

```
┌────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                           │
│                   (All FastAPI on Cloud Run)                    │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ public-gateway   │  │ internal-gateway │                    │
│  │ Port: 8000       │  │ Port: 8010       │                    │
│  │ Public API routes│  │ Internal API     │                    │
│  │ Rate limiting    │  │ RBAC enforcement │                    │
│  │ Filing intake    │  │ All internal ops │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
│           │                     │                               │
│  ┌────────▼─────────────────────▼─────────┐                    │
│  │          DOMAIN SERVICES                │                    │
│  │                                         │                    │
│  │  ┌─────────────────┐ ┌───────────────┐ │                    │
│  │  │ court-record    │ │ filing-review │ │                    │
│  │  │ Port: 8001      │ │ Port: 8002    │ │                    │
│  │  │                 │ │               │ │                    │
│  │  │ • Case CRUD     │ │ • Intake      │ │                    │
│  │  │ • Docket events │ │   validation  │ │                    │
│  │  │ • Party mgmt    │ │ • AI scoring  │ │                    │
│  │  │ • Assignments   │ │ • Deficiency  │ │                    │
│  │  │ • Case status   │ │   detection   │ │                    │
│  │  │ • SLA tracking  │ │ • Auto-docket │ │                    │
│  │  └─────────────────┘ └───────────────┘ │                    │
│  │                                         │                    │
│  │  ┌─────────────────┐ ┌───────────────┐ │                    │
│  │  │ document-mgmt   │ │ scheduling    │ │                    │
│  │  │ Port: 8003      │ │ Port: 8004    │ │                    │
│  │  │                 │ │               │ │                    │
│  │  │ • Upload/DL     │ │ • Hearings    │ │                    │
│  │  │ • Versioning    │ │ • Courtrooms  │ │                    │
│  │  │ • Exhibits      │ │ • Reporters   │ │                    │
│  │  │ • Sealed docs   │ │ • Notices     │ │                    │
│  │  │ • PDF gen       │ │ • Calendar    │ │                    │
│  │  │ • Retention     │ │               │ │                    │
│  │  │ • Audit trail   │ │               │ │                    │
│  │  └─────────────────┘ └───────────────┘ │                    │
│  │                                         │                    │
│  │  ┌─────────────────┐ ┌───────────────┐ │                    │
│  │  │ judicial-work   │ │ ai-engine     │ │                    │
│  │  │ Port: 8005      │ │ Port: 8006    │ │                    │
│  │  │                 │ │               │ │                    │
│  │  │ • Bench memos   │ │ • Gemini API  │ │                    │
│  │  │ • Draft orders  │ │ • Auto-dock   │ │                    │
│  │  │ • Redline/diff  │ │   validation  │ │                    │
│  │  │ • Sign & release│ │ • Smart assign│ │                    │
│  │  │ • Chambers data │ │ • Doc analysis│ │                    │
│  │  └─────────────────┘ │ • OCR         │ │                    │
│  │                      │ • Chatbot     │ │                    │
│  │  ┌─────────────────┐ └───────────────┘ │                    │
│  │  │ notification    │                    │                    │
│  │  │ Port: 8007      │                    │                    │
│  │  │                 │                    │                    │
│  │  │ • Email notices │                    │                    │
│  │  │ • In-app notifs │                    │                    │
│  │  │ • Legal service │                    │                    │
│  │  │ • Party alerts  │                    │                    │
│  │  └─────────────────┘                    │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │ identity        │                                           │
│  │ Port: 8008      │                                           │
│  │                 │                                           │
│  │ • Google OAuth  │                                           │
│  │ • JWT sessions  │                                           │
│  │ • RBAC engine   │                                           │
│  │ • User mgmt     │                                           │
│  │ • Sealed access │                                           │
│  │   control       │                                           │
│  └─────────────────┘                                           │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Service Responsibilities Detail

| Service | Domain | Owns | Consumes Events | Produces Events |
|---------|--------|------|-----------------|-----------------|
| **court-record** | Case lifecycle | cases, parties, docket_events, assignments, sla_tracking | filing.validated, hearing.scheduled, decision.signed | case.created, case.docketed, case.assigned, case.status_changed, sla.alert |
| **filing-review** | Intake pipeline | filings, deficiencies, validation_results | filing.submitted | filing.validated, filing.deficient, filing.auto_docketed |
| **document-mgmt** | Document lifecycle | documents, document_versions, exhibits, retention_policies | case.created, filing.submitted, decision.signed | document.uploaded, document.versioned, exhibit.added |
| **scheduling** | Court calendar | hearings, courtrooms, hearing_participants | case.assigned | hearing.scheduled, hearing.rescheduled, notice.generated |
| **judicial-work** | Chambers operations | bench_memos, decision_drafts, draft_versions | case.assigned, hearing.scheduled | draft.submitted, decision.signed, decision.released |
| **ai-engine** | Intelligence layer | ai_requests, ai_results | filing.submitted, document.uploaded | ai.validation.complete, ai.assignment.suggestion, ai.analysis.complete |
| **notification** | Communications | notifications, service_records | (subscribes to all events) | notification.sent, service.completed |
| **identity** | Auth & access | users, roles, permissions, sessions, sealed_access_log | — | user.authenticated, role.changed |

---

## 5. Data Architecture

### 5.1 Party-Centric Model

```
                    ┌─────────────┐
                    │   PERSON /  │
                    │   ORG       │
                    │             │
                    │ • name      │
                    │ • type      │
                    │ • contact   │
                    │ • identifiers│
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ CASE_PARTY  │  (junction: role in case)
                    │             │
                    │ • role      │  (claimant, employer, insurer,
                    │ • status    │   representative, attorney)
                    │ • dates     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌──────▼──┐  ┌─────▼────┐
       │  CASE   │  │ FILING  │  │ HEARING  │
       │         │  │         │  │          │
       │ • type  │  │ • type  │  │ • date   │
       │ • phase │  │ • status│  │ • format │
       │ • SLA   │  │ • docs  │  │ • room   │
       └─────────┘  └─────────┘  └──────────┘
```

**Key insight**: A person (e.g., an attorney) may be a party in multiple cases. A claimant may have a BLA case and a related LHC case. The party-centric model links them.

### 5.2 Event-Sourced Docket

```sql
-- The docket_events table is the source of truth (append-only)
-- Current case state is derived from replaying events

docket_events:
  id              UUID PRIMARY KEY
  case_id         UUID → cases
  event_type      VARCHAR  -- 'FILING_RECEIVED', 'CASE_DOCKETED', 'JUDGE_ASSIGNED', etc.
  event_data      JSONB    -- structured payload per event type
  actor_id        UUID → users
  actor_role      VARCHAR
  occurred_at     TIMESTAMP WITH TIME ZONE
  sequence_number BIGINT   -- per-case ordering

-- Materialized current state (rebuilt from events, used for queries)
cases:
  id, docket_number, case_type, current_phase, current_status,
  assigned_judge_id, filed_date, sla_deadline, ...
```

### 5.3 Database Schema Domains

```
PostgreSQL Schemas (logical separation within single database):
├── core          -- cases, parties, case_parties, docket_events
├── filing        -- filings, deficiencies, validation_results
├── document      -- documents, document_versions, exhibits, retention
├── scheduling    -- hearings, courtrooms, reporters, hearing_participants
├── judicial      -- bench_memos, decision_drafts, draft_versions
├── identity      -- users, roles, permissions, sessions
├── ai            -- ai_requests, ai_results, scoring_history
├── notification  -- notifications, service_records, templates
└── reporting     -- materialized views, aggregates, SLA snapshots
```

### 5.4 Sealed Document Isolation

```
Cloud Storage (GCS):
├── iacp-documents-{env}/          # Standard documents
│   ├── filings/
│   ├── exhibits/
│   ├── decisions/
│   └── notices/
│
├── iacp-sealed-{env}/             # SEPARATE BUCKET — restricted IAM
│   ├── sealed-filings/            # Only ALJ + authorized staff
│   ├── in-camera/                 # ALJ-only
│   └── sealed-orders/
│
└── iacp-generated-{env}/         # System-generated PDFs
    ├── docket-sheets/
    ├── hearing-notices/
    └── deficiency-notices/
```

---

## 6. Event Bus Architecture

### 6.1 Google Pub/Sub Topics

```
Filing Domain:
  filing.submitted          -- new filing from public portal
  filing.validated          -- AI validation complete (score, deficiencies)
  filing.deficient          -- filing rejected, deficiency notice needed
  filing.auto_docketed      -- auto-docketed (score ≥ 90)

Case Domain:
  case.created              -- new case record created
  case.docketed             -- case officially docketed with number
  case.assigned             -- judge assigned to case
  case.status_changed       -- phase/status transition
  case.transferred          -- case reassigned to different judge

Document Domain:
  document.uploaded         -- new document stored
  document.versioned        -- new version of existing document
  exhibit.added             -- exhibit linked to case

Scheduling Domain:
  hearing.scheduled         -- hearing date/time set
  hearing.rescheduled       -- hearing moved
  hearing.completed         -- hearing occurred

Judicial Domain:
  draft.submitted           -- AA submits draft to ALJ
  decision.signed           -- ALJ signs decision
  decision.released         -- decision served to parties

SLA Domain:
  sla.alert.amber           -- 30-90 days remaining
  sla.alert.red             -- <30 days remaining
  sla.alert.breached        -- deadline passed

Notification Domain:
  notification.send         -- trigger notification delivery
  notification.sent         -- delivery confirmed
```

### 6.2 Event Flow Example: New Filing → Decision

```
[1] Claimant submits filing via Public Portal
        → filing.submitted

[2] AI Engine validates filing
        → filing.validated (score: 95, no deficiencies)

[3] Filing Review auto-dockets (score ≥ 90)
        → filing.auto_docketed
        → case.created
        → case.docketed

[4] AI Engine suggests judge assignment
        → ai.assignment.suggestion

[5] Docket Clerk confirms assignment
        → case.assigned

[6] Notification service alerts parties & judge
        → notification.send (to claimant, employer, ALJ)

[7] Legal Assistant schedules hearing
        → hearing.scheduled
        → notification.send (Notice of Hearing)

[8] Attorney-Advisor drafts decision
        → draft.submitted

[9] ALJ signs decision
        → decision.signed
        → decision.released
        → notification.send (to all parties)
        → case.status_changed (phase: Post-Decision)
```

---

## 7. Repository Structure (Monorepo)

```
IACP-3.0/
│
├── apps/                              # FRONTEND APPLICATIONS (ADR-009: 2 apps)
│   ├── public-portal/                 # Public Portal — combined public access + e-filing
│   │   ├── src/
│   │   │   ├── pages/                 # Case search, filing wizard, status, calendar
│   │   │   ├── components/
│   │   │   └── services/              # Public API client
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── internal-portal/               # Internal Portal — combined CMS + judicial workspace
│       ├── src/
│       │   ├── pages/                 # Role-based dashboards
│       │   │   ├── clerk/
│       │   │   ├── legal-assistant/
│       │   │   ├── attorney-advisor/
│       │   │   └── judge/             # ALJ dashboard, bench memos, sign/release
│       │   ├── components/            # Shared UI components
│       │   │   ├── case/              # Case viewer, unified folder
│       │   │   ├── editors/           # Decision, bench memo editors
│       │   │   ├── UI/                # Reusable primitives
│       │   │   └── layouts/
│       │   ├── services/              # Internal API client
│       │   ├── core/                  # RBAC, config
│       │   └── context/               # Auth, app state
│       ├── Dockerfile
│       ├── package.json
│       └── vite.config.ts
│
├── services/                          # BACKEND SERVICES
│   ├── public-gateway/                # Public API Gateway
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── routes/                # Public filing, status, search
│   │   │   └── middleware/            # Rate limiting, CORS, auth
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── internal-gateway/              # Internal API Gateway
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── routes/                # Internal operations routing
│   │   │   └── middleware/            # RBAC, auth enforcement
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── court-record/                  # Core CMS — cases, parties, docket
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/                   # Endpoints
│   │   │   ├── domain/                # Business logic, state machine
│   │   │   ├── events/                # Event producers/consumers
│   │   │   └── models/                # SQLAlchemy + Pydantic
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── filing-review/                 # Intake validation & auto-docketing
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/
│   │   │   ├── domain/                # Validation rules, scoring
│   │   │   └── events/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── document-mgmt/                 # DMS — storage, versioning, exhibits
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/
│   │   │   ├── domain/                # Versioning, retention, sealed
│   │   │   ├── storage/               # GCS adapter
│   │   │   └── pdf/                   # PDF generation
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── scheduling/                    # Hearings, courtrooms, calendar
│   │   ├── app/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── judicial-workspace/            # Bench memos, drafts, sign/release
│   │   ├── app/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── ai-engine/                     # Gemini integration, all AI features
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   │   ├── auto_docketing.py
│   │   │   │   ├── smart_assignment.py
│   │   │   │   ├── document_analysis.py
│   │   │   │   └── chatbot.py
│   │   │   └── events/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── notification/                  # Email, in-app, legal service
│   │   ├── app/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   └── identity/                      # Auth, RBAC, user management
│       ├── app/
│       ├── Dockerfile
│       └── requirements.txt
│
├── libs/                              # SHARED LIBRARIES
│   ├── domain-model/                  # Shared Pydantic models (Case, Party, Filing...)
│   │   ├── models/
│   │   ├── enums/
│   │   └── pyproject.toml
│   │
│   ├── event-contracts/               # Pub/Sub event schemas
│   │   ├── schemas/
│   │   ├── publishers.py
│   │   ├── subscribers.py
│   │   └── pyproject.toml
│   │
│   ├── auth-common/                   # JWT validation, RBAC decorators
│   │   └── pyproject.toml
│   │
│   └── ui-components/                 # Shared React components (design system)
│       ├── src/
│       └── package.json
│
├── infra/                             # INFRASTRUCTURE
│   ├── docker/
│   │   ├── docker-compose.yml         # Full local stack
│   │   ├── docker-compose.test.yml    # Test environment
│   │   └── .env.example
│   │
│   ├── sql/
│   │   ├── init.sql                   # Schema initialization
│   │   └── seed.sql                   # Test data
│   │
│   ├── pubsub/
│   │   └── topics.json                # Topic/subscription definitions
│   │
│   └── cloud-run/                     # Per-service Cloud Run configs
│       ├── public-gateway.yaml
│       ├── internal-gateway.yaml
│       ├── court-record.yaml
│       └── ...
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # Lint, test, type-check (all services)
│   │   ├── cd-public.yml              # Deploy public-facing services
│   │   ├── cd-internal.yml            # Deploy internal services
│   │   └── cd-frontend.yml            # Deploy frontend apps
│   │
│   ├── ISSUE_TEMPLATE/
│   │   ├── epic.yml
│   │   ├── user-story.yml
│   │   └── bug.yml
│   │
│   └── PROJECT/                       # GitHub Projects config
│
├── docs/
│   ├── PROJECT_CHARTER.md
│   ├── ARCHITECTURE.md                # This document
│   ├── API_CONTRACTS.md               # OpenAPI specs
│   ├── EVENT_CATALOG.md               # Event schemas reference
│   ├── DATA_MODEL.md                  # Database schema docs
│   └── DEPLOYMENT.md
│
├── CLAUDE.md                          # AI agent instructions
└── README.md
```

### Why This Structure

| Decision | Rationale |
|----------|-----------|
| **2 frontend apps** (public-portal, internal-portal) | Aligned to security zones (ADR-009). Public access + e-filing combined (same users: claimants, attorneys). CMS + judicial workspace combined (role-based routing). Shared UI via `libs/ui-components`. |
| **2 gateways** (public, internal) | Public gateway has rate limiting, accepts unauthenticated requests. Internal gateway enforces RBAC, requires JWT. |
| **Domain services** not layer services | `court-record` owns case lifecycle, not split into case-service + party-service + docket-service. Reduces inter-service chatter. |
| **Shared libs** | Domain models, event contracts, and auth must be identical across services. Prevents schema drift. |
| **Event contracts in lib** | All services produce/consume events using the same schema definitions. Breaking changes caught at build time. |

---

## 8. Integration Architecture (Future-Ready)

While v1.0 has no external integrations, the architecture is designed to support them:

```
FUTURE INTEGRATION POINTS (v1.1+):
│
├── Login.gov (SAML/OIDC)        → identity service adapter
├── NIEM data exchange            → court-record export adapter
├── Payment processing            → new financial-service
├── NARA records transfer         → document-mgmt retention adapter
├── Legal research (Westlaw, etc) → ai-engine citation adapter
├── Other DOL systems (EFS, CTS)  → public-gateway API endpoints
└── Cross-agency notifications    → notification service adapter
```

Each integration point is a **new adapter** within an existing service, not a new service. The event bus enables loose coupling.

---

## 9. API Contract Standards

### 9.1 Error Response Format

All API errors follow a consistent envelope:

```json
{
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "No case found with docket number 2026BLA00011",
    "details": {
      "docket_number": "2026BLA00011"
    }
  },
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

- `code`: Machine-readable error code (UPPER_SNAKE_CASE)
- `message`: Human-readable description
- `details`: Optional structured context (varies by error)
- `request_id`: UUID for tracing across services and logs

### 9.2 Pagination

Cursor-based pagination for all list endpoints:

```
GET /api/v1/cases?cursor=eyJpZCI6MTAwfQ&limit=50
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTUwfQ",
    "has_more": true,
    "limit": 50
  }
}
```

- Default limit: 50
- Max limit: 200
- Cursors are opaque, base64-encoded tokens

### 9.3 API Versioning

URL path versioning:

```
/api/v1/cases
/api/v1/filings
/api/v1/hearings
```

- Major version in URL path (`v1`, `v2`, ...)
- Minor/patch changes are backward-compatible within the same major version
- Deprecation notices sent via `Sunset` header before version removal

### 9.4 Rate Limiting

Rate limit state communicated via standard headers on all responses:

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | Max requests per window | `100` |
| `X-RateLimit-Remaining` | Requests remaining in window | `87` |
| `X-RateLimit-Reset` | Unix timestamp when window resets | `1711152000` |

When rate limited, the API returns `429 Too Many Requests` with a `Retry-After` header.

---

## 10. Deployment Architecture (ADR-015)

### 10.1 Deployment Strategy by Environment

| Environment | Tool | Description |
|-------------|------|-------------|
| **Local dev** | Docker Compose | Full stack with emulators (Pub/Sub, Firestore, fake-gcs-server) |
| **Prototype / Test** | GitHub Actions → Cloud Run | CI/CD pipeline per service. Manual GCP project setup. |
| **Future (v1.1+)** | Terraform IaC | Enterprise deployment via AI Software Factory pattern. Deferred until architecture stabilizes. |

> **Note**: No Terraform in v1.0 scope. Cloud Run service configs defined in YAML, deployed via GitHub Actions.

### 10.2 Local Development (Docker Compose)

```yaml
# All services run locally with:
# docker-compose -f infra/docker/docker-compose.yml up

Services:
  postgres:       Port 5432  (with init.sql + seed.sql)
  pubsub-emu:     Port 8085  (Google Pub/Sub emulator)
  firestore-emu:  Port 8086  (Firestore emulator)
  gcs-emu:        Port 4443  (fake-gcs-server)
  public-gw:      Port 8000
  internal-gw:    Port 8010
  court-record:   Port 8001
  filing-review:  Port 8002
  document-mgmt:  Port 8003
  scheduling:     Port 8004
  judicial-ws:    Port 8005
  ai-engine:      Port 8006
  notification:   Port 8007
  identity:       Port 8008
  public-portal:  Port 3000  (combined public access + e-filing)
  internal-portal: Port 3001  (combined CMS + judicial workspace)
```

### 10.3 GCP Cloud Run

| Service | Min Instances | Max Instances | Memory | CPU | Ingress |
|---------|--------------|---------------|--------|-----|---------|
| public-gateway | 1 | 10 | 512Mi | 1 | All |
| internal-gateway | 1 | 5 | 512Mi | 1 | Internal + LB |
| court-record | 1 | 5 | 1Gi | 1 | Internal |
| filing-review | 0 | 5 | 1Gi | 1 | Internal |
| document-mgmt | 0 | 5 | 1Gi | 1 | Internal |
| scheduling | 0 | 3 | 512Mi | 1 | Internal |
| judicial-workspace | 0 | 3 | 512Mi | 1 | Internal |
| ai-engine | 0 | 5 | 2Gi | 2 | Internal |
| notification | 0 | 3 | 512Mi | 1 | Internal |
| identity | 1 | 5 | 512Mi | 1 | Internal |

---

## 11. Security Architecture

### 11.1 Authentication Flow

```
Public User:
  Browser → Google OAuth → identity service → JWT (public scope) → public-gateway

Internal User:
  Browser → Google OAuth → identity service → JWT (role-encoded) → internal-gateway

JWT Claims:
  {
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "oalj_docket_clerk",
    "permissions": ["docket", "assign", "view_all_cases"],
    "zone": "internal",
    "exp": 1234567890
  }
```

### 11.2 Service-to-Service Authentication (ADR-008)

Two authentication mechanisms depending on call context:

| Context | Mechanism | Description |
|---------|-----------|-------------|
| **User-context calls** (gateway → service) | JWT passthrough | User's JWT token forwarded with the request. Service validates token and enforces RBAC based on user claims. |
| **System/event calls** (service → service, Pub/Sub handlers) | Service account API keys | Each service has a dedicated service account. API keys stored in **GCP Secret Manager**. |

**Key rotation**: Service account API keys rotate on a **1-year** cycle. A scheduled rotation job handles key regeneration and Secret Manager updates.

**Flow:**
```
User Request Path:
  Browser → JWT → Gateway → JWT passthrough → Domain Service (RBAC check)

System/Event Path:
  Pub/Sub event → Subscriber service → API key from Secret Manager → Target service
  Scheduled job → API key from Secret Manager → Target service
```

**Consequences:**
- Every service requires GCP Secret Manager integration
- Each service has its own service account identity
- Key rotation job runs annually (automated via Cloud Scheduler)

### 11.3 Data Access Control

| Data | Public Portal | Clerk | Legal Asst | Atty-Advisor | ALJ | Admin |
|------|--------------|-------|------------|--------------|-----|-------|
| Public case info | ✓ (own/search) | ✓ (all) | ✓ (assigned) | ✓ (assigned) | ✓ (assigned) | ✓ (all) |
| Sealed case info | — | — | — | — | ✓ | — |
| Public documents | ✓ (own) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sealed documents | — | — | — | — | ✓ | — |
| Chambers data | — | — | — | ✓ | ✓ | — |
| Bench memos | — | — | — | ✓ | ✓ | — |
| Draft decisions | — | — | — | ✓ | ✓ | — |
| User management | — | — | — | — | — | ✓ |

---

*This architecture document is maintained alongside the codebase and updated as decisions evolve.*
