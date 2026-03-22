# IACP 3.0 - User Stories & Acceptance Criteria

**Version:** 3.0  
**Date:** March 22, 2026  
**Phase:** 1 - Public E-Filing + Docket Clerk IACP  
**Repository:** https://github.com/[org]/IACP-3.0

---

## How to Use This Document

Each epic contains user stories formatted as GitHub issues. Copy each story into a separate GitHub issue with the corresponding label.

**Labels:**
- `🎨 frontend` - UI components, pages, styling
- `🔌 backend` - API endpoints, database, services
- `🤖 ai-ml` - AI validation, scoring, recommendations
- `🧪 testing` - Unit tests, integration tests, E2E tests
- `📦 deployment` - CI/CD, Cloud Run, infrastructure
- `📝 documentation` - README, API docs, user guides
- `priority:P0` - Critical for Phase 1
- `priority:P1` - Important but can defer
- `epic:public-efiling` - Public portal stories
- `epic:docket-clerk` - Docket clerk stories

---

## Epic 1: Public E-Filing Portal

### Story 1.1: Landing Page with Role Selection
**Label:** `frontend` `priority:P0` `epic:public-efiling`

**User Story:**
As a first-time visitor, I want to understand what IACP is and select my user type so that I can access the appropriate portal.

**Acceptance Criteria:**
- [ ] Landing page displays IACP branding and DOL seal
- [ ] Three role options visible: "File a Case", "Check Case Status", "IACP Staff Login"
- [ ] Each option has description and icon
- [ ] Clicking "File a Case" navigates to Google OAuth flow
- [ ] Clicking "Check Case Status" opens public search (no auth required)
- [ ] Clicking "Staff Login" navigates to internal portal
- [ ] Page loads in < 2 seconds
- [ ] Mobile responsive (stacks vertically on mobile)
- [ ] WCAG 2.1 AA compliant (color contrast, keyboard navigation)

**Tasks:**
- Frontend: Create `LandingPage.tsx` component
- Frontend: Add role selection cards with icons
- Backend: Configure Google OAuth redirect URIs
- Testing: Add E2E test for landing page navigation

---

### Story 1.2: Google OAuth Authentication
**Label:** `backend` `frontend` `priority:P0` `epic:public-efiling`

**User Story:**
As a filer, I want to authenticate securely using Google OAuth so that I can access my filings without creating a new password.

**Acceptance Criteria:**
- [ ] "Sign in with Google" button visible on login page
- [ ] OAuth flow redirects to Google, then back to IACP
- [ ] Successful login creates/updates user record in database
- [ ] User session stored with JWT token
- [ ] Token expires after 24 hours of inactivity
- [ ] User redirected to dashboard after login
- [ ] Error handling for failed authentication
- [ ] "Remember me" option (extends session to 7 days)

**Tasks:**
- Backend: Implement Google OAuth 2.0 in `identity` service
- Backend: Create JWT session management
- Frontend: Add login page with Google button
- Database: Add `identity.session` table
- Testing: Add unit tests for OAuth flow
- Security: Implement rate limiting (5 attempts/hour)

---

### Story 1.3: Filing Type Selection Wizard
**Label:** `frontend` `priority:P0` `epic:public-efiling`

**User Story:**
As a filer, I want to select the correct filing type so that my submission is routed properly.

**Acceptance Criteria:**
- [ ] Wizard shows 3 options: "New Case", "Motion in Existing Case", "Notice of Appearance"
- [ ] Each option shows description and required documents
- [ ] "New Case" shows sub-options: BLA, LHC, PER
- [ ] Each case type has tooltip with description
- [ ] Selection is saved to filing draft
- [ ] Progress indicator shows "Step 1 of 4"
- [ ] Can navigate back/forward in wizard
- [ ] Draft auto-saves every 30 seconds

**Tasks:**
- Frontend: Create `FilingWizard` component
- Frontend: Add case type selection cards
- Backend: Create draft filing endpoint
- Testing: Add unit tests for wizard navigation

---

