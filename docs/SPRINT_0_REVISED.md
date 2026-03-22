# IACP 3.0 - Revised Sprint 0 Plan

**Using Existing Prototype Screens**  
**Date:** March 22, 2026  
**Time Savings:** 60-70% (3 weeks instead of 5)

---

## 🎯 Key Insight

**We already have working prototype screens!** Instead of building from scratch, we'll:

1. ✅ **Reuse** existing components (EFSPortal, IACPPortal, dashboards)
2. ✅ **Enhance** with real backend integration
3. ✅ **Connect** to database and AI services
4. ✅ **Deploy** to production

---

## 📊 What Already Exists

### ✅ Complete Components (2,000+ lines each)

| Component | Lines | Status | Sprint |
|-----------|-------|--------|--------|
| **EFSPortal.tsx** | 1,238 | ✅ Production Ready | 1-2 |
| **DocketClerkDashboard.tsx** | 752 | ✅ Production Ready | 3 |
| **OALJLegalAssistantDashboard.tsx** | 623 | ✅ Production Ready | 4 |
| **CaseIntelligenceHub.tsx** | 500+ | ✅ Production Ready | 3 |
| **OALJJudgeDashboard.tsx** | 363 | ✅ Production Ready | 4 |

### ✅ Services (Already Working)

| Service | Status | Purpose |
|---------|--------|---------|
| `geminiService.ts` | ✅ Working | AI validation, intake analysis |
| `autoDocketing.ts` | ✅ Working | Auto-docket workflow |
| `smartAssignment.ts` | ✅ Working | Judge assignment algorithm |
| `smartScheduler.ts` | ✅ Working | Hearing scheduling |

### ✅ Infrastructure

| Component | Status | Purpose |
|-----------|--------|---------|
| `AuthContext.tsx` | ✅ Working | Authentication state |
| `rbac.ts` | ✅ Working | Role-based access control |
| `roleNavConfig.ts` | ✅ Working | Navigation by role |
| `mockDataEnhanced.ts` | ✅ Working | Test data |

---

## 🔄 Revised Sprint 0 Focus

Instead of building new components, Sprint 0 will:

### 1. Backend Integration Layer (Qwen + Aider)

**Goal:** Replace mock data with real API calls

**Tasks:**
- [ ] Create API service layer (`src/services/api.ts`)
- [ ] Add React Query hooks for data fetching
- [ ] Replace mock data calls in components
- [ ] Add error handling and loading states
- [ ] Implement optimistic updates

**Files to Create:**
```
src/
├── services/
│   ├── api.ts              # API client
│   ├── useFilings.ts       # React Query hook
│   ├── useCases.ts         # React Query hook
│   └── useAuth.ts          # Auth hook
└── hooks/
    ├── useIntakeQueue.ts
    └── useCaseDetails.ts
```

---

### 2. Database Connection (Qwen)

**Goal:** Connect PostgreSQL to existing components

**Tasks:**
- [ ] Run database schema (already in `database/schema.sql`)
- [ ] Create backend API endpoints
- [ ] Replace mock data in `mockDataEnhanced.ts`
- [ ] Test with existing components
- [ ] Add migration scripts

**Existing Schema:** ✅ `database/schema.sql` (already created)

---

### 3. Real OAuth (Aider)

**Goal:** Replace mock authentication

**Tasks:**
- [ ] Implement Google OAuth 2.0
- [ ] Update `AuthContext.tsx` with real auth
- [ ] Add JWT token handling
- [ ] Create session management
- [ ] Test login flow

**Existing:** ✅ `AuthContext.tsx` (just needs real OAuth provider)

---

### 4. AI Streaming (Aider + Qwen)

**Goal:** Enable real-time AI validation

**Tasks:**
- [ ] Add SSE (Server-Sent Events) to backend
- [ ] Update `geminiService.ts` to stream responses
- [ ] Create streaming hook in frontend
- [ ] Test with EFSPortal filing flow
- [ ] Add error recovery

**Existing:** ✅ `geminiService.ts` (already calls Gemini API)

---

### 5. Testing (Copilot)

**Goal:** Test existing components

