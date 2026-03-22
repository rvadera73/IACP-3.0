# IACP 3.0 - Sprint 0 Issues (Foundation Week)

**Sprint Duration:** Week 1 (March 24-28, 2026)  
**Goal:** Set up database, backend, and CI/CD foundation

---

## How to Use This File

1. Copy each issue into GitHub as a separate issue
2. Assign to appropriate agent based on label
3. Add to Sprint 0 project board
4. Track progress in GitHub Projects

---

## Issue Templates

### 🎨 Frontend Issues (Qwen)
### 🔌 Backend Issues (Aider)  
### 🧪 Testing/Deployment Issues (Copilot)

---

## Sprint 0 Backlog

### Issue #1: Set up PostgreSQL Database Schema
**Labels:** `🎨 frontend` `database` `priority:P0` `sprint:0`  
**Assignee:** Qwen  
**Story Points:** 8

**User Story:**
As a developer, I want a complete PostgreSQL schema so that all services have a consistent data model.

**Acceptance Criteria:**
- [ ] Create `database/schema.sql` with all 9 schemas
- [ ] Implement all 25+ tables from data model
- [ ] Add indexes for performance
- [ ] Create utility functions (docket number generation, SLA calculation)
- [ ] Add materialized views for reporting
- [ ] Test schema locally with Docker PostgreSQL
- [ ] Document schema in `database/README.md`

**Tasks:**
- [ ] Create core schema (person, user, case, case_party, docket_event)
- [ ] Create filing schema (filing, deficiency, validation_result)
- [ ] Create document schema (document, document_version)
- [ ] Create scheduling schema (hearing, courtroom, court_reporter)
- [ ] Create judicial schema (bench_memo, decision_draft)
- [ ] Create identity schema (role, permission, session)
- [ ] Create ai schema (ai_request, ai_result)
- [ ] Create notification schema (notification, service_record)
- [ ] Create reporting schema (materialized views)
- [ ] Add all indexes and triggers
- [ ] Test migration locally

**Technical Notes:**
- Reference: `docs/DATA_MODEL.md` for entity definitions
- Use PostgreSQL 15 features
- Include comments on all tables/columns

---

### Issue #2: Create Alembic Migration System
**Labels:** `🎨 frontend` `database` `priority:P0` `sprint:0`  
**Assignee:** Qwen  
**Story Points:** 5

**User Story:**
As a developer, I want automated database migrations so that schema changes are tracked and reproducible.

**Acceptance Criteria:**
- [ ] Alembic configured in project
- [ ] Initial migration creates full schema
- [ ] Rollback script works
- [ ] Seed data migration created
- [ ] Documentation for migration commands

**Tasks:**
- [ ] Install Alembic and configure
- [ ] Create `alembic.ini` configuration
- [ ] Create initial migration from schema.sql
- [ ] Create seed data migration
- [ ] Test upgrade/downgrade
- [ ] Document in README

---

### Issue #3: Set up FastAPI Backend Structure
**Labels:** `🔌 backend` `priority:P0` `sprint:0`  
**Assignee:** Aider  
**Story Points:** 8

**User Story:**
As a developer, I want a well-organized backend structure so that services are modular and maintainable.

**Acceptance Criteria:**
- [ ] Create backend directory structure
- [ ] Set up 8 domain services (court-record, filing-review, etc.)
- [ ] Configure public and internal gateways
- [ ] Set up environment variable management
- [ ] Create health check endpoint
- [ ] Add OpenAPI documentation

**Directory Structure:**
```
backend/
├── services/
│   ├── court-record/
│   ├── filing-review/
│   ├── document-mgmt/
│   ├── scheduling/
│   ├── judicial-work/
│   ├── ai-engine/
│   ├── notification/
│   └── identity/
├── gateways/
│   ├── public-gateway/
│   └── internal-gateway/
├── tests/
├── requirements.txt
└── main.py
```

**Tasks:**
- [ ] Create directory structure
- [ ] Set up FastAPI app for each service
- [ ] Configure CORS
- [ ] Add health check endpoints
- [ ] Set up logging
- [ ] Create requirements.txt
- [ ] Test all services start successfully