### Story 1.4: Party Information Forms
**Label:** `frontend` `backend` `priority:P0` `epic:public-efiling`

**User Story:**
As a filer, I want to enter party information so that the case record is complete.

**Acceptance Criteria:**
- [ ] Form fields for claimant: name, SSN, DOB, address, phone, email
- [ ] Form fields for employer: name, EIN, address
- [ ] SSN field masks input (***-**-****)
- [ ] Address autocomplete via Google Places API
- [ ] Phone number auto-formatting
- [ ] Email validation (regex pattern)
- [ ] Required field indicators (red asterisk)
- [ ] Inline validation on blur
- [ ] Error messages clearly identify field and issue
- [ ] "Represented by attorney" checkbox
- [ ] If represented, show attorney info fields

**Tasks:**
- Frontend: Create `PartyInformationForm` component
- Frontend: Add form validation with react-hook-form
- Backend: Create party validation endpoint
- Backend: Add address autocomplete API
- Testing: Add form validation tests
- Accessibility: Add ARIA labels to all fields

---

### Story 1.5: Document Upload with AI Validation ⭐
**Label:** `frontend` `backend` `ai-ml` `priority:P0` `epic:public-efiling`

**User Story:**
As a filer, I want real-time feedback on my uploaded documents so that I can fix issues before submission.

**Acceptance Criteria:**
- [ ] Drag-and-drop upload zone (max 50MB per file)
- [ ] Multi-file upload support
- [ ] File type validation (PDF, DOC, DOCX, JPG, PNG)
- [ ] Upload progress indicator
- [ ] **AI Validation Panel** shows:
  - Overall score (0-100) with color coding
  - SSN detection status (detected/verified/redacted)
  - Signature detection (found/not found, page number)
  - Required field extraction (claimant, employer, date)
  - PII detection warnings
- [ ] Real-time updates as AI processes (streaming)
- [ ] Deficiency list with "Fix" and "Ignore" buttons
- [ ] Clicking "Fix" scrolls to relevant form section
- [ ] Document preview thumbnail
- [ ] Re-upload option for corrected documents

**AI Integration:**
```python
# Backend calls AI service
POST /api/v1/ai/validate-filing
{
  "document_text": "...",
  "fields": ["ssn", "signature", "dateOfInjury", "claimantName"]
}

# Response
{
  "ai_score": 98,
  "detected_elements": {
    "ssn": {"detected": true, "verified": true},
    "signature": {"detected": true, "page": 3, "confidence": 0.95}
  },
  "deficiencies": []
}
```

**Tasks:**
- Frontend: Create `DocumentUpload` component with drag-drop
- Frontend: Create `AIValidationPanel` component
- Backend: Implement file upload to GCS
- AI/ML: Create filing validation service (Gemini API)
- Backend: Stream AI results via WebSocket/SSE
- Testing: Add AI validation integration tests

---

### Story 1.6: Review & Confirm Screen
**Label:** `frontend` `priority:P1` `epic:public-efiling`

**User Story:**
As a filer, I want to review all information before submission so that I can ensure accuracy.

**Acceptance Criteria:**
- [ ] Summary of all entered data in read-only format
- [ ] Expandable sections: Party Info, Documents, Filing Details
- [ ] AI-extracted metadata displayed for verification
- [ ] "I certify this information is true" checkbox
- [ ] Electronic signature field (type full name)
- [ ] Filing fee calculation and display
- [ ] Pay.gov integration for payment
- [ ] Fee waiver request option
- [ ] "Submit" button disabled until all requirements met

**Tasks:**
- Frontend: Create `ReviewConfirm` component
- Frontend: Integrate Pay.gov redirect
- Backend: Calculate filing fees
- Testing: Add payment flow tests

---

### Story 1.7: Submission Confirmation & Tracking
**Label:** `frontend` `backend` `priority:P1` `epic:public-efiling`

**User Story:**
As a filer, I want confirmation of submission and tracking so that I know my filing was received.

