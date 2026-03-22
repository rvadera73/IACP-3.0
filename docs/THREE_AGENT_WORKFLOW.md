# IACP 3.0 - Three-Agent Development Workflow

**Version:** 1.0  
**Date:** March 22, 2026  
**Repository:** https://github.com/[org]/IACP-3.0

---

## Overview

This document defines the three-agent collaborative development workflow for IACP 3.0, leveraging the unique capabilities of each AI agent to maximize development efficiency.

---

## Agent Roles

### 🤖 Qwen - Full-Stack Developer (Database + Frontend)

**Primary Focus:** Database backend and frontend component implementation

**Strengths:**
- Comprehensive code generation from specifications
- Database schema design and optimization
- React component implementation
- UI/UX fidelity to design specs

**Responsibilities:**

1. **Database Implementation:**
   - Create PostgreSQL schema from `database/schema.sql`
   - Write Alembic migration scripts
   - Implement seed data scripts
   - Optimize queries with proper indexing
   - Create database utility functions

2. **Frontend Development:**
   - Build React components from `docs/UI_UX_DESIGN.md` specs
   - Implement 3-pane Case Intelligence Hub
   - Create document viewer with versioning
   - Build AI validation panel components
   - Implement smart assignment modal
   - Ensure WCAG 2.1 AA compliance
   - Mobile responsive design

3. **State Management:**
   - React Context for authentication
   - Component state management
   - API integration (React Query/SWR)
   - WebSocket/SSE for real-time AI updates

**Typical Issues:**
- `🎨 frontend` labeled
- `database` schema
- `component` implementation
- `ui-ux` implementation

---

### 🔌 Aider - API Integration Specialist (Backend + AI)

**Primary Focus:** Backend services, API endpoints, and AI integration

**Strengths:**
- API design and implementation
- Service integration (Google OAuth, SendGrid, Pay.gov)
- AI/ML model integration (Gemini API)
- Event-driven architecture

**Responsibilities:**

1. **Backend Services:**
   - Implement FastAPI services for each domain:
     - `court-record` (cases, parties, docket events)
     - `filing-review` (intake, validation, deficiencies)
     - `document-mgmt` (GCS storage, versioning)
     - `scheduling` (hearings, courtrooms, reporters)
     - `judicial-work` (bench memos, drafts)
     - `notification` (email, SMS, in-app)
     - `identity` (OAuth, JWT, RBAC)

2. **AI/ML Integration:**
   - Gemini API integration for:
     - Document validation (PII, signature detection)
     - Field extraction (claimant, employer, dates)
     - Smart assignment algorithm
     - AI insight generation
   - Implement streaming responses (SSE/WebSocket)
   - AI confidence scoring

3. **External Service Integration:**
   - Google OAuth 2.0 authentication
   - SendGrid email delivery
   - Pay.gov payment processing
   - Google Cloud Storage (GCS)
   - Google Pub/Sub event bus

4. **API Design:**
   - RESTful endpoint design
   - OpenAPI/Swagger documentation
   - Request/response validation
   - Error handling
   - Rate limiting

**Typical Issues:**
- `🔌 backend` labeled
- `🤖 ai-ml` labeled
- `api` implementation
- `integration` tasks

---

### 🧪 GitHub Copilot - Quality Engineer (Testing + Deployment)

**Primary Focus:** Test coverage, CI/CD, and cloud deployment

**Strengths:**
- Test generation from code
- CI/CD pipeline configuration
- Cloud deployment automation
- Code quality analysis

**Responsibilities:**

1. **Testing:**
   - **Unit Tests:**
     - Pytest for backend services
     - Vitest for React components
     - 80%+ code coverage target
   - **Integration Tests:**
     - API endpoint testing
     - Database integration testing
     - Service integration testing
   - **E2E Tests:**
     - Playwright for critical user flows
     - Public e-filing flow
     - Docket clerk workflow
     - Authentication flows

2. **CI/CD:**
   - GitHub Actions workflows:
     - `ci.yml` - Run tests on PR
     - `deploy-staging.yml` - Auto-deploy to staging
     - `deploy-production.yml` - Manual production deploy
   - Automated code quality checks:
     - Linting (ESLint, Black, Flake8)
     - Type checking (TypeScript, MyPy)
     - Security scanning (Dependabot, CodeQL)

3. **Cloud Deployment:**
   - Docker containerization
   - Google Cloud Run deployment
   - Environment configuration
   - Secret management (GCP Secret Manager)
   - Health check configuration
   - Auto-scaling setup
   - Monitoring and logging

4. **Documentation:**
   - Auto-generate API docs from OpenAPI
   - Update README with deployment instructions
   - Maintain CHANGELOG.md

