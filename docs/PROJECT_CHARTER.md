# Project Charter: IACP 3.0 — Intelligent Adjudicatory Case Portal

| Field | Value |
|-------|-------|
| **Project Name** | IACP 3.0 — Intelligent Adjudicatory Case Portal |
| **Product Type** | Open-Source eCourt Case Management System |
| **First Variant** | DOL OALJ (Office of Administrative Law Judges) |
| **Version** | v1.0 Target |
| **Charter Date** | 2026-03-21 |
| **Timeline** | 2026-03-21 → 2026-06-21 (3 months) |
| **Repository** | IACP-3.0 (existing, GitHub) |

---

## 1. Project Vision

Build a modern, open-source eCourt platform that delivers **single-thread justice** — where every participant (claimant, representative, clerk, attorney-advisor, judge) experiences a seamless, AI-assisted workflow through a unified system.

IACP 3.0 is designed as a **reusable product** for federal adjudicatory agencies. The first variant targets DOL OALJ, handling Black Lung Act (BLA), Longshore and Harbor Workers' Compensation (LHC), and other program (PER) cases. The platform architecture supports future variants for other agencies and appellate boards.

**Core Principles:**
- **Single-thread justice** — one case, one unified record, accessible by all authorized parties
- **AI-first** — automation and intelligent assistance embedded from day one, not bolted on later
- **Open-source & serverless** — no vendor lock-in, no infrastructure management
- **Role-driven design** — every user sees exactly what they need, nothing more

---

## 2. Business Justification

| Problem | IACP 3.0 Solution |
|---------|--------------------|
| Manual paper-based intake is slow and error-prone | AI-powered auto-docketing validates and dockets filings automatically |
| Case assignment is subjective and unbalanced | Smart assignment algorithm balances workload with expertise matching |
| Document management is fragmented | Unified DMS with versioning, audit trails, and role-based access |
| 270-day statutory deadlines are difficult to track | Automated SLA monitoring with Red/Amber/Green alerts |
| Public access to case status requires phone/email | Self-service public portal for filing, status checks, document submission |
| No AI assistance for legal research or drafting | Gemini-powered chatbot, document analysis, and drafting assistance |

---

## 3. Objectives & Success Criteria

### Objectives
1. Deliver a functional Internal CMS supporting all 4 OALJ roles through complete case lifecycle
2. Deliver a basic Public Portal enabling case filing, status lookup, and document submission
3. Build a unified Document Management System with versioning and audit trails
4. Demonstrate AI automation (auto-docketing, smart assignment, document analysis) from v1.0
5. Establish CI/CD pipeline with local Docker development and GCP Cloud Run deployment

### Success Criteria for v1.0

| # | Criterion | Measure |
|---|-----------|---------|
| 1 | Full case lifecycle | Internal users can take a case from intake → docketing → assignment → pre-hearing → hearing → decision |
| 2 | Public filing | External users can file new BLA/LHC/PER cases and check status |
| 3 | Document management | Documents uploaded with versioning, exhibit tracking, and audit trail |
| 4 | AI auto-docketing | 90%+ accuracy on well-formed filings |
| 5 | Role coverage | All 4 OALJ internal roles have functional, differentiated workflows |
| 6 | Deployability | System runs locally via Docker AND deploys to GCP Cloud Run |
| 7 | CI/CD | Automated testing and deployment via GitHub Actions |
| 8 | Performance | Page loads < 2s, API responses < 500ms (p95) |

---

## 4. Scope

### 4.1 In Scope (v1.0)

#### A. Internal Case Management System (IACP CMS)

**Docket Clerk Workflows:**
- Intake queue with priority filtering and status tracking
- AI-powered auto-docketing with Gemini validation (score-based automation)
- Manual docketing with deficiency handling
- Smart case assignment (top 3 judge suggestions with workload balancing)
- Case transfer and reassignment
- Docket number generation (format: YYYY-BLA-NNNNN)

**Legal Assistant Workflows:**
- Hearing scheduling (judge + courtroom + reporter availability)
- Notice of Hearing generation (PDF)
- Exhibit management (upload, organize, track)
- Transcript tracking and management
- Party service list management

