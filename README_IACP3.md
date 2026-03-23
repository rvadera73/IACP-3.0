# IACP 3.0 - Intelligent Adjudicatory Case Portal

**Phase:** 1 - Core Workflows (Public E-Filing + Docket Clerk IACP)  
**Version:** 3.0  
**Last Updated:** March 22, 2026

---

## 🎯 Project Overview

IACP 3.0 is a unified web-based electronic filing and case management system for the Department of Labor's Office of Administrative Law Judges (OALJ). It replaces legacy paper-based workflows with a modern, AI-powered platform.

### Phase 1 Focus

1. **Public E-Filing Portal** - External users can file cases with real-time AI validation
2. **Docket Clerk IACP** - Internal clerks can review, docket, and assign cases with AI assistance

---

## 📚 Documentation Index

### Core Documents

| Document | Purpose | Link |
|----------|---------|------|
| **Product Requirements** | Complete PRD with user stories and acceptance criteria | [`docs/USER_STORIES.md`](docs/USER_STORIES.md) |
| **UI/UX Design** | Design principles, component specs, workflows | [`docs/UI_UX_DESIGN.md`](docs/UI_UX_DESIGN.md) |
| **Implementation Plan** | 5-week sprint breakdown with agent assignments | [`docs/PHASE1_IMPLEMENTATION_PLAN.md`](docs/PHASE1_IMPLEMENTATION_PLAN.md) |
| **Three-Agent Workflow** | Qwen + Aider + Copilot collaboration guide | [`docs/THREE_AGENT_WORKFLOW.md`](docs/THREE_AGENT_WORKFLOW.md) |
| **Architecture** | Enterprise architecture (9 schemas, 8 services) | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| **Data Model** | Complete entity definitions and relationships | [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) |

### Technical Documents

| Document | Purpose | Link |
|----------|---------|------|
| **Database Schema** | PostgreSQL schema with all tables, indexes, functions | [`database/schema.sql`](database/schema.sql) |
| **Migration Guide** | How to run migrations, seed data, backup/recovery | [`database/README.md`](database/README.md) |
| **Seed Data** | Development mock data for testing | [`database/seed_data.sql`](database/seed_data.sql) |
| **CI/CD Workflows** | GitHub Actions for test, staging, production | [`.github/workflows/`](.github/workflows/) |

### Legacy Documents (IACP-2.1 Reference)

| Document | Purpose |
|----------|---------|
| [`PRD.md`](PRD.md) | Original PRD (superseded by docs/USER_STORIES.md) |

