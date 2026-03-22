# IACP 3.0 — Open Source Components & Reference Implementations

> Evaluated 2026-03-22. Components selected to avoid reinventing the wheel.

---

## 1. Reference eCourt Systems (Study & Adapt Patterns)

### US Tax Court EF-CMS ★★★★★ (Primary Reference)
- **Repo**: [ustaxcourt/ef-cms](https://github.com/ustaxcourt/ef-cms) — 102 stars, actively maintained
- **What it is**: Production e-filing & case management system used by the US Tax Court
- **Stack**: Node.js, React, AWS (DynamoDB, S3, Lambda, SQS), OpenSearch, Terraform
- **License**: CC0 1.0 (Public Domain)
- **Reuse**: Study their **domain model** (case lifecycle, parties, docketing, document management), **user stories/issues**, **test patterns**, and **workflow design**. Their architecture docs and team charter are excellent references for how a federal court structures an e-filing CMS.
- **What NOT to reuse**: AWS-specific infrastructure (we're GCP), Node.js stack (we're Python/FastAPI)

### Federal Courts Open Case Filing System
- **Repo**: [federal-courts-software-factory/open-case-filing-system](https://github.com/federal-courts-software-factory/open-case-filing-system)
- **What it is**: Aspirational CM/ECF replacement by the Federal Courts Software Factory
- **Stack**: SurrealDB, htmx
- **Reuse**: Study their **requirements analysis** and **functional decomposition**. Early stage but aligned with federal court modernization direction.

### Iuris-Soft
- **Repo**: [iamgilwell/Iuris-Soft](https://github.com/iamgilwell/Iuris-Soft)
- **What it is**: Open-source legal management system with case lifecycle, document management, contract management
- **Reuse**: Study their **document management model** (uploads, comments, statuses, templates, search) and **hearing management** patterns.

---

## 2. Core Libraries to USE (Install as Dependencies)

### Event Sourcing & CQRS

| Library | Use For | Install |
|---------|---------|---------|
| **[eventsourcing](https://github.com/topics/event-sourcing?l=python)** (1.6k ★) | Event sourcing with SQLAlchemy. Mature, well-tested. | `pip install eventsourcing[postgres]` |
| **[python-cqrs](https://pypi.org/project/python-cqrs/)** | CQRS command/query routing for FastAPI. Supports Kafka, Protobuf. | `pip install python-cqrs` |

**Decision**: Use `eventsourcing` library for the docket event store. It supports PostgreSQL natively and provides aggregate, event, and snapshot patterns out of the box. Supplement with custom CQRS read-model projections.

**Reference implementations**:
- [aliseylaneh/Python-Eventsourcing-CQRS](https://github.com/aliseylaneh/Python-Eventsourcing-CQRS) — FastAPI + event sourcing + CQRS reference
- [marcosvs98/cqrs-architecture-with-python](https://github.com/marcosvs98/cqrs-architecture-with-python) — Ports & Adapters + CQRS with FastAPI

### State Machine (Case Lifecycle)

| Library | Use For | Install |
|---------|---------|---------|
| **[pytransitions/transitions](https://github.com/pytransitions/transitions)** | Case lifecycle state machine (Intake→Docketed→Assigned→Hearing→Decision). Lightweight, extensible, supports callbacks on transitions. | `pip install transitions` |

**Decision**: Use `transitions` for modeling case phase transitions. Define allowed transitions, guard conditions (e.g., can't move to Hearing without assigned judge), and trigger events on Pub/Sub when transitions occur.

### RBAC & Authorization

| Library | Use For | Install |
|---------|---------|---------|
| **[pycasbin/fastapi-authz](https://github.com/pycasbin/fastapi-authz)** | Policy-based authorization middleware. Casbin supports RBAC, ABAC, and custom models. | `pip install casbin fastapi-authz` |

**Decision**: Use PyCasbin for RBAC. It supports policy files (declarative), database-stored policies, and multi-tenancy. Perfect for our permission matrix (clerk can docket, ALJ can sign, etc.). More flexible than hand-rolled decorators.

**Reference**:
- [00-Python/FastAPI-Role-and-Permissions](https://github.com/00-Python/FastAPI-Role-and-Permissions) — JWT + PostgreSQL RBAC boilerplate for FastAPI

### Document Management

| Library | Use For | Notes |
|---------|---------|-------|
| **[google-cloud-storage](https://pypi.org/project/google-cloud-storage/)** | GCS file operations | Google official SDK |
| **[WeasyPrint](https://weasyprint.org/)** | PDF generation from HTML/CSS templates | Better for legal docs than ReportLab |
| **[pdf2image](https://pypi.org/project/pdf2image/) + [pytesseract](https://pypi.org/project/pytesseract/)** | OCR for scanned document analysis | Works with Vertex AI for enhanced analysis |

**Decision**: Build custom DMS layer (not adopt Mayan EDMS or Papermerge — they're too heavy and Django-based). Use GCS SDK directly with our own PostgreSQL metadata layer for versioning, exhibits, and audit trail. Use WeasyPrint for PDF generation (decisions, notices) from Jinja2 templates.

### GCP Infrastructure

| Library/Template | Use For | Link |
|-----------------|---------|------|
| **[TobKed/fastapi_cloudrun_pubsub](https://github.com/TobKed/fastapi_cloudrun_pubsub)** | Cloud Run + FastAPI + Pub/Sub boilerplate with Terraform & GitHub Actions CI/CD | Adapt as our infrastructure template |
| **[anthonycorletti/cloudrun-fastapi](https://github.com/anthonycorletti/cloudrun-fastapi)** | FastAPI Cloud Run template with GitHub Actions | Simpler starting point |

**Decision**: Fork/adapt `fastapi_cloudrun_pubsub` as our infrastructure template. It already has the exact stack we need: FastAPI services on Cloud Run, Pub/Sub for event bus, Terraform for IaC, GitHub Actions for CI/CD.

### AI / LLM Integration

| Library | Use For | Install |
|---------|---------|---------|
| **[google-genai](https://pypi.org/project/google-genai/)** | Gemini 2.0 Flash API (already used in prototype) | `pip install google-genai` |
| **[langchain-google-genai](https://pypi.org/project/langchain-google-genai/)** | If we need RAG or complex AI chains | `pip install langchain-google-genai` |

**Decision**: Use `google-genai` directly for Gemini calls (auto-docketing, document analysis, chatbot). Avoid LangChain overhead unless we need RAG for legal research.

---

## 3. Frontend Libraries (Keep/Add)

| Library | Status | Use For |
|---------|--------|---------|
| React 18 + TypeScript | **Keep** (existing) | SPA framework |
| Vite 6 | **Keep** (existing) | Build tool |
| TailwindCSS 4 | **Keep** (existing) | Styling |
| Lucide React | **Keep** (existing) | Icons |
| React Router 7 | **Keep** (existing) | Routing |
| Motion | **Keep** (existing) | Animations |
| **[TanStack Query](https://tanstack.com/query)** | **Add** | API data fetching, caching, real-time sync |
| **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)** | **Add** | Form management + validation (filing forms) |
| **[@react-pdf/renderer](https://react-pdf.org/)** | **Add** | Client-side PDF preview |

---

## 4. Testing & Quality

| Tool | Use For | Install |
|------|---------|---------|
| **Pytest** | Backend unit & integration tests | `pip install pytest pytest-asyncio` |
| **Vitest** | Frontend tests (existing) | Already in prototype |
| **[Playwright](https://playwright.dev/)** | E2E browser testing | `npm install -D @playwright/test` |
| **[Ruff](https://github.com/astral-sh/ruff)** | Python linting + formatting (replaces flake8/black/isort) | `pip install ruff` |
| **[Mypy](https://mypy-lang.org/)** | Python type checking | `pip install mypy` |

---

## 5. Standards to Follow (Not Libraries, But Reference Material)

| Standard | Use For | Link |
|----------|---------|------|
| **OASIS ECF 5.0/5.01** | E-filing message formats, MDE architecture | [ECF 5.0 Spec](https://docs.oasis-open.org/legalxml-courtfiling/ecf/v5.0/ecf-v5.0.html) |
| **NIEM (NIEMOpen)** | Data exchange models for justice domain | [NIEMOpen](https://niemopen.org/) |
| **WCAG 2.1 AA** | Accessibility compliance | Already referenced in prototype |
| **PDF/A** | Archival document format | For generated decisions/orders |

---

## 6. Reuse Strategy Summary

| Domain | Build vs Reuse | Decision |
|--------|---------------|----------|
| **Case lifecycle/state machine** | Library + custom | `transitions` library + custom case domain logic |
| **Event sourcing** | Library | `eventsourcing` with PostgreSQL backend |
| **CQRS** | Custom (simple) | Custom read-model projections; `python-cqrs` if needed |
| **RBAC** | Library | PyCasbin (`fastapi-authz`) |
| **Document storage** | Custom on GCS SDK | GCS + PostgreSQL metadata (not full DMS product) |
| **PDF generation** | Library | WeasyPrint + Jinja2 templates |
| **Event bus** | GCP managed | Google Pub/Sub (no self-managed Kafka) |
| **API framework** | Library | FastAPI (as planned) |
| **Infrastructure template** | Fork/adapt | `fastapi_cloudrun_pubsub` template |
| **AI** | SDK + custom | `google-genai` SDK + custom scoring/validation logic |
| **Frontend** | Evolve existing | Keep prototype components, add TanStack Query + React Hook Form |
| **E-filing patterns** | Study reference | Study `ustaxcourt/ef-cms` domain model and workflows |
| **State machine integration** | Reference | Study [FSM + FastAPI article](https://medium.com/@tech-adventurer/building-state-aware-applications-with-finite-state-machines-and-fastapi-11d9b2894f3a) |

---

## 7. Key Dependencies List (Backend)

```txt
# Core
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.0
sqlalchemy>=2.0
alembic>=1.13

# Database
asyncpg>=0.29.0
psycopg2-binary>=2.9

# Event Sourcing & CQRS
eventsourcing[postgres]>=9.0
transitions>=0.9

# Auth & RBAC
python-jose[cryptography]>=3.3
casbin>=1.36
fastapi-authz>=0.3

# GCP Services
google-cloud-storage>=2.14
google-cloud-pubsub>=2.19
google-cloud-firestore>=2.14
google-genai>=1.0

# Document Processing
weasyprint>=62.0
pytesseract>=0.3
Jinja2>=3.1

# Quality
ruff>=0.5
mypy>=1.10
pytest>=8.0
pytest-asyncio>=0.23
httpx>=0.27  # for FastAPI test client
```

---

*This document will be updated as we evaluate and integrate components during development.*