**Acceptance Criteria:**
- [ ] Confirmation page displays immediately after submission
- [ ] Intake ID prominently displayed (e.g., "INT-2026-00089")
- [ ] Confirmation email sent to filer
- [ ] Email includes intake ID and filing summary
- [ ] "Track Status" button links to dashboard
- [ ] Dashboard shows filing status timeline:
  - Submitted → AI Validation → Clerk Review → Docketed/Deficient
- [ ] SMS notifications option (opt-in)
- [ ] Download confirmation PDF option

**Tasks:**
- Backend: Generate intake ID (format: INT-YYYY-NNNNN)
- Backend: Send confirmation email via SendGrid
- Frontend: Create confirmation page
- Frontend: Create filing status dashboard
- Backend: Create status tracking endpoint

---

## Epic 2: Docket Clerk IACP

### Story 2.1: Dashboard with Priority Intake Queue
**Label:** `frontend` `backend` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want to see all pending filings sorted by priority so that I can process the most urgent first.

**Acceptance Criteria:**
- [ ] Dashboard shows "Priority Intake Queue" table
- [ ] Table columns: Intake ID, Case Type, Claimant, Employer, Filed Date, AI Score, Status, Actions
- [ ] Rows color-coded by AI score:
  - Green (90-100): Auto-docket ready
  - Yellow (70-89): Manual review
  - Red (<70): Deficient
- [ ] Filter controls: Case type, filing channel, date range, status
- [ ] Search by intake ID, claimant name, employer name
- [ ] Sort by any column (click header)
- [ ] Bulk actions: Select multiple, "Docket Selected"
- [ ] Stats cards at top: Total, Auto-Docket Ready, Manual Review, Deficient
- [ ] Click row opens Case Intelligence Hub

**Backend Query:**
```sql
SELECT 
  f.intake_id, c.case_type, f.extracted_metadata->>'claimantName' as claimant,
  f.extracted_metadata->>'employerName' as employer, f.submitted_at,
  vr.ai_score, f.status
FROM filing.filing f
LEFT JOIN filing.validation_result vr ON f.id = vr.filing_id
LEFT JOIN core.case c ON f.case_id = c.id
WHERE f.status IN ('pending', 'accepted', 'deficient')
ORDER BY 
  CASE WHEN vr.ai_score >= 90 THEN 1
       WHEN vr.ai_score >= 70 THEN 2
       ELSE 3 END,
  f.submitted_at DESC;
```

**Tasks:**
- Frontend: Create `DocketClerkDashboard` component
- Frontend: Create `IntakeQueueTable` component
- Backend: Create intake queue endpoint with filters
- Backend: Add AI score to validation_result table
- Testing: Add dashboard load tests

---

### Story 2.2: Case Intelligence Hub (3-Pane) ⭐
**Label:** `frontend` `backend` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want all case information in one view so that I can make informed decisions without navigating between screens.

**Acceptance Criteria:**
- **Left Pane (Entity Navigator):**
  - [ ] Parties section with expandable details
  - [ ] Representatives section (attorneys)
  - [ ] Organizations section
  - [ ] Click party shows full details in modal
  - [ ] "Add Party" button (for amendments)

- **Center Pane (Workspace):**
  - [ ] Tabbed interface: Docket | Documents | Hearings | Motions
  - [ ] Docket tab: Chronological event list
  - [ ] Documents tab: Document list with thumbnails
  - [ ] Click document opens viewer
  - [ ] Hearings tab: Scheduled hearings list
  - [ ] Motions tab: Pending motions with status

- **Right Pane (AI Insights):**
  - [ ] Validation score gauge (0-100)
  - [ ] Detected fields checklist
  - [ ] Deficiency list (if any)
  - [ ] AI recommendations: "Auto-docket ready", "Assign to Hon. X"
  - [ ] Quick actions: "Docket Case", "Send Deficiency"

- **General:**
  - [ ] Pane widths adjustable (drag dividers)
  - [ ] Collapse/expand individual panes
  - [ ] Responsive: Stack on mobile, 2-pane on tablet
  - [ ] Keyboard shortcuts (Cmd/Ctrl+1/2/3 for tabs)

