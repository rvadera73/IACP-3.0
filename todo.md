# IACP 3.0 - Sprint 0 Tasks

**Current Sprint:** Sprint 0 (Foundation Week)  
**Date Started:** March 22, 2026  
**Status:** IN PROGRESS

---

## 🎯 Sprint Goal

Connect existing prototype screens to real backend and deploy to Cloud Run.

---

## ✅ Completed Tasks

### Day 1 (March 22)

- [x] Verify Aider installed ✅
- [x] Verify Qwen CLI installed ✅
- [x] Aider created FastAPI backend structure ✅
  - `backend/app.py` - Health + Filings endpoints
  - `backend/main.py` - Entry point
  - `backend/models.py` - SQLAlchemy Filing model
  - `backend/requirements.txt` - Dependencies
- [x] Created frontend API layer ✅
  - `src/services/api.ts` - Fetch wrappers

---

## 🔄 In Progress

### Day 2 (March 23)

- [ ] Aider: Add database connection (PostgreSQL)
- [ ] Aider: Add Case model from schema.sql
- [x] Qwen CLI: Create React Query hooks ✅
- [ ] Qwen CLI: Update EFSPortal to use real API
- [x] Commit and push all changes

---

## 📋 Pending Tasks

### Backend (Aider)

- [ ] Database connection setup
- [ ] All 9 schemas from schema.sql
- [ ] CRUD operations for each model
- [ ] Google OAuth 2.0 endpoint
- [ ] AI streaming endpoint (SSE)
- [ ] Email service integration

### Frontend (Qwen CLI)

- [ ] React Query hooks (`src/hooks/`)
- [ ] Update EFSPortal.tsx
- [ ] Update DocketClerkDashboard.tsx
- [ ] Add loading states
- [ ] Add error handling

### Testing (Both)

- [ ] Unit tests for backend
- [ ] Component tests for frontend
- [ ] Integration tests
- [ ] E2E tests

### Deployment

- [ ] Dockerfile updates
- [ ] Cloud Run configuration
- [ ] Environment variables
- [ ] Deploy to staging

---

## 📝 Today's Instructions for Agents

### For Aider (Backend)

**Read context from files, not prompts:**
1. Read `database/schema.sql` for models
2. Read `docs/EXISTING_COMPONENTS_INVENTORY.md` for what exists
3. Read `src/services/api.ts` for expected endpoints

**Tasks:**
```bash
# Task 1: Database setup
# Context: database/schema.sql
aider --message "See database/schema.sql - create SQLAlchemy models for core schema"

# Task 2: Add CRUD
# Context: backend/models.py  
aider --message "Add CRUD operations to existing models"
```

### For Qwen CLI (Frontend)

**Read context from files:**
1. Read `src/services/api.ts` for API layer
2. Read `docs/EXISTING_COMPONENTS_INVENTORY.md` for components
3. Read `src/components/EFSPortal.tsx` for current implementation

**Tasks:**
```bash
# Task 1: Create hooks
# Context: src/services/api.ts
qwen "See src/services/api.ts - create React Query hooks in src/hooks/" -y

# Task 2: Update EFSPortal
# Context: src/components/EFSPortal.tsx
qwen "Update EFSPortal.tsx to use api.ts instead of mock data" -y
```

---

## 🚫 What NOT to Do

1. ❌ Don't pass large context in prompts (rate limits)
2. ❌ Don't recreate existing components
3. ❌ Don't use Groq if Alibaba API is available
4. ❌ Don't work in isolation - commit frequently

---

## ✅ What TO Do

1. ✅ Read context from files (schema.sql, existing code)
2. ✅ Enhance existing components
3. ✅ Use configured API (check .aider.conf.yml)
4. ✅ Commit after each task
5. ✅ Update this todo.md as you work

---

## 📞 Communication

**When stuck:**
1. Comment in this file
2. Check existing docs first
3. Ask other agent via file comments

**When complete:**
1. Update checklist above
2. Git commit with clear message
3. Push to main

---

**Last Updated:** March 22, 2026  
**Next Update:** End of Day 2