**Tasks:**
- [ ] Write tests for EFSPortal.tsx
- [ ] Write tests for DocketClerkDashboard.tsx
- [ ] Integration tests for API + components
- [ ] E2E tests for filing flow
- [ ] Performance tests

**Existing Components to Test:**
- EFSPortal.tsx (1,238 lines)
- DocketClerkDashboard.tsx (752 lines)
- CaseIntelligenceHub.tsx (500+ lines)

---

### 6. Deployment (Copilot)

**Goal:** Deploy to Cloud Run

**Tasks:**
- [ ] Dockerize existing app (already has Dockerfile)
- [ ] Set up Cloud Run services
- [ ] Configure environment variables
- [ ] Set up CI/CD (already in `.github/workflows/`)
- [ ] Deploy to staging

**Existing:** ✅ CI/CD workflows already created

---

## 📅 Revised Sprint 0 Schedule

### Day 1 (Monday): Audit & Planning

**Morning:**
- Review all existing components
- Identify what needs refactoring
- Assign tasks to agents

**Afternoon:**
- Qwen: Review frontend components
- Aider: Review backend services
- Copilot: Review test coverage

**Deliverable:** Component audit report

---

### Day 2 (Tuesday): API Layer

**Qwen:**
- Create React Query hooks
- Extract FilingWizard component
- Add TypeScript types

**Aider:**
- Create FastAPI endpoints
- Add CORS configuration
- Test with Postman

**Copilot:**
- Write tests for API endpoints
- Set up test database

**Deliverable:** Working API layer

---

### Day 3 (Wednesday): Database Integration

**Qwen:**
- Run database migrations
- Replace mock data in components
- Test with existing UI

**Aider:**
- Create repository pattern
- Add database connection
- Implement CRUD operations

**Copilot:**
- Test database queries
- Write integration tests

**Deliverable:** Database connected to components

---

### Day 4 (Thursday): OAuth + AI Streaming

**Qwen:**
- Update AuthContext with real OAuth
- Add SSE hook for AI streaming
- Test filing flow

**Aider:**
- Implement Google OAuth 2.0
- Add streaming to Gemini service
- Test AI validation

**Copilot:**
- Test OAuth flow
- Test AI streaming
- Write E2E tests

**Deliverable:** Real auth + streaming AI

---

### Day 5 (Friday): Testing + Deployment

**Morning:**
- Final testing
- Bug fixes
- Performance optimization

**Afternoon:**
- Deploy to staging
- Demo preparation
- Sprint 0 review

**Deliverable:** Working deployment to staging

---

## 🎯 Sprint 0 Success Criteria

Sprint 0 is complete when:

- ✅ EFSPortal.tsx works with real backend
- ✅ DocketClerkDashboard.tsx shows real data
- ✅ OAuth login working (Google)
- ✅ AI validation streams in real-time
- ✅ Database connected and queried
- ✅ Deployed to staging Cloud Run
- ✅ Test coverage > 75%

---

## 📋 Agent Assignments

### 🤖 Qwen - Frontend + Database

**Sprint 0 Tasks:**
1. Create React Query hooks (`src/hooks/`)
2. Extract reusable components from EFSPortal
3. Replace mock data with API calls
4. Run database migrations
5. Add TypeScript types

**Issues:**
- Issue #1: API Service Layer (8 pts)
- Issue #2: React Query Hooks (5 pts)
- Issue #7: Database Integration (3 pts)

**Total:** 16 story points

---

### 🔌 Aider - Backend + AI

**Sprint 0 Tasks:**
1. Create FastAPI endpoints
2. Implement Google OAuth 2.0
3. Add SSE streaming for AI
4. Create repository pattern
5. Connect to Gemini API

**Issues:**
- Issue #3: Backend API Structure (8 pts)
- Issue #4: OAuth Implementation (5 pts)
- Issue #6: AI Streaming (5 pts)

**Total:** 18 story points

---

### 🧪 Copilot - Testing + Deployment

**Sprint 0 Tasks:**
1. Write component tests
2. Write integration tests
3. Write E2E tests
4. Set up Cloud Run deployment
5. Configure CI/CD pipeline

