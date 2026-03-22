# IACP 3.0 - Phase 1 Implementation Plan

**Version:** 1.0  
**Date:** March 22, 2026  
**Duration:** 5 Weeks (Sprint 0-4)  
**Team:** Three-Agent Workflow (Qwen, Aider, GitHub Copilot)

---

## Executive Summary

This document outlines the Phase 1 implementation plan for IACP 3.0, focusing on two core workflows:
1. **Public E-Filing Portal** - External users can file cases with AI validation
2. **Docket Clerk IACP** - Internal clerks can review, docket, and assign cases

Phase 1 establishes the foundation for all future development including judicial workspace, attorney-advisor tools, and appellate boards.

---

## Phase 1 Scope

### In Scope (Weeks 1-5)

**Public E-Filing:**
- Landing page with role selection
- Google OAuth authentication
- Filing wizard (case type selection)
- Party information forms
- Document upload with AI validation ⭐
- Review & confirm screen
- Submission confirmation & tracking

**Docket Clerk IACP:**
- Dashboard with priority intake queue
- Case Intelligence Hub (3-pane) ⭐
- Document viewer with versioning ⭐
- Auto-docketing workflow
- Deficiency notice generation
- Smart judge assignment ⭐

**Infrastructure:**
- PostgreSQL database schema
- FastAPI backend services
- Google Cloud Run deployment
- CI/CD pipeline (GitHub Actions)
- Test suite (80%+ coverage)

### Out of Scope (Phase 2+)

- Judicial workspace (bench memos, draft decisions)
- Attorney-advisor workspace
- Legal research tools
- Hearing scheduling (full implementation)
- Boards appellate workflows
- Mobile native apps
- Offline capabilities

---

## Sprint Breakdown

### Sprint 0: Foundation (Week 1)

**Goal:** Set up development environment and database schema

| Task | Owner | Deliverable |
|------|-------|-------------|
| Create GitHub repository | Qwen | Repo with issue templates |
| Set up PostgreSQL schema | Qwen | `database/schema.sql` complete |
| Create Alembic migrations | Qwen | Migration scripts working |
| Write seed data | Qwen | `seed_data.sql` with mock data |
| Set up FastAPI project structure | Aider | Backend service skeleton |
| Configure Google OAuth | Aider | OAuth flow working locally |
| Set up CI/CD pipeline | Copilot | GitHub Actions workflows |
| Configure Cloud Run | Copilot | Staging environment ready |
| Write database tests | Copilot | Migration tests passing |

**Sprint 0 Demo:**
- Database schema deployed to staging Cloud SQL
- Backend services running on Cloud Run
- CI/CD pipeline deploying on merge to main

---

### Sprint 1: Public E-Filing - Part 1 (Week 2)

**Goal:** Implement landing page, authentication, and filing wizard

| User Story | Owner | Tasks |
|------------|-------|-------|
| 1.1: Landing Page | Qwen | - Create `LandingPage.tsx`<br>- Add role selection cards<br>- Implement responsive layout |
| 1.2: Google OAuth | Aider | - Implement OAuth 2.0 flow<br>- Create JWT session management<br>- Add user creation endpoint |
| 1.3: Filing Wizard | Qwen | - Create `FilingWizard` component<br>- Add case type selection<br>- Implement draft auto-save |
| 1.4: Party Forms | Qwen + Aider | Qwen: Form components<br>Aider: Validation API |
| Tests | Copilot | - Unit tests for components<br>- Integration tests for OAuth<br>- E2E test for wizard flow |

**Sprint 1 Demo:**
- User can land on homepage
- User can authenticate with Google
- User can select filing type and enter party info
- Draft saved to database

---

### Sprint 2: Public E-Filing - Part 2 (Week 3)

**Goal:** Complete document upload with AI validation and submission

| User Story | Owner | Tasks |
|------------|-------|-------|
| 1.5: Document Upload + AI | Qwen + Aider | Qwen: Upload UI, AI panel<br>Aider: Gemini integration, SSE streaming |
| 1.6: Review & Confirm | Qwen | - Create summary view<br>- Add Pay.gov integration<br>- Implement e-signature |
| 1.7: Submission | Aider + Copilot | Aider: Submission API, email<br>Copilot: E2E tests |
| Tests | Copilot | - AI validation tests<br>- Payment flow tests<br>- Full e-filing E2E test |

**Sprint 2 Demo:**
- User can upload documents
- AI validates in real-time (score, deficiencies)
- User can review and submit
- Receives confirmation email with Intake ID

---

### Sprint 3: Docket Clerk IACP - Part 1 (Week 4)

**Goal:** Implement dashboard and Case Intelligence Hub