> **Note:** `DATA_MODEL.md`, `DATA_MODEL_IACP3.md`, and `DATA_MODEL_VALIDATION.md` were removed (Sprint 1). Canonical data model: [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker (for local development)
- Google Cloud SDK (for deployment)

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/[org]/IACP-3.0.git
cd IACP-3.0

# 2. Install dependencies
npm install
pip install -r backend/requirements.txt

# 3. Start PostgreSQL
docker-compose up -d postgres

# 4. Run migrations
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iacp
alembic upgrade head

# 5. Seed data (optional)
psql -h localhost -U postgres -d iacp -f database/seed_data.sql

# 6. Start frontend (port 3000)
npm run dev

# 7. Start backend (port 8000/8010)
python -m uvicorn backend.main:app --reload

# 8. Run tests
npm test
pytest backend/tests/
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend (Public)** | http://localhost:3000 | Public e-filing portal |
| **Frontend (Internal)** | http://localhost:3000/internal | Docket clerk portal |
| **Public API** | http://localhost:8000 | External API gateway |
| **Internal API** | http://localhost:8010 | Internal API gateway |
| **API Docs** | http://localhost:8000/docs | Swagger/OpenAPI docs |

---

## 🏗️ Architecture Overview

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                          │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  Public Portal      │  │  Internal Portal    │              │
│  │ • E-Filing          │  │ • Docket Clerk      │              │
│  │ • Case Search       │  │ • Case Intelligence │              │
│  └──────────┬──────────┘  └──────────┬──────────┘              │
└─────────────┼─────────────────────────┼─────────────────────────┘
              │                         │
              ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateways (FastAPI)                         │
│  Public (8000)                    Internal (8010)               │
└─────────────┬─────────────────────────┬─────────────────────────┘
              │                         │
              ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Services                              │
│  court-record │ filing-review │ document-mgmt │ scheduling     │
│  judicial-work │ ai-engine │ notification │ identity           │
└─────────────┬─────────────────────────┬─────────────────────────┘
              │                         │
              ▼                         ▼
┌──────────────────┐          ┌──────────────────┐
│ PostgreSQL       │          │ Google Services  │
│ (Cloud SQL)      │          │ • Gemini API     │
│ • 9 schemas      │          │ • OAuth 2.0      │
│ • 25+ tables     │          │ • SendGrid       │
└──────────────────┘          │ • GCS            │
                              └──────────────────┘
```

### Database Schemas

| Schema | Tables | Purpose |
|--------|--------|---------|
| `core` | 5 | Cases, parties, users, docket events |
| `filing` | 3 | Filings, deficiencies, validation |
| `document` | 2 | Documents and versions |
| `scheduling` | 4 | Hearings, courtrooms, reporters |
| `judicial` | 2 | Bench memos, decision drafts |
| `identity` | 3 | Roles, permissions, sessions |
| `ai` | 2 | AI requests and results |
| `notification` | 2 | Notifications, service records |
| `reporting` | 2 | Materialized views |

---

## 🤖 Three-Agent Workflow

### Agent Roles

| Agent | Focus | Responsibilities |
|-------|-------|-----------------|
| **🤖 Qwen** | Database + Frontend | PostgreSQL schema, React components, UI implementation |
| **🔌 Aider** | Backend + AI | FastAPI services, Gemini integration, external APIs |
| **🧪 Copilot** | Testing + Deployment | Unit/E2E tests, CI/CD, Cloud Run deployment |

### Workflow

```
User Story → Qwen (DB/Frontend) → Aider (Backend/API) → Copilot (Tests/Deploy) → PR → Review → Merge → Deploy
```

See [`docs/THREE_AGENT_WORKFLOW.md`](docs/THREE_AGENT_WORKFLOW.md) for complete guide.

---

## 📋 Key Features

### Public E-Filing

- ✅ Landing page with role selection
- ✅ Google OAuth authentication
- ✅ Filing wizard (case type, party info)
- ✅ **Document upload with AI validation** ⭐
- ✅ Real-time feedback (score, deficiencies)
- ✅ Review & confirm screen
- ✅ Pay.gov integration
- ✅ Submission tracking dashboard

### Docket Clerk IACP

- ✅ Priority intake queue dashboard
- ✅ **Case Intelligence Hub (3-pane)** ⭐
- ✅ **Document viewer with versioning** ⭐
- ✅ Auto-docketing (AI score ≥ 90)
- ✅ Deficiency notice generation
- ✅ **Smart judge assignment** ⭐
- ✅ AI recommendations with explanations

### AI Features

- **Document Validation:** PII detection, signature verification, field extraction
- **Smart Assignment:** Judge scoring (workload 40%, geography 30%, expertise 20%, rotation 10%)
- **AI Insights:** Case summaries, recommendations, deficiency detection
- **Real-time Streaming:** SSE for live validation updates

---

## 🧪 Testing

### Test Strategy

| Test Type | Framework | Coverage Target |
|-----------|-----------|-----------------|
| Unit Tests (Frontend) | Vitest | 70%+ |
| Unit Tests (Backend) | Pytest | 80%+ |
| Integration Tests | Playwright | Critical paths |
| E2E Tests | Playwright | Full workflows |
| Accessibility Tests | axe-core | WCAG 2.1 AA |

### Run Tests

```bash
# Frontend tests
npm test
npm run test:coverage

# Backend tests
pytest backend/tests/
pytest backend/tests/ --cov=backend

# E2E tests
npx playwright test

# Accessibility tests
npx axe-cli http://localhost:3000
```

---

## 📦 Deployment

### Environments

| Environment | URL | Deployment |
|-------------|-----|------------|
| **Staging** | https://iacp-staging.a.run.app | Auto on merge to main |
| **Production** | https://iacp.dol.gov | Manual (workflow dispatch) |

### Deploy Commands

```bash
# Deploy to staging (automatic)
git push origin main

# Deploy to production (manual)
gh workflow run deploy-production.yml -f version=v1.0.0
```

### Monitor Deployment

```bash
# View workflow runs
gh run list

# View logs
gh run view <run-id> --log

# Check Cloud Run services
gcloud run services list
gcloud run services describe iacp-public-gateway --region=us-central1
```

---

## 📊 Success Metrics

### Development Metrics (Phase 1)

| Metric | Target | Status |
|--------|--------|--------|
| Story Points | 100% complete | - |
| Code Coverage | 80%+ | - |
| E2E Tests | 100% passing | - |
| Critical Bugs | 0 | - |

### User Experience Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Filing Time | < 10 min | Analytics |
| AI Validation Accuracy | > 90% | Manual review |
| Auto-Docket Rate | > 70% | Dashboard |
| Clerk Processing Time | < 2 min/case | Time study |

---

## 🗓️ Sprint Schedule

| Sprint | Dates | Focus | Goal |
|--------|-------|-------|------|
| **Sprint 0** | Week 1 | Foundation | Database + Infrastructure |
| **Sprint 1** | Week 2 | Public E-Filing | Landing + Auth + Wizard |
| **Sprint 2** | Week 3 | Public E-Filing | Upload + AI + Submission |
| **Sprint 3** | Week 4 | Docket Clerk | Dashboard + Case Hub |
| **Sprint 4** | Week 5 | Docket Clerk | Auto-docket + Assignment |

**Phase 1 Complete:** End of Week 5

---

## 🔗 Quick Links

### GitHub

- [Issues](https://github.com/[org]/IACP-3.0/issues)
- [Pull Requests](https://github.com/[org]/IACP-3.0/pulls)
- [Actions](https://github.com/[org]/IACP-3.0/actions)
- [Projects](https://github.com/[org]/IACP-3.0/projects)

### External

- **US Tax Court EFS Reference:** https://github.com/ustaxcourt/ef-cms
- **Google Gemini API:** https://ai.google.dev/api
- **Cloud Run Documentation:** https://cloud.google.com/run/docs
- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/

---

## 📞 Support

### Getting Help

- **Documentation:** Check [`docs/`](docs/) folder
- **Issues:** Create GitHub issue with appropriate template
- **Daily Standup:** Post in `#daily-standup` discussion
- **Blockers:** Tag with `blocked` label, mention all agents

### Contact

- **Qwen (Database/Frontend):** Assign `🎨 frontend` or `database` issues
- **Aider (Backend/AI):** Assign `🔌 backend` or `🤖 ai-ml` issues
- **Copilot (Testing/Deploy):** Assign `🧪 testing` or `📦 deployment` issues

---

## 📝 License

This project is developed for the U.S. Department of Labor.

---

**Last Updated:** March 22, 2026  
**Version:** 3.0  
**Phase:** 1 - Core Workflows