**Attorney-Advisor Workflows:**
- Bench memo editor with templates
- Decision draft editor with version control
- Clerk note management
- Draft submission workflow (to ALJ review)
- AI-assisted legal research via chatbot

**Administrative Law Judge (ALJ) Workflows:**
- Assigned case dashboard with 270-day SLA tracking (Red/Amber/Green)
- Decision review with redline comparison
- Sign & Release workflow (decision → official order)
- Hearing management
- Record sealing capability
- Analytics dashboard

#### B. Public Portal (EFS — Electronic Filing Service)

- New case filing for BLA, LHC, PER case types
- Filing form with required field validation per case type
- Document upload (supporting evidence, forms)
- Case status lookup by docket number
- Case access request for authorized parties
- Filing confirmation and receipt generation
- Async secure API interaction with backend/DMS

#### C. Unified Document Management System

- Document upload to GCS with PostgreSQL metadata
- Version control (v1, v2, v3... with change tracking)
- Document types: filings, exhibits, decisions, notices, orders, transcripts
- Role-based document access (public docs vs. chambers-only)
- PDF generation for decisions, notices, deficiency letters
- Audit trail (who uploaded/viewed/modified, when)
- Exhibit numbering and organization per case
- Document retention policies (configurable)

#### D. AI Features (Parallel Development)

- **Auto-docketing validation**: Gemini analyzes filing completeness, signature detection, required fields
- **Smart assignment**: Weighted algorithm (workload + expertise + geography + rotation)
- **Document analysis**: OCR, field extraction, illegibility detection
- **AI chatbot**: Case summarization, legal research assistance, citation lookup
- **Intake validation**: Real-time feedback on filing completeness

#### E. Core Infrastructure

- Google OAuth 2.0 authentication with JWT sessions
- Server-enforced RBAC (4 internal roles + 3 external personas)
- PostgreSQL database with normalized schema
- API Gateway (FastAPI on Cloud Run)
- Firestore for real-time features (notifications, presence)
- Docker Compose for local development
- GitHub Actions CI/CD pipeline
- Environment management (local → test → production)

### 4.2 Out of Scope (v1.0)

| Feature | Target Version | Reason |
|---------|---------------|--------|
| Boards/appellate workflows (BRB, ARB, ECAB) | v1.1 | Focus on OALJ first; boards architecture designed but not implemented |
| Advanced AI (citation checker, Shepardize/KeyCite) | v1.2 | Requires legal database integrations |
| NARA-compliant records management | v1.2 | Compliance layer on top of DMS |
| FedRAMP ATO process | Organizational | Not an engineering deliverable |
| Integration with existing DOL systems (EFS, CTS, AMS) | v1.1+ | v1.0 is standalone |
| Login.gov authentication | v1.1 | Google OAuth for v1.0; Login.gov for federal deployment |
| Mobile native applications | v2.0 | Web-responsive only for v1.0 |
| Historical data migration | v1.1 | No legacy data import in v1.0 |

---

## 5. Architecture Overview

> **Full architecture documented in [ARCHITECTURE.md](ARCHITECTURE.md)**
>
> Key architectural decisions:
> - **Domain-driven decomposition** aligned to OASIS ECF 5.0 Major Design Elements
> - **Event-sourced docket** — the docket IS the event log (immutable, append-only)
> - **Party-centric data model** — persons/orgs span multiple cases
> - **CQRS** — separate write path (filings, orders) from read path (search, dashboards)
> - **Single PostgreSQL database** with schema-level separation (not per-service DBs)
> - **Google Pub/Sub event bus** for async inter-service communication
> - **Two API gateways** — public (DMZ) + internal (RBAC-enforced)
> - **Two frontend apps** — Public Portal (combined public + e-filing) and Internal Portal (combined CMS + judicial workspace)
> - **Sealed document isolation** — separate GCS bucket with restricted IAM
> - **Service-to-service auth** — JWT passthrough for user-context calls + API keys from GCP Secret Manager for system/event calls
> - **Deployment** — Docker Compose local dev + GitHub Actions CI/CD to Cloud Run (no Terraform in v1.0)
>
> **10 domain services** (8 domain + 2 gateways): public-gateway, internal-gateway, court-record, filing-review,
> document-mgmt, scheduling, judicial-workspace, ai-engine, notification, identity