---

### Issue #4: Implement Google OAuth 2.0
**Labels:** `🔌 backend` `auth` `priority:P0` `sprint:0`  
**Assignee:** Aider  
**Story Points:** 5

**User Story:**
As a user, I want to authenticate with Google OAuth so that I can access the system securely without creating new credentials.

**Acceptance Criteria:**
- [ ] Google OAuth 2.0 flow implemented
- [ ] JWT token generation
- [ ] Session management
- [ ] User creation on first login
- [ ] Role assignment
- [ ] Token refresh mechanism

**Tasks:**
- [ ] Set up Google Cloud OAuth credentials
- [ ] Implement OAuth 2.0 flow in identity service
- [ ] Create JWT token generation
- [ ] Add session endpoints (/login, /logout, /refresh)
- [ ] Create user record on first auth
- [ ] Add RBAC middleware
- [ ] Test OAuth flow end-to-end

---

### Issue #5: Set up CI/CD Pipeline
**Labels:** `🧪 testing` `📦 deployment` `priority:P0` `sprint:0`  
**Assignee:** Copilot  
**Story Points:** 8

**User Story:**
As a developer, I want automated CI/CD so that code is tested and deployed reliably.

**Acceptance Criteria:**
- [ ] GitHub Actions workflows created
- [ ] CI workflow runs tests on PR
- [ ] Staging deployment on merge to main
- [ ] Production deployment with manual approval
- [ ] Coverage reporting
- [ ] Security scanning

**Workflows to Create:**
- [ ] `.github/workflows/ci.yml` - Test & lint
- [ ] `.github/workflows/deploy-staging.yml` - Auto deploy
- [ ] `.github/workflows/deploy-production.yml` - Manual deploy

**Tasks:**
- [ ] Create CI workflow with test matrix
- [ ] Configure Cloud Run service accounts
- [ ] Set up GCP secrets in GitHub
- [ ] Create staging deployment workflow
- [ ] Create production deployment workflow
- [ ] Add coverage reporting
- [ ] Test all workflows
- [ ] Document deployment process

---

### Issue #6: Docker Containerization
**Labels:** `🧪 testing` `📦 deployment` `priority:P0` `sprint:0`  
**Assignee:** Copilot  
**Story Points:** 5

**User Story:**
As a DevOps engineer, I want Docker containers for all services so that deployment is consistent across environments.

**Acceptance Criteria:**
- [ ] Dockerfile for frontend
- [ ] Dockerfile for each backend service
- [ ] Docker Compose for local development
- [ ] Images build successfully
- [ ] Containers run locally
- [ ] Multi-stage builds for optimization

**Files to Create:**
- [ ] `Dockerfile.public` - Public gateway
- [ ] `Dockerfile.internal` - Internal gateway
- [ ] `backend/Dockerfile` - Backend services
- [ ] `docker-compose.yml` - Local development

**Tasks:**
- [ ] Create Dockerfiles
- [ ] Optimize with multi-stage builds
- [ ] Create docker-compose.yml
- [ ] Test local development setup
- [ ] Document Docker commands
- [ ] Push images to registry

---

### Issue #7: Create Seed Data for Development
**Labels:** `🎨 frontend` `database` `priority:P1` `sprint:0`  
**Assignee:** Qwen  
**Story Points:** 3

**User Story:**
As a developer, I want realistic test data so that I can develop and test features effectively.

**Acceptance Criteria:**
- [ ] 10+ sample persons (claimants, employers, attorneys)
- [ ] 5+ internal users (clerks, judges)
- [ ] 6+ sample cases across different phases
- [ ] Sample documents with metadata
- [ ] Sample hearings scheduled
- [ ] Docket events for each case

**Tasks:**
- [ ] Create INSERT statements for all tables
- [ ] Ensure referential integrity
- [ ] Add realistic data (names, addresses, case numbers)
- [ ] Test seed script runs without errors
- [ ] Document how to load seed data