**Tasks:**
- Frontend: Create `CaseIntelligenceHub` component
- Frontend: Create `EntityNavigator` component
- Frontend: Create `AIInsightsPanel` component
- Backend: Create case details endpoint (aggregates all data)
- Testing: Add component integration tests

---

### Story 2.3: Document Viewer with Versioning ⭐
**Label:** `frontend` `backend` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want to view documents with version history so that I can track changes and access previous versions.

**Acceptance Criteria:**
- [ ] PDF viewer embedded (react-pdf)
- [ ] Zoom controls (50%, 75%, 100%, 125%, 150%, 200%)
- [ ] Page navigation (previous/next, page input)
- [ ] Full-screen mode
- [ ] Download button (original file)
- [ ] Print button
- [ ] Version selector dropdown (v1, v2, v3)
- [ ] "Compare Versions" mode (side-by-side diff)
- [ ] Version metadata: created date, author, change note
- [ ] Highlight AI-detected fields (SSN, signature, dates)
- [ ] Redaction tool (for PII before public release)
- [ ] Annotation tool (clerk notes, not saved to document)

**Version Comparison:**
- [ ] Side-by-side view with redline/greenline
- [ ] Deleted text shown in red strikethrough
- [ ] Added text shown in green underline
- [ ] Change summary (e.g., "3 additions, 1 deletion")
- [ ] Download comparison PDF

**Tasks:**
- Frontend: Create `DocumentViewer` component
- Frontend: Integrate react-pdf library
- Frontend: Create version comparison UI
- Backend: Create document version endpoint
- Backend: Implement PDF redaction service
- Testing: Add viewer interaction tests

---

### Story 2.4: Auto-Docketing Workflow
**Label:** `frontend` `backend` `ai-ml` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want to docket complete filings with one click so that I can process cases quickly.

**Acceptance Criteria:**
- [ ] "Assign Docket #" button visible for AI score ≥ 90
- [ ] Clicking shows confirmation modal:
  - "AI Validation Score: 98/100"
  - "No deficiencies detected"
  - "Recommended docket number: 2026-BLA-00011"
- [ ] Modal shows extracted metadata for verification:
  - Claimant name
  - Employer name
  - Case type
  - Date of injury
- [ ] "Confirm & Docket" button
- [ ] Processing overlay: "Running AI validation... Creating docket number..."
- [ ] Success message: "✅ Successfully docketed as 2026-BLA-00011"
- [ ] Case moves to "Awaiting Assignment" queue
- [ ] Docket event created: CASE_DOCKETED
- [ ] Email notification to filer: "Your filing has been docketed"

**Backend Process:**
```python
# Auto-docket service
async def auto_docket(filing_id: UUID) -> DocketResult:
    # 1. Verify AI score >= 90
    # 2. Generate docket number
    # 3. Create case record
    # 4. Create docket events
    # 5. Update filing status
    # 6. Send notification
    # 7. Return docket number
```

**Tasks:**
- Frontend: Create `AutoDocketModal` component
- Backend: Implement auto-docket service
- Backend: Create docket number generation function
- Database: Add docket_event trigger
- Testing: Add auto-docket integration tests

---

### Story 2.5: Deficiency Notice Generation
**Label:** `frontend` `backend` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want to send deficiency notices so that filers can correct incomplete submissions.

**Acceptance Criteria:**
- [ ] "Send Deficiency Notice" button for AI score < 90
- [ ] Modal shows AI-detected deficiencies:
  - Missing Signature (critical)
  - Illegible SSN (critical)
  - Missing Employer EIN (warning)
- [ ] Clerk can add custom deficiencies
- [ ] Severity selector: Critical / Warning
- [ ] Deadline auto-calculated (14 days from today)
- [ ] Notice preview shows full text
- [ ] Template variables auto-filled:
  - Claimant name
  - Case type
  - Deficiency list
  - Deadline date