| User Story | Owner | Tasks |
|------------|-------|-------|
| 2.1: Dashboard | Qwen | - Create `DocketClerkDashboard`<br>- Implement intake queue table<br>- Add filters and search |
| 2.2: Case Intelligence Hub | Qwen | - Create 3-pane layout<br>- Implement Entity Navigator<br>- Create AI Insights panel |
| 2.3: Document Viewer | Qwen | - Integrate react-pdf<br>- Add version selector<br>- Implement zoom/pan |
| Backend APIs | Aider | - Create intake queue endpoint<br>- Create case details endpoint<br>- Create document version API |
| Tests | Copilot | - Dashboard load tests<br>- Component integration tests<br>- API tests |

**Sprint 3 Demo:**
- Clerk sees intake queue dashboard
- Click row to open Case Intelligence Hub
- View documents with version history
- See AI insights and recommendations

---

### Sprint 4: Docket Clerk IACP - Part 2 (Week 5)

**Goal:** Complete auto-docketing, deficiency notices, and smart assignment

| User Story | Owner | Tasks |
|------------|-------|-------|
| 2.4: Auto-Docketing | Qwen + Aider | Qwen: Modal UI<br>Aider: Auto-docket service |
| 2.5: Deficiency Notices | Qwen + Aider | Qwen: Notice modal<br>Aider: Email + PDF generation |
| 2.6: Smart Assignment | Qwen + Aider | Qwen: Assignment modal<br>Aider: Scoring algorithm |
| Tests | Copilot | - Auto-docket integration tests<br>- Smart assignment E2E<br>- Full clerk workflow E2E |

**Sprint 4 Demo:**
- Clerk clicks "Assign Docket #" → Case docketed
- Clerk clicks "Send Deficiency" → Email sent
- Clerk clicks "Assign Judge" → AI suggests Top 3
- Case assigned and appears in judge's queue

---

## Technical Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                          │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  Public Portal      │  │  Internal Portal    │              │
│  │                     │  │                     │              │
│  │ • LandingPage       │  │ • DocketClerkDash   │              │
│  │ • FilingWizard      │  │ • CaseIntelligence  │              │
│  │ • DocumentUpload    │  │ • DocumentViewer    │              │
│  │ • AIValidationPanel │  │ • SmartAssignModal  │              │
│  └──────────┬──────────┘  └──────────┬──────────┘              │
└─────────────┼─────────────────────────┼─────────────────────────┘
              │                         │
              ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateways (FastAPI)                         │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │  Public (8000)      │  │  Internal (8010)    │              │
│  │                     │  │                     │              │
│  │ • /api/v1/filings   │  │ • /api/v1/intake    │              │
│  │ • /api/v1/auth      │  │ • /api/v1/cases     │              │
│  │ • /api/v1/cases     │  │ • /api/v1/assign    │              │
│  └──────────┬──────────┘  └──────────┬──────────┘              │
└─────────────┼─────────────────────────┼─────────────────────────┘
              │                         │
              ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ court-record │  │ filing-review│  │ document-mgmt│         │
│  │ (8001)       │  │ (8002)       │  │ (8003)       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ ai-engine    │  │ notification │  │ identity     │         │
│  │ (8006)       │  │ (8007)       │  │ (8008)       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────┬─────────────────────────┬─────────────────────────┘
              │                         │
              ▼                         ▼