---

### Issue #8: Write Initial Test Suite
**Labels:** `🧪 testing` `priority:P0` `sprint:0`  
**Assignee:** Copilot  
**Story Points:** 8

**User Story:**
As a developer, I want comprehensive tests so that I can catch bugs early and maintain code quality.

**Acceptance Criteria:**
- [ ] 80%+ backend code coverage
- [ ] 70%+ frontend code coverage
- [ ] Database migration tests
- [ ] API endpoint tests
- [ ] Component tests
- [ ] E2E test for critical path

**Test Files to Create:**
- [ ] `backend/tests/test_court_record.py`
- [ ] `backend/tests/test_filing_review.py`
- [ ] `backend/tests/test_identity.py`
- [ ] `src/tests/components/*.test.tsx`
- [ ] `tests/e2e/test_auth.py`
- [ ] `tests/e2e/test_filing.py`

**Tasks:**
- [ ] Set up pytest configuration
- [ ] Set up Vitest configuration
- [ ] Write backend unit tests
- [ ] Write frontend component tests
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Configure coverage reporting
- [ ] Add tests to CI pipeline

---

### Issue #9: Set up Google Cloud Run Services
**Labels:** `🧪 testing` `📦 deployment` `priority:P0` `sprint:0`  
**Assignee:** Copilot  
**Story Points:** 5

**User Story:**
As a DevOps engineer, I want Cloud Run services configured so that we can deploy to GCP.

**Acceptance Criteria:**
- [ ] Cloud Run services created (public, internal, backend)
- [ ] IAM service accounts configured
- [ ] Environment variables set up
- [ ] Health checks passing
- [ ] Auto-scaling configured
- [ ] Monitoring enabled

**Services to Create:**
- [ ] `iacp-public-gateway-staging`
- [ ] `iacp-internal-gateway-staging`
- [ ] `iacp-court-record-staging`

**Tasks:**
- [ ] Create GCP project (if needed)
- [ ] Enable required APIs
- [ ] Create service accounts
- [ ] Grant IAM permissions
- [ ] Create Cloud Run services
- [ ] Configure environment variables
- [ ] Set up Cloud Monitoring
- [ ] Document service URLs

---

### Issue #10: Create Issue Templates and Labels
**Labels:** `📝 documentation` `priority:P1` `sprint:0`  
**Assignee:** Qwen  
**Story Points:** 2

**User Story:**
As a contributor, I want clear issue templates so that I can create well-structured issues.

**Acceptance Criteria:**
- [ ] User story template created
- [ ] Bug report template created
- [ ] Feature request template created
- [ ] All labels created
- [ ] README updated with links

**Labels to Create:**
- `🎨 frontend`, `🔌 backend`, `🧪 testing`, `📦 deployment`
- `🤖 ai-ml`, `📝 documentation`, `database`
- `priority:P0`, `priority:P1`, `priority:P2`, `priority:P3`
- `epic:public-efiling`, `epic:docket-clerk`
- `sprint:0`, `sprint:1`, `sprint:2`

**Tasks:**
- [ ] Create `.github/ISSUE_TEMPLATE/user-story.md`
- [ ] Create `.github/ISSUE_TEMPLATE/bug-report.md`
- [ ] Create `.github/ISSUE_TEMPLATE/feature-request.md`
- [ ] Create all labels via GitHub API or manually
- [ ] Update README with label guide

---

## Sprint 0 Goal Completion

**Definition of Done:**
- [ ] All 10 issues completed
- [ ] Database schema deployed to staging
- [ ] Backend services running on Cloud Run
- [ ] CI/CD pipeline working
- [ ] Test coverage > 75%
- [ ] Local development environment working

**Sprint Review Demo:**
1. Show database schema in pgAdmin
2. Demonstrate OAuth login flow
3. Show CI/CD pipeline deploying to staging
4. Run test suite and show coverage report
5. Demonstrate local development with Docker Compose

---

**Total Story Points:** 57  
**Team Capacity:** Qwen (20), Aider (18), Copilot (19)