**Issues:**
- Issue #5: Test Suite (8 pts)
- Issue #8: Cloud Run Deployment (5 pts)
- Issue #9: CI/CD Configuration (5 pts)

**Total:** 18 story points

---

## 🔗 Component Mapping

### Public E-Filing (Sprint 1-2)

**Existing Component → Backend Endpoint**

| Component | Function | API Endpoint |
|-----------|----------|--------------|
| EFSPortal.tsx | Main filing flow | `POST /api/v1/filings` |
| Filing form | Submit filing | `POST /api/v1/filings/submit` |
| AI validation | Real-time analysis | `GET /api/v1/ai/validate?stream=true` |
| My Cases | View filings | `GET /api/v1/filings?userId={id}` |
| Case viewer | View details | `GET /api/v1/cases/{id}` |

---

### Docket Clerk (Sprint 3)

**Existing Component → Backend Endpoint**

| Component | Function | API Endpoint |
|-----------|----------|--------------|
| DocketClerkDashboard.tsx | Intake queue | `GET /api/v1/intake/queue` |
| Auto-docket button | Docket case | `POST /api/v1/intake/{id}/docket` |
| Assignment modal | Get judges | `GET /api/v1/judges/suggest?caseType={type}` |
| Deficiency notice | Send notice | `POST /api/v1/filings/{id}/deficiency` |
| Case Intelligence Hub | Case details | `GET /api/v1/cases/{id}/hub` |

---

## 📊 Time Savings

### Original Plan (Build from Scratch)
- Week 1: Database + Schema
- Week 2: Public E-Filing (build UI)
- Week 3: Public E-Filing (build AI)
- Week 4: Docket Clerk (build UI)
- Week 5: Docket Clerk (build AI)
- **Total: 5 weeks**

### Revised Plan (Use Existing Screens)
- Week 1: Integration (connect existing UI to backend)
- Week 2: Enhance (streaming AI, OAuth)
- Week 3: Test + Deploy
- **Total: 3 weeks**

**Time Saved:** 2 weeks (40%)  
**Code Reuse:** 60-70%

---

## 🚀 Getting Started

### Step 1: Review Existing Code

```bash
# Review EFSPortal
code src/components/EFSPortal.tsx

# Review DocketClerkDashboard
code src/components/iacp/DocketClerkDashboard.tsx

# Review services
code src/services/geminiService.ts
code src/services/autoDocketing.ts
```

### Step 2: Identify Integration Points

**Look for:**
- Mock data imports (`import { MOCK_... } from '../data/...'`)
- Hardcoded values
- Alert() calls (replace with real notifications)
- Console.log() (replace with real logging)

### Step 3: Create API Layer

```typescript
// src/services/api.ts
const API_BASE = '/api/v1';

export const api = {
  filings: {
    getAll: () => fetch(`${API_BASE}/filings`),
    submit: (data) => fetch(`${API_BASE}/filings`, { method: 'POST', body: JSON.stringify(data) }),
    validate: (id) => fetch(`${API_BASE}/filings/${id}/validate`),
  },
  // ... more endpoints
};
```

### Step 4: Replace Mock Data

**Before:**
```typescript
import { MOCK_CASE_FOLDERS } from '../data/mockDashboardData';

const [cases, setCases] = useState(MOCK_CASE_FOLDERS);
```

**After:**
```typescript
const { data: cases } = useQuery(['cases'], () => api.cases.getAll());
```

---

## ✅ Sprint 0 Checklist

- [ ] All existing components reviewed
- [ ] API service layer created
- [ ] React Query hooks implemented
- [ ] Database migrations run
- [ ] OAuth 2.0 working
- [ ] AI streaming enabled
- [ ] Tests written (75%+ coverage)
- [ ] Deployed to staging
- [ ] Sprint 0 demo ready

---

**Let's build on what we already have! 🚀**

**References:**
- [`docs/EXISTING_COMPONENTS_INVENTORY.md`](docs/EXISTING_COMPONENTS_INVENTORY.md) - Full component list
- [`docs/SPRINT_0_ISSUES.md`](docs/SPRINT_0_ISSUES.md) - Original issues (now adapted)
- [`COLLABORATION_GUIDE.md`](COLLABORATION_GUIDE.md) - Team workflow