┌──────────────────┐          ┌──────────────────┐                │
│ PostgreSQL       │          │ Google Services  │                │
│ (Cloud SQL)      │          │                  │                │
│                  │          │ • Gemini API     │                │
│ • core schema    │          │ • OAuth 2.0      │                │
│ • filing schema  │          │ • SendGrid       │                │
│ • document schema│          │ • Pay.gov        │                │
│ • scheduling     │          │ • GCS            │                │
└──────────────────┘          └──────────────────┘                │
```

### Database Schema Summary

| Schema | Tables | Purpose |
|--------|--------|---------|
| `core` | 5 | Cases, parties, users, docket events |
| `filing` | 3 | Filings, deficiencies, validation results |
| `document` | 2 | Documents and versions |
| `scheduling` | 4 | Hearings, courtrooms, reporters |
| `identity` | 3 | Roles, permissions, sessions |

See `database/schema.sql` for complete schema.

---

## Agent Responsibilities

### 🤖 Qwen - Database + Frontend

**Sprint 0:**
- Create PostgreSQL schema
- Write Alembic migrations
- Set up seed data

**Sprint 1-2:**
- Landing page component
- Filing wizard components
- Party information forms
- Document upload component
- AI validation panel
- Review & confirm screen

**Sprint 3-4:**
- Docket clerk dashboard
- Case Intelligence Hub (3-pane)
- Document viewer with versioning
- Auto-docket modal
- Deficiency notice modal
- Smart assignment modal

**Total Story Points:** 40

---

### 🔌 Aider - Backend + AI Integration

**Sprint 0:**
- FastAPI project structure
- Google OAuth integration
- Service skeleton

**Sprint 1-2:**
- Authentication API
- Filing CRUD APIs
- Document upload API
- AI validation service (Gemini)
- Pay.gov integration
- SendGrid email integration

**Sprint 3-4:**
- Intake queue API
- Case details API
- Auto-docket service
- Deficiency notice service
- Smart assignment algorithm
- Judge assignment API

**Total Story Points:** 38

---

### 🧪 Copilot - Testing + Deployment

**Sprint 0:**
- CI/CD pipeline setup
- Cloud Run configuration
- Docker containerization

**Sprint 1-2:**
- Unit tests for frontend components
- Unit tests for backend services
- OAuth integration tests
- E2E test for e-filing flow

**Sprint 3-4:**
- Dashboard tests
- Case Intelligence Hub tests
- Auto-docket integration tests
- Smart assignment E2E
- Full clerk workflow E2E
- Production deployment

**Total Story Points:** 34

---

## Success Metrics

### Development Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Story Points Completed | 100% | - |
| Code Coverage | 80%+ | - |
| E2E Tests Passing | 100% | - |
| Deployment Success Rate | 95%+ | - |
| Critical Bugs (Production) | 0 | - |

### User Experience Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Filing Time (complete) | < 10 minutes | Analytics |
| AI Validation Accuracy | > 90% | Manual review |
| Auto-Docket Rate | > 70% | Dashboard |
| Clerk Processing Time | < 2 minutes/case | Time study |
| User Satisfaction | > 4.0/5.0 | Survey |

---

## Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI validation inaccurate | Medium | High | Human-in-the-loop review, confidence thresholds |
| Google OAuth delays | Low | High | Mock auth for development, fallback to email |
| Cloud Run cold starts | Medium | Medium | Set min-instances=1, optimize bundle size |
| Database performance | Low | Medium | Add indexes, query optimization, connection pooling |
| Accessibility non-compliance | Medium | High | Automated testing (axe), manual audit before launch |

---

## Communication Plan

### Daily Standup (Async)

**When:** 9:00 AM EST  
**Where:** GitHub Discussions `#daily-standup`

**Format:**
```
Yesterday:
- Completed task 1
- Completed task 2

Today:
- Working on task 3
- Working on task 4

Blockers:
- [None / Describe blocker]
```

### Sprint Ceremonies

**Sprint Planning:** Monday Week 1  
**Mid-Sprint Check-in:** Wednesday Week 2, 4  
**Sprint Review:** Friday Week 5  
**Retrospective:** Friday Week 5 PM

**Demo Schedule:**
- Sprint 0 Demo: Database + Infrastructure
- Sprint 1-2 Demo: Public E-Filing Complete
- Sprint 3-4 Demo: Docket Clerk IACP Complete
- Phase 1 Graduation: Full End-to-End Demo

---

## Definition of Done

**For User Stories:**
- [ ] Code implemented
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] Deployed to staging
- [ ] Product owner approved

**For Phase 1:**
- [ ] All user stories complete
- [ ] E2E tests passing (100% critical paths)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance tests passed (< 2s page load)
- [ ] Security scan passed (no high/critical issues)
- [ ] Production deployment successful
- [ ] User training completed

---

## Post-Phase 1 Roadmap

### Phase 2: Judicial Workspace (Weeks 6-10)
- Bench memorandum editor
- Draft decision editor
- Redline comparison tool
- Electronic signature
- Legal research integration

### Phase 3: Attorney-Advisor Tools (Weeks 11-14)
- Appellate brief review
- Citation checker
- Precedent search
- Template library

### Phase 4: Boards Appellate (Weeks 15-20)
- Board docket clerk workflow
- Board attorney-advisor tools
- Board member panel review
- Oral argument scheduling

### Phase 5: Enhanced Features (Weeks 21-24)
- Mobile responsiveness improvements
- Offline capabilities
- Advanced analytics
- Email/SMS notifications
- Calendar integration

---

## Appendix: Quick Start Commands

### Local Development

```bash
# Clone repository
git clone https://github.com/[org]/IACP-3.0.git
cd IACP-3.0

# Install dependencies
npm install
pip install -r backend/requirements.txt

# Start PostgreSQL (Docker)
docker-compose up -d postgres

# Run migrations
alembic upgrade head

# Seed data
psql -h localhost -U postgres -d iacp -f database/seed_data.sql

# Start frontend
npm run dev

# Start backend
python -m uvicorn backend.main:app --reload

# Run tests
npm test
pytest backend/tests/
```

### Deployment

```bash
# Deploy to staging (automatic on merge to main)
git push origin main

# Deploy to production (manual)
gh workflow run deploy-production.yml -f version=v1.0.0
```

---

**Document History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-22 | Initial Phase 1 plan |

**Next Steps:**
1. Review and approve plan
2. Create GitHub repository
3. Set up Sprint 0 issues
4. Begin development