- [ ] "Send Notice" button
- [ ] Email sent to filer with PDF attachment
- [ ] Filing status changed to "Deficiency Notice Sent"
- [ ] Deadline tracked in system

**Notice Template:**
```
NOTICE OF DEFICIENCY

Date: [Current Date]
To: [Claimant Name]
Re: Filing ID [INT-YYYY-NNNNN]

Dear [Claimant Name],

Your filing has been reviewed and the following deficiencies were found:

1. [Deficiency Type]: [Description] (Critical)
2. [Deficiency Type]: [Description] (Warning)

Please correct these deficiencies and resubmit by [Deadline Date].

Failure to do so may result in dismissal of your claim.

Office of Administrative Law Judges
U.S. Department of Labor
```

**Tasks:**
- Frontend: Create `DeficiencyNoticeModal` component
- Backend: Create deficiency notice template service
- Backend: Integrate SendGrid for email
- Backend: Create PDF generation for notice
- Testing: Add email delivery tests

---

### Story 2.6: Smart Judge Assignment ⭐
**Label:** `frontend` `backend` `ai-ml` `priority:P0` `epic:docket-clerk`

**User Story:**
As a docket clerk, I want AI-suggested judge assignments so that I can balance workloads and leverage expertise.

**Acceptance Criteria:**
- [ ] "Assign Judge" button in Case Intelligence Hub
- [ ] Modal shows Top 3 judge suggestions
- [ ] Each suggestion displays:
  - Judge name and office
  - Overall score (e.g., "92/100")
  - Workload score (40%): "58/75 cases (Low)"
  - Geography score (30%): "Same office (Pittsburgh)"
  - Expertise score (20%): "BLA specialist"
  - Rotation score (10%): "Last assigned 5 days ago"
  - Visual progress bars for each component
  - AI reasons (bulleted list)
- [ ] #1 recommendation highlighted
- [ ] "Assign to [Judge]" button for each
- [ ] "Override AI" option with reason dropdown:
  - "Judge recusal"
  - "Geographic preference"
  - "Case complexity"
  - "Other (specify)"
- [ ] Confirmation modal before assignment
- [ ] Processing message: "Assigning case to Hon. S. Jenkins..."
- [ ] Success: "Case assigned to Hon. S. Jenkins"
- [ ] Email notification to judge chambers
- [ ] Case appears in judge's "My Assigned Cases"

**AI Assignment Algorithm:**
```python
def calculate_judge_score(judge, case_type, office):
    workload_score = (1 - judge.active_cases / judge.capacity) * 40
    geography_score = 30 if judge.office == office else 0
    expertise_score = 20 if case_type in judge.specialty else 10
    rotation_score = min(10, days_since_last_assignment / 3)
    
    return {
        'total': workload_score + geography_score + expertise_score + rotation_score,
        'breakdown': {
            'workload': workload_score,
            'geography': geography_score,
            'expertise': expertise_score,
            'rotation': rotation_score
        }
    }
```

**Tasks:**
- Frontend: Create `SmartAssignmentModal` component
- Backend: Implement judge scoring algorithm
- Backend: Create judge availability endpoint
- AI/ML: Generate AI reasons for each suggestion
- Testing: Add algorithm unit tests
- Testing: Add E2E assignment flow test

---

## Epic 3: Infrastructure & DevOps

### Story 3.1: Database Schema Migration
**Label:** `backend` `priority:P0`

**User Story:**
As a developer, I want automated database migrations so that schema changes are tracked and reproducible.

**Acceptance Criteria:**
- [ ] Alembic configured for migration management
- [ ] Initial migration creates all schemas (core, filing, document, etc.)
- [ ] Migration scripts versioned in Git
- [ ] Rollback scripts for each migration
- [ ] Seed data script for development
- [ ] Migration command: `alembic upgrade head`
- [ ] Rollback command: `alembic downgrade -1`
- [ ] CI/CD runs migrations on deploy

**Tasks:**
- Backend: Set up Alembic configuration
- Backend: Create initial migration from schema.sql
- Backend: Create seed data migration
- DevOps: Add migration step to CI/CD pipeline