**Typical Issues:**
- `🧪 testing` labeled
- `📦 deployment` labeled
- `ci-cd` configuration
- `infrastructure` tasks

---

## Development Workflow

### Sprint Planning

**Duration:** 2-week sprints

**Day 1 - Sprint Planning:**
1. Review prioritized user stories from `docs/USER_STORIES.md`
2. Break down stories into tasks
3. Assign tasks to agents based on labels
4. Estimate effort (story points)
5. Create GitHub issues for each story

**Task Assignment Matrix:**

| Story Type | Qwen | Aider | Copilot |
|------------|------|-------|---------|
| Public E-Filing | Frontend components, DB schema | APIs, AI validation, OAuth | Tests, deployment |
| Docket Clerk IACP | Case Hub, doc viewer | Assignment algo, notifications | E2E tests |
| Infrastructure | - | API gateway setup | CI/CD, Cloud Run |
| Testing | Component tests | API tests | E2E, coverage |

---

### Daily Workflow

**Morning (Async Standup via GitHub):**

Each agent posts updates in `#daily-standup` channel:

```
🤖 Qwen - Yesterday:
✅ Implemented DocumentViewer component
✅ Created PostgreSQL schema for document table
🔄 Today:
📋 Building AIValidationPanel component
📋 Adding version comparison UI
🚧 Blockers: None

🔌 Aider - Yesterday:
✅ Implemented filing validation API
✅ Integrated Gemini API for PII detection
🔄 Today:
📋 Building smart assignment algorithm
📋 Setting up Google OAuth flow
🚧 Blockers: Waiting on API credentials

🧪 Copilot - Yesterday:
✅ Wrote unit tests for filing service (85% coverage)
✅ Created GitHub Actions workflow
🔄 Today:
📋 Setting up Playwright E2E tests
📋 Configuring Cloud Run deployment
🚧 Blockers: None
```

**During Development:**

1. **Pull Requests:**
   - Create PR for each issue
   - Link issue in PR description
   - Request review from other agents
   - Automated checks must pass

2. **Code Review:**
   - At least 1 agent must approve
   - Address all review comments
   - Re-run tests after changes

3. **Merging:**
   - Squash and merge to main
   - Auto-deploy to staging
   - Manual approval for production

---

### Collaboration Patterns

#### Pattern 1: Feature Development

```
┌─────────────────────────────────────────────────────────────┐
│  Feature: AI Validation Panel                                │
├─────────────────────────────────────────────────────────────┤
│  Day 1-2: Qwen                                              │
│  ├── Create AIValidationPanel.tsx component                 │
│  ├── Implement score gauge visualization                    │
│  └── Add deficiency list UI                                 │
│                                                             │
│  Day 3-4: Aider                                             │
│  ├── Create /api/v1/ai/validate-filing endpoint             │
│  ├── Integrate Gemini API for document analysis             │
│  └── Implement SSE streaming for real-time updates          │
│                                                             │
│  Day 5: Copilot                                             │
│  ├── Write unit tests for validation service                │
│  ├── Write integration tests for API endpoint               │
│  └── Add E2E test for upload + validation flow              │
│                                                             │
│  Day 6-7: Integration                                       │
│  ├── Qwen: Connect frontend to API                          │
│  ├── Aider: Fix API issues from integration                 │
│  └── Copilot: Verify tests pass, deploy to staging          │
└─────────────────────────────────────────────────────────────┘
```

#### Pattern 2: Database-First Development

```
┌─────────────────────────────────────────────────────────────┐
│  Feature: Case Management Schema                             │
├─────────────────────────────────────────────────────────────┤
│  Step 1: Qwen                                               │
│  ├── Design database schema (schema.sql)                    │
│  ├── Create Alembic migration                               │
│  └── Write seed data script                                 │
│                                                             │
│  Step 2: Aider                                              │
│  ├── Create SQLAlchemy models from schema                   │
│  ├── Implement repository pattern                           │
│  └── Create CRUD API endpoints                              │
│                                                             │
│  Step 3: Qwen                                               │
│  ├── Build React components using new API                   │
│  └── Implement state management                             │
│                                                             │
│  Step 4: Copilot                                            │
│  ├── Write database migration tests                         │
│  ├── Write API integration tests                            │
│  └── Test rollback procedures                               │
└─────────────────────────────────────────────────────────────┘
```

#### Pattern 3: Test-Driven Development

