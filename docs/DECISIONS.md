# IACP 3.0 — Architecture Decision Log

> Every architecture decision is recorded here with rationale. Decisions are immutable once status is ACCEPTED — changes require a new ADR that supersedes the old one.
>
> **Status values**: PROPOSED → ACCEPTED → SUPERSEDED

---

## ADR-001: Backend Language & Framework
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Python 3.11+ with FastAPI, Pydantic v2, SQLAlchemy 2.0
- **Rationale**: Async-native, type-safe, auto-generates OpenAPI docs. Team familiarity. Gemini SDK is Python-first.
- **Alternatives considered**: Node.js/Express (EF-CMS uses this), Go, Java/Spring
- **Consequences**: Shared domain model library must be Python. Frontend TypeScript types generated from OpenAPI specs.

## ADR-002: Database — Single PostgreSQL
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Single PostgreSQL 15 instance via Cloud SQL. Schema-level separation per domain (core, filing, document, scheduling, judicial, identity, ai, notification, reporting). NOT per-service databases.
- **Rationale**: Court data is deeply relational. Party-centric model requires cross-domain joins. Single DB avoids distributed transaction complexity.
- **Alternatives considered**: Per-service databases (rejected — too complex for team size), DynamoDB (EF-CMS uses this, rejected — NoSQL poor fit for relational court data), Firebase/Firestore (rejected — not relational)
- **Consequences**: All services share one connection pool. Schema migrations coordinated via single Alembic config.

## ADR-003: Firestore for Real-Time Only
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Firestore used exclusively for real-time features: notifications, presence, chat sessions. NOT for case data.
- **Rationale**: PostgreSQL is source of truth. Firestore provides real-time listeners without polling.
- **Consequences**: Notification service writes to both PostgreSQL (audit trail) and Firestore (real-time delivery).

## ADR-004: Event Bus — Google Pub/Sub
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Google Cloud Pub/Sub for all async inter-service communication. Event-driven architecture.
- **Rationale**: Serverless, managed, GCP-native. Sufficient throughput for court case volumes (~1000s of events/day, not millions). Avoids managing Kafka cluster.
- **Alternatives considered**: Kafka (rejected — operational overhead), RabbitMQ (rejected — not serverless), direct HTTP calls between services (rejected — tight coupling)
- **Consequences**: All services are event producers/consumers. Local dev uses Pub/Sub emulator.

## ADR-005: Event-Sourced Docket
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Docket entries stored as immutable events in `docket_events` table. Current case state derived from event replay. Uses `eventsourcing` Python library with PostgreSQL backend.
- **Rationale**: Court dockets ARE event logs by nature. Every action must be recorded, timestamped, attributable. Event sourcing provides natural audit trail.
- **Consequences**: Case state is eventually consistent. Materialized `cases` table rebuilt from events for query performance (CQRS).

## ADR-006: Party-Centric Data Model
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Persons/organizations are first-class entities linked to cases via `case_parties` junction table. A single party record spans multiple cases.
- **Rationale**: An attorney may represent clients in multiple cases. A claimant may have BLA and LHC cases. Party-centric enables holistic views. Follows Tyler Odyssey pattern.
- **Consequences**: Party deduplication is important. Unique identifier strategy needed (email for external, employee ID for internal).

## ADR-007: Authentication — Google OAuth 2.0 (v1.0)
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: Google OAuth 2.0 for both public and internal users in v1.0. JWT session tokens with role claims. Login.gov deferred to v1.1 for federal deployment.
- **Internal users**: Google OAuth with SSO mock (simulated SSO via role assignment in admin panel — not real enterprise SSO)
- **Public users**: Google OAuth with basic registration
- **Rationale**: Fast to implement. GCP-native. Login.gov requires PIV/CAC card infrastructure not available for prototype.
- **Consequences**: Identity service has adapter pattern — swap Google OAuth for Login.gov without changing other services.

## ADR-008: Service-to-Service Authentication
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: Dual mechanism:
  - **User-context calls** (gateway → service): JWT passthrough. User's token forwarded with request.
  - **System/event calls** (service → service, Pub/Sub handlers): Service account API keys stored in GCP Secret Manager. Rotation period: 1 year.
- **Rationale**: User-context calls need RBAC enforcement (who is making this request?). System calls need service identity (which service is calling?). Both are needed.
- **Consequences**: Each service has a service account. Secret Manager integration required in all services. Key rotation job runs annually.

## ADR-009: Frontend Architecture — Two Applications
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: Two React SPAs:
  1. **Public Portal** (combined public access + e-filing) — public ingress, Google OAuth for filers, unauthenticated for status lookup
  2. **Internal Portal** (CMS + judicial workspace) — internal ingress, role-based routing, SSO mock
- **Rationale**: Different security zones require separate deployment. But public access and e-filing are close enough functionally to share one app (same users: claimants, attorneys). Three apps was over-engineering.
- **Consequences**: Shared UI component library in `libs/ui-components/`. Two Dockerfiles, two Cloud Run services for frontend.

## ADR-010: RBAC Engine — PyCasbin
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: PyCasbin with `fastapi-authz` middleware for role-based access control. Policy-based (declarative rules in config/database).
- **Rationale**: Supports RBAC, ABAC, and custom policy models. More flexible than hand-rolled decorators. Supports multi-tenancy for future variants.
- **Consequences**: Policy definitions stored in PostgreSQL. Admin UI for managing role assignments. Policy changes don't require code deploys.