---

### Story 3.2: API Gateway Setup
**Label:** `backend` `priority:P0`

**User Story:**
As a developer, I want separate public and internal API gateways so that we can enforce different security policies.

**Acceptance Criteria:**
- [ ] Public gateway (port 8000) handles external traffic
- [ ] Internal gateway (port 8010) handles internal traffic
- [ ] Rate limiting on public gateway (100 req/min per IP)
- [ ] CORS configured for public gateway
- [ ] Internal gateway requires valid JWT
- [ ] API documentation (OpenAPI/Swagger) for both
- [ ] Health check endpoint: `/health`
- [ ] Request logging for debugging

**Tasks:**
- Backend: Create public gateway FastAPI app
- Backend: Create internal gateway FastAPI app
- Backend: Add rate limiting middleware
- Backend: Configure CORS
- Testing: Add gateway integration tests

---

### Story 3.3: Google Cloud Run Deployment
**Label:** `deployment` `priority:P0`

**User Story:**
As a developer, I want automated deployments to Cloud Run so that changes are released quickly and reliably.

**Acceptance Criteria:**
- [ ] Dockerfile for each service
- [ ] Docker Compose for local development
- [ ] GitHub Actions workflow for CI/CD
- [ ] Deploy to Cloud Run on merge to main
- [ ] Environment variables from GCP Secret Manager
- [ ] Health check configured
- [ ] Auto-scaling enabled (min 1, max 10 instances)
- [ ] Deployment outputs service URL
- [ ] Rollback capability (keep last 5 revisions)

**GitHub Actions Workflow:**
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: iacp-public-gateway
          region: us-central1
          image: gcr.io/${{ secrets.GCP_PROJECT_ID }}/iacp-public-gateway