---

## 6. Roles & Personas

### 6.1 Internal Roles (IACP CMS)

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **OALJ Docket Clerk** | Manages intake queue, dockets new cases, assigns to judges. First point of case entry. | docket, assign, transfer, view_all_cases, manage_deficiencies |
| **OALJ Legal Assistant** | Supports ALJ chambers with scheduling, exhibits, notices, and administrative tasks. | schedule_hearing, manage_exhibits, generate_notices, manage_transcripts |
| **OALJ Attorney-Advisor** | Provides legal research, drafts bench memos and decision drafts for ALJ review. | draft_decision, create_bench_memo, submit_draft, ai_research |
| **Administrative Law Judge (ALJ)** | Presides over cases, reviews drafts, signs decisions, manages hearings. | sign_decision, seal_document, close_record, review_drafts, manage_hearings |
| **System Administrator** | Manages users, roles, system configuration. (v1.0 basic) | manage_users, manage_roles, system_config |

### 6.2 External Personas (Public Portal)

| Persona | Description | Capabilities |
|---------|-------------|-------------|
| **Claimant** | Individual filing a claim (BLA, LHC, workers' comp). May be self-represented. | file_new_case, upload_documents, check_status, request_access |
| **Employer/Insurer Representative** | Responds to claims on behalf of employer or insurance carrier. | respond_to_claim, upload_evidence, check_status, request_access |
| **Attorney/Representative** | Licensed attorney or authorized representative filing on behalf of a party. | file_on_behalf, upload_documents, check_status, manage_representations |

### 6.3 Permission Matrix

| Permission | Clerk | LA | AA | ALJ | Admin | Claimant | Rep | Attorney |
|-----------|-------|-----|-----|------|-------|----------|-----|----------|
| File new case | — | — | — | — | — | ✓ | ✓ | ✓ |
| Docket case | ✓ | — | — | — | — | — | — | — |
| Assign case | ✓ | — | — | — | — | — | — | — |
| Schedule hearing | — | ✓ | — | ✓ | — | — | — | — |
| Manage exhibits | — | ✓ | — | — | — | — | — | — |
| Draft decision | — | — | ✓ | ✓ | — | — | — | — |
| Sign decision | — | — | — | ✓ | — | — | — | — |
| Seal document | — | — | — | ✓ | — | — | — | — |
| View all cases | ✓ | — | — | — | ✓ | — | — | — |
| View assigned cases | — | ✓ | ✓ | ✓ | — | — | — | — |
| View own cases | — | — | — | — | — | ✓ | ✓ | ✓ |
| Upload documents | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| AI chatbot | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| Manage users | — | — | — | — | ✓ | — | — | — |

---

## 7. OALJ Case Lifecycle & Workflows

### 7.1 Case Lifecycle Phases

```
INTAKE → DOCKETING → ASSIGNMENT → PRE-HEARING → HEARING → DECISION → POST-DECISION
  │          │            │             │            │          │            │
  ▼          ▼            ▼             ▼            ▼          ▼            ▼
Filing    Validate     Assign to    Schedule     Conduct    Draft &     Serve
received  & assign     ALJ via      hearing,     hearing    sign        decision,
via EFS   docket #     smart algo   manage       (video/    decision    appeals
or mail              (AI-assisted)  exhibits     in-person)             window
```

### 7.2 Detailed Workflow: New Case Filing (Public → Internal)

```
CLAIMANT/ATTORNEY (Public Portal)          SYSTEM (AI + Backend)           DOCKET CLERK (Internal)
─────────────────────────────────          ────────────────────            ──────────────────────
1. Submit filing form
   (case type, parties, docs)
                                    2. Validate filing completeness
                                       (AI: Gemini scoring 0-100)
                                    3. Score ≥ 90? → AUTO-DOCKET
                                       Score < 90? → Manual queue
                                    4. Generate docket number
                                       (YYYY-TYPE-NNNNN)
                                    5. Store documents in DMS
                                    6. Create case record
                                                                    7. Review auto-docketed cases
                                                                    8. Handle deficient filings
                                                                       (issue deficiency notice)
                                    9. Run smart assignment
                                       (workload + expertise + geo)
                                                                   10. Confirm/override assignment
                                   11. Notify assigned ALJ
                                   12. Notify filing party (confirmation)
```

### 7.3 Case Types

| Code | Full Name | Statutory Deadline | Key Characteristics |
|------|-----------|-------------------|---------------------|
| **BLA** | Black Lung Act | 270 days | Occupational lung disease claims; complex medical evidence |
| **LHC** | Longshore & Harbor Workers' Comp | 270 days | Maritime injury/death claims; employer/insurer respondent |
| **PER** | Other Programs | Varies | FECA, DBA, Whistleblower, OFLC; diverse case types |

### 7.4 SLA Tracking (270-Day Rule)

| Status | Days Remaining | Alert Level | Action |
|--------|---------------|-------------|--------|
| Green | > 90 days | Info | On track |
| Amber | 30–90 days | Warning | Expedite review |
| Red | < 30 days | Critical | Immediate escalation |
| Breached | 0 or past due | Overdue | Report to management |

---

## 8. Team Structure & AI Agent Governance

### 8.1 Team Roles

| Role | Agent | Responsibilities |
|------|-------|-----------------|
| **Product Owner** | Rahul (Human) | Requirements, priorities, PR review, conflict resolution, final decisions |
| **Solution Architect** | Claude (AI) | Architecture design, planning, code review, integration design, quality oversight |
| **Implementation Engineer** | Qwen (AI) | Code generation, configuration, deployment scripts, debugging |
| **Code Assistant** | Aider (AI) | In-editor pair programming, refactoring, localized code changes |

### 8.2 Governance Rules

1. **All PRs require PO (Rahul) approval** before merge to `develop` or `main`
2. **Architecture decisions** require Claude proposal + PO sign-off
3. **Implementation conflicts**: Claude proposes resolution with rationale → PO decides
4. **AI-generated code** must pass CI pipeline (lint + tests + type-check) before PR review
5. **Security-sensitive changes** (auth, RBAC, data access) require explicit PO review

### 8.3 Workflow

```
1. PO creates Issue/Epic in GitHub Projects
2. Claude breaks down into user stories + technical tasks
3. Qwen/Aider implement on feature/* branch
4. CI runs automatically (tests, lint, type-check)
5. Claude reviews code architecture & quality
6. PO reviews PR and approves/requests changes
7. Merge to develop → deploy to test environment
8. PO validates → merge to main → deploy to production
```

### 8.4 Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready releases | PR required, PO approval, CI must pass |
| `develop` | Integration branch | PR required, CI must pass |
| `feature/*` | Feature development | No restrictions |
| `fix/*` | Bug fixes | No restrictions |
| `release/*` | Release candidates | PR to main required |

---

## 9. Timeline & Milestones

### Month 1: Foundation (Mar 21 – Apr 20, 2026)

**Goal**: Backend services running, database schema deployed, auth working, basic case CRUD

| Week | Focus | Deliverables |
|------|-------|-------------|
| **W1** (Mar 21-28) | Project setup & infrastructure | Monorepo structure, Docker Compose (local dev), PostgreSQL schema v1, CI/CD pipeline skeleton, GitHub Projects setup |
| **W2** (Mar 29 - Apr 4) | Auth + Gateway | Google OAuth flow, JWT middleware, RBAC enforcement, API Gateway routing, User management |
| **W3** (Apr 5-11) | Case Service core | Case CRUD API, docketing endpoint, docket number generation, case status tracking, filing validation |
| **W4** (Apr 12-18) | AI Service foundation + Public Portal shell | Gemini integration for auto-docketing, smart assignment algorithm (server-side), Public portal: filing form + status check |

**Month 1 Milestone**: Internal user can create a case via API, authenticate via Google OAuth, and see it assigned to a judge. Public portal shell serves a filing form.

### Month 2: Features & DMS (Apr 21 – May 20, 2026)

**Goal**: Document management working, role-specific dashboards connected to real data, hearing scheduling, public portal functional

| Week | Focus | Deliverables |
|------|-------|-------------|
| **W5** (Apr 19-25) | Document Service | GCS upload/download, versioning, metadata storage, exhibit management API, audit trail |
| **W6** (Apr 26 - May 2) | Frontend integration (Internal) | Connect existing React dashboards to real APIs, replace mock data, Docket Clerk + ALJ dashboards live |
| **W7** (May 3-9) | Scheduler Service + remaining roles | Hearing scheduling API, Legal Assistant + Attorney-Advisor dashboards connected, bench memo & decision draft APIs |
| **W8** (May 10-16) | Public Portal completion | Filing submission → auto-docket flow end-to-end, case status lookup, document upload from public portal, filing confirmation/receipt |

**Month 2 Milestone**: Full case lifecycle works end-to-end. External user files case → auto-docketed → assigned → hearing scheduled → decision drafted. All 4 internal roles have functional dashboards with real data.

### Month 3: Polish & Deploy (May 21 – Jun 21, 2026)

**Goal**: AI features complete, production deployment, testing, documentation

| Week | Focus | Deliverables |
|------|-------|-------------|
| **W9** (May 17-23) | AI features complete | AI chatbot connected to real case data, document analysis/OCR, smart assignment refinement, auto-docket accuracy tuning |
| **W10** (May 24-30) | Testing & hardening | Integration tests, E2E tests, security audit (auth, RBAC, data access), performance optimization, accessibility review |
| **W11** (May 31 - Jun 6) | Cloud Run deployment | Production Cloud Run config, environment separation (dev/test/prod), monitoring & logging, deployment documentation |
| **W12** (Jun 7-13) | Final polish + release | Bug fixes from testing, UX polish, v1.0 release notes, demo preparation |
| **Buffer** (Jun 14-21) | Contingency | Overflow from any delayed items |

**v1.0 Release Milestone**: Production-ready system deployed on GCP Cloud Run with local Docker development support.

---

## 10. Constraints & Assumptions

### Constraints

| # | Constraint | Impact |
|---|-----------|--------|
| C1 | 3-month timeline | Strict MVP scoping; features deferred to v1.1/v1.2 |
| C2 | Team of 1 human + 3 AI agents | No parallel human development; AI agents work asynchronously |
| C3 | GCP serverless only | Architecture limited to Cloud Run, Cloud SQL, GCS, Firestore, Vertex AI |
| C4 | Open-source | No proprietary dependencies; all code publicly available |
| C5 | Existing IACP-3.0 repo | Must build on/alongside existing prototype code |
| C6 | Must work locally via Docker | Docker Compose required for all services |

### Assumptions

| # | Assumption |
|---|-----------|
| A1 | GCP project with billing is available and configured |
| A2 | Gemini API (Vertex AI) quotas are sufficient for development and testing |
| A3 | Google OAuth can be configured with test users for development |
| A4 | No existing data migration required for v1.0 |
| A5 | Prototype frontend components are reusable with API integration |
| A6 | Single GCP region (us-central1) is acceptable for v1.0 |
| A7 | No multi-tenancy required in v1.0 (single OALJ instance) |

---

## 11. Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| R1 | **AI hallucination in auto-docketing** | Medium | High | Human-in-the-loop: all AI decisions reviewable by Docket Clerk; confidence scores visible; audit trail |
| R2 | **Timeline compression** | High | High | Strict MVP scope; weekly milestone reviews; buffer week built into Month 3 |
| R3 | **Frontend-backend integration complexity** | Medium | Medium | Existing prototype provides clear UI contracts; API-first design with OpenAPI specs |
| R4 | **AI agent coordination conflicts** | Medium | Medium | Clear governance: Claude architects, Qwen implements, PO resolves conflicts |
| R5 | **GCP service limits/costs** | Low | Medium | Use free tiers where possible; Cloud SQL basic tier; monitor spending |
| R6 | **Data model changes mid-development** | Medium | High | Schema versioning with Alembic migrations; design schema carefully in W1 |
| R7 | **Prototype code debt** | Medium | Medium | Refactor incrementally; don't rewrite — integrate |

---

## 12. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite 6, TailwindCSS 4 | SPA with role-based dashboards |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2 | Microservices API layer |
| **Database** | PostgreSQL 15 (Cloud SQL) | Primary relational data store |
| **Real-time** | Firestore | Notifications, presence, real-time updates |
| **Storage** | Google Cloud Storage (GCS) | Document/exhibit file storage |
| **AI/ML** | Vertex AI, Gemini 2.0 Flash | Auto-docketing, analysis, chatbot |
| **Auth** | Google OAuth 2.0, JWT (PyJWT) | Authentication & session management |
| **ORM** | SQLAlchemy 2.0 + Alembic | Database access & migrations |
| **Testing** | Pytest (backend), Vitest (frontend) | Unit & integration testing |
| **Containers** | Docker, Docker Compose | Local development & deployment |
| **Compute** | Google Cloud Run | Serverless container hosting |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Project Mgmt** | GitHub Projects | Issue tracking, epics, sprints |
| **Icons** | Lucide React | UI iconography |
| **PDF** | WeasyPrint + Jinja2 | Server-side PDF generation (HTML/CSS templates → PDF/A) |
| **Event Sourcing** | eventsourcing (PostgreSQL backend) | Immutable docket event log with state replay |
| **State Machine** | pytransitions/transitions | Case lifecycle FSM with guard conditions |
| **RBAC** | PyCasbin + fastapi-authz | Policy-based role and attribute access control |
| **Event Bus** | Google Pub/Sub | Async inter-service communication |
| **Email** | SendGrid (free tier, v1.0) | Transactional email delivery with provider adapter pattern |

---

## 13. Development & Deployment Strategy

### 13.1 Repository Structure (Target)

```
IACP-3.0/
├── apps/
│   ├── public-portal/           # Public Portal — public access + e-filing (React SPA)
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── vite.config.ts
│   └── internal-portal/         # Internal Portal — CMS + judicial workspace (React SPA)
│       ├── src/
│       ├── package.json
│       ├── Dockerfile
│       └── vite.config.ts
├── services/
│   ├── public-gateway/          # Public API Gateway (FastAPI)
│   ├── internal-gateway/        # Internal API Gateway (FastAPI, RBAC-enforced)
│   ├── identity/                # Authentication & RBAC (OAuth, JWT, PyCasbin)
│   ├── court-record/            # Case lifecycle, parties, docket events
│   ├── filing-review/           # Intake pipeline, validation, auto-docketing
│   ├── document-mgmt/           # DMS (GCS + metadata, PDF gen)
│   ├── scheduling/              # Hearing scheduling, courtrooms, reporters
│   ├── judicial-workspace/      # Bench memos, drafts, sign/release
│   ├── ai-engine/               # Gemini integration, scoring, chatbot
│   └── notification/            # Email (SendGrid), in-app, legal service
├── libs/
│   ├── domain-model/            # Shared domain entities, events, state machine
│   └── ui-components/           # Shared React UI component library
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml   # Local dev stack (all services + emulators)
│   ├── sql/
│   │   └── init.sql             # Database initialization
│   └── cloud-run/               # Cloud Run service configs
├── .github/
│   ├── workflows/               # CI/CD pipelines (per-service)
│   └── ISSUE_TEMPLATE/          # Issue/story templates
├── docs/
│   ├── PROJECT_CHARTER.md       # This document
│   ├── ARCHITECTURE.md          # Full system architecture
│   ├── DATA_MODEL.md            # Domain data model
│   ├── DECISIONS.md             # Architecture Decision Log
│   └── OPEN_SOURCE_COMPONENTS.md # Component selections
├── CLAUDE.md                    # AI agent instructions
└── README.md
```

### 13.2 Local Development

```bash
# Start all services locally
docker-compose -f infra/docker/docker-compose.yml up -d

# Services available at:
# Public Portal:       http://localhost:5173
# Internal Portal:     http://localhost:5174
# Public Gateway:      http://localhost:8000
# Internal Gateway:    http://localhost:8010
# Identity:            http://localhost:8001
# Court Record:        http://localhost:8002
# Filing Review:       http://localhost:8003
# Document Mgmt:       http://localhost:8004
# Scheduling:          http://localhost:8005
# Judicial Workspace:  http://localhost:8006
# AI Engine:           http://localhost:8007
# Notification:        http://localhost:8008
# PostgreSQL:          localhost:5432
# Pub/Sub Emulator:    localhost:8085
# Firestore Emulator:  localhost:8080
```

### 13.3 Deployment Environments

| Environment | Purpose | Trigger |
|-------------|---------|---------|
| **Local** | Development & testing | `docker-compose up` |
| **Dev (GCP)** | Integration testing | Push to `develop` branch |
| **Prod (GCP)** | Production | Merge to `main` branch |

### 13.4 CI/CD Pipeline (per service)

```
Push → Lint → Type-check → Unit Tests → Build Docker Image → Push to Artifact Registry → Deploy to Cloud Run
```

---

## 14. Quality Assurance Approach

### Testing Strategy

| Level | Tool | Scope | Target Coverage |
|-------|------|-------|----------------|
| **Unit Tests** | Pytest (backend), Vitest (frontend) | Individual functions, services | 80%+ |
| **Integration Tests** | Pytest + TestClient | API endpoints, database queries | Key workflows |
| **E2E Tests** | Playwright or Cypress | Full user flows | Critical paths |
| **AI Accuracy Tests** | Custom benchmark suite | Auto-docketing, assignment accuracy | 90%+ on test set |

### Code Quality

- **Linting**: Ruff (Python), ESLint (TypeScript)
- **Formatting**: Black (Python), Prettier (TypeScript)
- **Type Safety**: Mypy (Python), TypeScript strict mode
- **Security Scanning**: Dependabot (dependencies), basic SAST in CI
- **API Documentation**: Auto-generated OpenAPI/Swagger from FastAPI

### Review Process

1. All code changes via Pull Request
2. CI must pass (lint + tests + type-check)
3. Claude reviews architecture and code quality
4. PO reviews and approves
5. Merge only after approval

---

## 15. Appendix: Epic Overview (Detailed breakdown in separate document)

| # | Epic | Month | Priority |
|---|------|-------|----------|
| E1 | Project Setup & Infrastructure | M1-W1 | P0 |
| E2 | Authentication & Authorization | M1-W2 | P0 |
| E3 | Case Service — Core CRUD & Docketing | M1-W3 | P0 |
| E4 | AI Service — Auto-Docketing & Assignment | M1-W4 | P0 |
| E5 | Document Management System | M2-W5 | P0 |
| E6 | Frontend Integration — Internal Dashboards | M2-W6 | P0 |
| E7 | Scheduler Service & Remaining Roles | M2-W7 | P1 |
| E8 | Public Portal (EFS) | M2-W8 | P1 |
| E9 | AI Features — Chatbot & Analysis | M3-W9 | P1 |
| E10 | Testing & Security Hardening | M3-W10 | P0 |
| E11 | Production Deployment | M3-W11 | P0 |
| E12 | Polish & v1.0 Release | M3-W12 | P1 |

---

## 16. Related Documents

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full system architecture |
| [DATA_MODEL.md](DATA_MODEL.md) | Domain data model and entity definitions |
| [DECISIONS.md](DECISIONS.md) | Architecture Decision Log (18 ADRs) |
| [OPEN_SOURCE_COMPONENTS.md](OPEN_SOURCE_COMPONENTS.md) | Open source component selections |
| [PRD.md](PRD.md) | Complete product requirements |

---

*This charter is a living document. Updates require PO approval and will be version-tracked in the repository.*