## ADR-011: Case Lifecycle State Machine — Transitions Library
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: `pytransitions/transitions` library for case lifecycle FSM. States: Intake → Docketed → Assigned → Pre-Hearing → Hearing → Decision → Post-Decision → Closed. Guard conditions enforce valid transitions.
- **Rationale**: Lightweight, Python-native, supports callbacks on transitions (trigger Pub/Sub events), hierarchical states.
- **Consequences**: State machine definition lives in `libs/domain-model/`. Each transition emits an event to Pub/Sub.

## ADR-012: Document Storage — GCS with Sealed Isolation
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: Three GCS buckets per environment:
  - `iacp-documents-{env}` — standard documents (filings, exhibits, decisions)
  - `iacp-sealed-{env}` — sealed/confidential documents (separate IAM, restricted access)
  - `iacp-generated-{env}` — system-generated PDFs (notices, docket sheets)
- **Rationale**: Physical isolation of sealed documents prevents accidental exposure. Separate IAM policies. Follows post-2025 CM/ECF breach best practices.
- **Consequences**: Document service manages all three buckets. Sealed access logged in separate audit table.

## ADR-013: PDF Generation — WeasyPrint
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: WeasyPrint + Jinja2 templates for server-side PDF generation. HTML/CSS → PDF/A.
- **Rationale**: Legal documents are text-heavy with standard formatting. HTML/CSS templates are easier to maintain than programmatic PDF builders. WeasyPrint supports PDF/A for archival compliance.
- **Alternatives considered**: ReportLab (rejected — more complex for text documents), @react-pdf/renderer (client-side only, can't generate on server)
- **Consequences**: PDF templates stored in `services/document-mgmt/templates/`. Jinja2 renders data into HTML, WeasyPrint converts to PDF.

## ADR-014: Email/Notification — SendGrid (v1.0)
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: SendGrid free tier for v1.0 email delivery. Provider-agnostic adapter pattern in notification service — can swap to AWS SES, Google Cloud Mail, or customer-specific provider.
- **Rationale**: SendGrid free tier sufficient for prototype volumes. Easy API. Customer deployment may require different provider.
- **Consequences**: Notification service has `EmailProvider` interface with SendGrid implementation. New implementations can be swapped via config.

## ADR-015: Deployment — Local Docker + GitHub Actions to Cloud Run
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**:
  - **Local dev**: Docker Compose with all services, PostgreSQL, Pub/Sub emulator, Firestore emulator, fake-gcs-server
  - **Prototype/test**: GitHub Actions CI/CD → Google Cloud Run
  - **Future (v1.1+)**: IaC via Terraform for enterprise deployment (AI Software Factory pattern)
- **Rationale**: Speed for v1.0. No IaC overhead during rapid development. GitHub Actions already proven in team's workflow (TrueBid). Terraform deferred until architecture stabilizes.
- **Consequences**: Cloud Run service configs defined in YAML. Manual GCP project setup for v1.0. Terraform migration planned for v1.1.

## ADR-016: Domain Service Decomposition
- **Status**: ACCEPTED
- **Date**: 2026-03-21
- **Decision**: 8 domain services + 2 gateways, aligned to court functional domains:

| Service | Domain | Owns |
|---------|--------|------|
| **public-gateway** | Public API routing | Rate limiting, public auth, CORS |
| **internal-gateway** | Internal API routing | RBAC enforcement, internal auth |
| **court-record** | Case lifecycle | Cases, parties, docket events, assignments, SLA |
| **filing-review** | Intake pipeline | Filings, validation, deficiency, auto-docketing |
| **document-mgmt** | Document lifecycle | Documents, versions, exhibits, retention, PDF gen |
| **scheduling** | Court calendar | Hearings, courtrooms, reporters, notices |
| **judicial-workspace** | Chambers operations | Bench memos, drafts, redline, sign/release |
| **ai-engine** | Intelligence layer | Gemini integration, scoring, analysis, chatbot |
| **notification** | Communications | Email, in-app, legal service of process |
| **identity** | Auth & access | OAuth, JWT, RBAC, user management |

- **Rationale**: Aligned to OASIS ECF 5.0 MDEs. Each service owns a bounded context. Domain-driven, not layer-driven.
- **Consequences**: All services share PostgreSQL (ADR-002). Inter-service communication via Pub/Sub (ADR-004). Two gateways enforce zone separation (ADR-009).

## ADR-017: Monorepo Structure — Simple Scripts + Docker Compose
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: Single monorepo (IACP-3.0) with simple npm/pip scripts and Docker Compose. No Nx, Turborepo, or Lerna.
- **Rationale**: Team is 1 human + AI agents. Monorepo tooling adds complexity without proportional benefit at this team size. Docker Compose is the build orchestrator.
- **Consequences**: Each service has its own `requirements.txt` and `Dockerfile`. Shared libs installed via `pip install -e ../libs/domain-model`. CI builds each service independently.

## ADR-018: Data Model Approach — Domain-First, Then Compare EF-CMS
- **Status**: ACCEPTED
- **Date**: 2026-03-22
- **Decision**: Build DOL OALJ adjudication data model from domain requirements first. Then compare with US Tax Court EF-CMS entity patterns. Adopt EF-CMS patterns where there's genuine similarity (shared entity structure, event code registries, factory patterns), but don't force-fit.
- **Rationale**: OALJ adjudication (workers' comp, black lung) has different domain semantics than Tax Court (tax petitions). Data model must be driven by DOL OALJ requirements, not by available reference code.
- **Consequences**: Next step is to map DOL OALJ domain entities before any implementation.

---

*New decisions are appended chronologically. Each ADR is immutable once ACCEPTED.*