```

**Tasks:**
- DevOps: Create Dockerfiles for all services
- DevOps: Set up Cloud Run services
- DevOps: Configure GitHub Actions workflow
- DevOps: Set up GCP Secret Manager
- Testing: Add deployment smoke tests

---

## Epic 4: Testing & Quality

### Story 4.1: Unit Test Suite
**Label:** `testing` `priority:P1`

**User Story:**
As a developer, I want comprehensive unit tests so that I can catch bugs early.

**Acceptance Criteria:**
- [ ] 80% code coverage for backend services
- [ ] 70% code coverage for frontend components
- [ ] Pytest for backend (Python)
- [ ] Vitest for frontend (React)
- [ ] Mock data for all tests
- [ ] CI runs tests on every PR
- [ ] Coverage report in PR comments

**Tasks:**
- Testing: Set up pytest configuration
- Testing: Set up Vitest configuration
- Testing: Write tests for all services
- DevOps: Add coverage reporting to CI

---

### Story 4.2: E2E Test Suite
**Label:** `testing` `priority:P1`

**User Story:**
As a QA engineer, I want end-to-end tests so that I can verify complete user workflows.

**Acceptance Criteria:**
- [ ] Playwright for E2E testing
- [ ] Test: Public e-filing flow (submit filing)
- [ ] Test: Docket clerk flow (review, docket, assign)
- [ ] Test: Authentication flow (Google OAuth)
- [ ] Test: Deficiency notice flow
- [ ] Tests run in CI on staging environment
- [ ] Video recording of failed tests
- [ ] Screenshot comparison for UI regressions

**Tasks:**
- Testing: Set up Playwright configuration
- Testing: Write E2E tests for critical paths
- DevOps: Set up staging environment
- DevOps: Configure test execution in CI

---

## Three-Agent Workflow

### Agent Roles & Responsibilities

#### 🤖 Qwen (Primary Developer)
**Focus:** Database backend + Frontend components

**Responsibilities:**
1. **Database:**
   - Implement PostgreSQL schema (`database/schema.sql`)
   - Create Alembic migrations
   - Write seed data scripts
   - Optimize queries with indexes

2. **Frontend:**
   - Build all React components from UI/UX specs
   - Implement 3-pane Case Intelligence Hub
   - Create document viewer with versioning
   - Build AI validation panel
   - Implement smart assignment modal

3. **Integration:**
   - Connect frontend to backend APIs
   - Implement WebSocket/SSE for AI streaming
   - Handle authentication state

**Issues Assigned:**
- All `🎨 frontend` labeled issues
- All `database` schema issues
- Component integration issues

---

#### 🔌 Aider (API Integration Specialist)
**Focus:** Backend APIs + Service Integration

**Responsibilities:**
1. **Backend Services:**
   - Implement FastAPI services (court-record, filing-review, etc.)
   - Create API endpoints for all user stories
   - Implement event publishing to Google Pub/Sub

2. **AI/ML Integration:**
   - Integrate Gemini API for validation
   - Implement smart assignment algorithm
   - Create AI streaming responses

3. **External Services:**
   - Google OAuth 2.0 integration
   - SendGrid email integration
   - Pay.gov payment integration
   - GCS document storage

**Issues Assigned:**
- All `🔌 backend` labeled issues
- All `🤖 ai-ml` labeled issues
- API integration issues

---

#### 🧪 GitHub Copilot (Testing & Deployment)
**Focus:** Tests + CI/CD + Cloud Deployment

**Responsibilities:**
1. **Testing:**
   - Write unit tests for all services
   - Write integration tests for APIs
   - Write E2E tests with Playwright
   - Maintain 80%+ coverage

2. **CI/CD:**
   - Create GitHub Actions workflows
   - Configure Cloud Run deployments
   - Set up staging/production environments
   - Implement rollback procedures

3. **Infrastructure:**
   - Docker containerization
   - GCP Secret Manager setup
   - Monitoring and logging configuration
   - Performance optimization

**Issues Assigned:**
- All `🧪 testing` labeled issues
- All `📦 deployment` labeled issues
- Infrastructure and DevOps issues

---

### Collaboration Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Development Workflow                          │
│                                                                  │
│  1. User Story Created (GitHub Issue)                           │
│         │                                                        │
│         ▼                                                        │
│  2. Qwen: Implements database schema + frontend component       │
│         │                                                        │
│         ▼                                                        │
│  3. Aider: Implements backend APIs + AI integration            │
│         │                                                        │
│         ▼                                                        │
│  4. Copilot: Writes tests + deploys to Cloud Run               │
│         │                                                        │
│         ▼                                                        │
│  5. PR Created → Code Review → Merge to Main                   │
│         │                                                        │
│         ▼                                                        │
│  6. Auto-deploy to Production (Cloud Run)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Protocol

**Daily Standup (Async via GitHub):**
- Qwen: Database schema progress, frontend component status
- Aider: API endpoint progress, AI integration status
- Copilot: Test coverage, deployment status

**Blockers:**
- Tag issue with `blocked` label
- Mention relevant agent in comment
- Daily sync call if blocker > 4 hours

**Code Review:**
- All PRs require review from at least 1 other agent
- Use GitHub PR review system
- Automated checks must pass (tests, linting)

---

## GitHub Repository Structure

```
IACP-3.0/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── user-story.md
│   │   └── bug-report.md
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-staging.yml
│       └── deploy-production.yml
├── database/
│   ├── schema.sql
│   ├── seed_data.sql
│   └── migrations/
├── src/
│   ├── components/
│   │   ├── public-efiling/
│   │   ├── docket-clerk/
│   │   └── UI/
│   ├── services/
│   └── types.ts
├── backend/
│   ├── services/
│   │   ├── court-record/
│   │   ├── filing-review/
│   │   └── ...
│   └── tests/
├── tests/
│   ├── e2e/
│   └── integration/
└── docs/
    ├── UI_UX_DESIGN.md
    ├── USER_STORIES.md (this file)
    └── ...
```

---

**Next Steps:**
1. Create GitHub repository
2. Set up issue labels
3. Create issues from user stories
4. Assign issues to agents
5. Begin sprint planning