```
┌─────────────────────────────────────────────────────────────┐
│  Feature: Smart Assignment Algorithm                         │
├─────────────────────────────────────────────────────────────┤
│  Step 1: Copilot (Test First)                               │
│  ├── Write test cases for algorithm                         │
│  │   ├── Test workload scoring                              │
│  │   ├── Test geography matching                            │
│  │   └── Test expertise matching                            │
│  └── Define expected outputs                                │
│                                                             │
│  Step 2: Aider (Implementation)                             │
│  ├── Implement judge scoring algorithm                      │
│  ├── Run tests (fail initially)                             │
│  ├── Refactor until tests pass                              │
│  └── Achieve 90%+ coverage                                  │
│                                                             │
│  Step 3: Qwen (Integration)                                 │
│  ├── Build SmartAssignmentModal component                   │
│  ├── Connect to algorithm API                               │
│  └── Visualize score breakdown                              │
│                                                             │
│  Step 4: Copilot (E2E)                                      │
│  ├── Write E2E test for assignment flow                     │
│  └── Verify end-to-end functionality                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Communication Protocol

### GitHub Issues

**Issue Creation:**
- Use issue templates (`.github/ISSUE_TEMPLATE/`)
- Assign appropriate labels
- Mention relevant agents in comments

**Issue Updates:**
- Comment progress updates
- Tag blockers with `blocked` label
- Link related PRs

### Pull Requests

**PR Template:**
```markdown
## Description
<!-- Describe the changes in this PR -->

## Related Issue
<!-- Link the issue this PR closes -->
Closes #XXX

## Type of Change
- [ ] 🎨 Frontend component
- [ ] 🔌 Backend API
- [ ] 🤖 AI integration
- [ ] 🧪 Tests
- [ ] 📦 Deployment

## Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if UI change)
<!-- Before/after screenshots -->

## Deployment Notes
<!-- Any special deployment considerations -->
```

**Review Process:**
1. Automated checks must pass
2. At least 1 agent approval required
3. Address all review comments
4. Squash and merge

### Emergency Communication

For urgent blockers (>4 hours):
- Create GitHub issue with `blocked` label
- Mention all agents in comment
- Schedule impromptu sync call

---

## Quality Standards

### Code Quality

**Frontend (Qwen):**
- TypeScript strict mode
- ESLint rules enforced
- Prettier formatting
- Component documentation (JSDoc)
- Accessibility (ARIA labels)

**Backend (Aider):**
- Type hints (Python 3.11+)
- Black formatting
- Flake8 linting
- API documentation (OpenAPI)
- Error handling

**Tests (Copilot):**
- 80%+ code coverage
- Meaningful test names
- Arrange-Act-Assert pattern
- Test isolation (no shared state)

### Documentation

**Required Documentation:**
- README.md (setup instructions)
- API documentation (auto-generated)
- Component documentation (Storybook)
- Database schema documentation
- Deployment guide

**Documentation Reviews:**
- Copilot verifies docs are updated
- Missing docs block merge

---

## Metrics & Reporting

### Sprint Metrics

Tracked automatically via GitHub:

| Metric | Target | Owner |
|--------|--------|-------|
| Story Points Completed | 100% planned | All |
| Code Coverage | 80%+ | Copilot |
| PR Review Time | < 4 hours | All |
| Deployment Success Rate | 95%+ | Copilot |
| Bug Count (Production) | 0 critical | All |

### Velocity Tracking

- Story points per sprint
- Burndown charts
- Cumulative flow diagram

### Quality Metrics

- Test coverage trend
- Bug escape rate
- Code review comments per PR
- Accessibility score (Lighthouse)

---

## Tooling Setup

### Development Tools

**Qwen:**
- VS Code with React extensions
- PostgreSQL client (DBeaver, pgAdmin)
- Figma (for design reference)

**Aider:**
- VS Code with Python extensions
- Postman (API testing)
- Gemini API console

**Copilot:**
- VS Code with testing extensions
- Playwright test runner
- GCP Console

### Shared Tools

- GitHub Projects (sprint planning)
- GitHub Actions (CI/CD)
- Docker Compose (local development)
- Google Cloud Run (deployment)

---

## Getting Started

### For Qwen

1. Clone repository
2. Install dependencies: `npm install`
3. Set up local PostgreSQL
4. Run migrations: `alembic upgrade head`
5. Start dev server: `npm run dev`

### For Aider

1. Clone repository
2. Install Python dependencies: `pip install -r requirements.txt`
3. Set up environment variables (`.env`)
4. Start backend services: `python -m uvicorn backend.main:app --reload`

### For Copilot

1. Clone repository
2. Install testing dependencies: `npm install --save-dev @playwright/test`
3. Configure GCP credentials
4. Run tests: `npm test`

---

## Continuous Improvement

### Retrospective (End of Each Sprint)

**Attendees:** All agents

**Format:**
1. What went well?
2. What could be improved?
3. Action items for next sprint

**Output:**
- 1-3 process improvements
- Updated workflow document

### Knowledge Sharing

- Weekly tech talks (rotating presenter)
- Shared documentation
- Code review learnings

---

**Version History:**
- v1.0 (2026-03-22): Initial workflow definition
