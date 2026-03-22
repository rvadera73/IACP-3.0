# IACP 3.0 - Real Three-Agent Workflow

**Status:** ACTIVE - Agents Installed on This Machine  
**Date:** March 22, 2026

---

## ✅ Installed Tools

| Tool | Location | Status |
|------|----------|--------|
| **Aider** | `C:\Users\Rahul Vadera\.local\bin\aider.exe` | ✅ Installed |
| **Qwen** | `C:\Users\Rahul Vadera\AppData\Roaming\npm\qwen` | ✅ Installed |
| **Codex** | Not found | ❌ Not installed |

---

## 🎯 Actual Workflow (Starting NOW)

I (Qwen Code) will act as the **Planner & Coordinator**, and I'll delegate tasks to:

1. **Aider** - Backend/API integration (runs via command line)
2. **Qwen CLI** - Frontend/Database tasks (runs via command line)
3. **Myself** - Planning, coordination, and frontend work

---

## 🚀 Starting Real Agent Collaboration

### Task 1: Aider - Backend API Setup

**Command to run:**
```bash
aider --model gpt-4 --dir "C:\Users\Rahul Vadera\IACP-3.0\backend" --message "Create FastAPI backend structure with endpoints for: 1) POST /api/v1/filings, 2) GET /api/v1/intake/queue, 3) POST /api/v1/intake/{id}/docket. Use existing services in src/services/"
```

### Task 2: Qwen CLI - Frontend Integration

**Command to run:**
```bash
qwen --dir "C:\Users\Rahul Vadera\IACP-3.0\src" --message "Create API integration layer: 1) Create src/services/api.ts with fetch wrappers, 2) Create React Query hooks in src/hooks/, 3) Replace mock data calls in EFSPortal.tsx with real API calls"
```

### Task 3: Me (Qwen Code) - Planning & Coordination

I'll:
- Create detailed task specifications
- Review output from Aider and Qwen CLI
- Integrate their work
- Commit and push to GitHub
- Coordinate the overall sprint

---

## 📋 Sprint 0 - Real Agent Tasks

### Aider's Tasks (Backend)

**Run these commands sequentially:**

```bash
# Task 1: Backend Structure
aider --model gpt-4 \
  --dir "C:\Users\Rahul Vadera\IACP-3.0\backend" \
  --message "Create FastAPI backend with these endpoints:
  1. POST /api/v1/filings - Submit new filing
  2. GET /api/v1/filings - List all filings
  3. GET /api/v1/intake/queue - Get intake queue for clerk
  4. POST /api/v1/intake/{id}/docket - Auto-docket a filing
  5. GET /api/v1/judges/suggest - Get judge suggestions
  Use existing services in src/services/autoDocketing.ts and src/services/smartAssignment.ts as reference"

# Task 2: Database Integration
aider --model gpt-4 \
  --dir "C:\Users\Rahul Vadera\IACP-3.0\backend" \
  --message "Add PostgreSQL integration using database/schema.sql. Create SQLAlchemy models for: 1) Case, 2) Filing, 3) Person, 4) User. Add CRUD operations for each model"

# Task 3: OAuth Integration
aider --model gpt-4 \
  --dir "C:\Users\Rahul Vadera\IACP-3.0\backend" \
  --message "Implement Google OAuth 2.0 authentication. Create /api/v1/auth/google endpoint. Generate JWT tokens. Update AuthContext.tsx integration"
```

---

### Qwen CLI's Tasks (Frontend)

**Run these commands sequentially:**

```bash
# Task 1: API Layer
qwen --dir "C:\Users\Rahul Vadera\IACP-3.0\src" \
  --message "Create API integration layer:
  1. Create src/services/api.ts with fetch wrappers for all endpoints
  2. Create src/hooks/useFilings.ts with React Query hooks
  3. Create src/hooks/useCases.ts with React Query hooks
  4. Create src/hooks/useIntakeQueue.ts for clerk dashboard
  Use TypeScript and proper error handling"

# Task 2: EFSPortal Integration
qwen --dir "C:\Users\Rahul Vadera\IACP-3.0\src\components" \
  --message "Update EFSPortal.tsx to use real API:
  1. Replace MOCK_CASE_FOLDERS with useQuery hook
  2. Replace mock filing submission with API call
  3. Add loading states and error handling
  4. Keep existing UI unchanged"

# Task 3: Dashboard Integration
qwen --dir "C:\Users\Rahul Vadera\IACP-3.0\src\components\iacp" \
  --message "Update DocketClerkDashboard.tsx to use real API:
  1. Replace mock intake queue with useIntakeQueue hook
  2. Replace auto-docket function with API call
  3. Replace judge assignment with API call
  4. Keep existing UI and workflows unchanged"
```

---

## 🔄 Daily Workflow (Starting Today)

### Morning (9:00 AM) - Planning Session

**I'll create:**
1. Task list for Aider
2. Task list for Qwen CLI
3. Integration plan

### Mid-Day (1:00 PM) - Review Session

**I'll:**
1. Review Aider's output
2. Review Qwen CLI's output
3. Fix any integration issues
4. Commit working code

### Evening (5:00 PM) - Sync Session

**I'll:**
1. Run tests
2. Update progress
3. Plan next day's tasks
4. Push to GitHub

---

## 📝 Today's Agenda (March 22, 2026)

### 9:00 AM - Setup Phase

- [x] Verify Aider installed ✅
- [x] Verify Qwen CLI installed ✅
- [ ] Create task specifications
- [ ] Set up backend directory
- [ ] Set up frontend hooks directory

### 10:00 AM - Aider Task 1

```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
aider --model gpt-4 \
  --dir "backend" \
  --message "Create FastAPI backend structure"
```

### 11:00 AM - Qwen CLI Task 1

```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
qwen --dir "src" \
  --message "Create API integration layer"
```

### 1:00 PM - Review & Integration

- Review Aider's backend code
- Review Qwen CLI's frontend code
- Integrate both
- Run tests

### 3:00 PM - Aider Task 2

```bash
aider --model gpt-4 \
  --dir "backend" \
  --message "Add PostgreSQL models and CRUD"
```

### 4:00 PM - Qwen CLI Task 2

```bash
qwen --dir "src/components" \
  --message "Integrate EFSPortal with API"
```

### 5:00 PM - Commit & Push

```bash
git add -A
git commit -m "feat: Sprint 0 Day 1 - API layer and backend structure"
git push origin main
```

---

## 🎯 Success Criteria

By end of today:

- [ ] Aider has created backend structure
- [ ] Qwen CLI has created API integration layer
- [ ] Backend and frontend are connected
- [ ] Code is committed and pushed
- [ ] Tests are passing
- [ ] Documentation updated

---

## 📞 Communication Protocol

### How I'll Work with Aider

```bash
# I give Aider a clear task
aider --model gpt-4 \
  --dir "backend" \
  --message "Create [specific feature] with [specific requirements]"

# Aider works on it
# I review the output
# I integrate with main codebase
# I commit the result
```

### How I'll Work with Qwen CLI

```bash
# I give Qwen CLI a clear task
qwen --dir "src" \
  --message "Create [specific component] with [specific requirements]"

# Qwen CLI works on it
# I review the output
# I integrate with main codebase
# I commit the result
```

### My Role as Planner

1. **Task Breakdown** - Split large tasks into agent-sized chunks
2. **Clear Specifications** - Give precise instructions to each agent
3. **Code Review** - Review all agent output
4. **Integration** - Combine agent work into cohesive whole
5. **Testing** - Ensure everything works together
6. **Documentation** - Keep docs updated
7. **Deployment** - Push to GitHub and deploy

---

## 🚀 Let's Start!

**First Command (Aider):**
```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
mkdir -p backend
aider --model gpt-4 --dir "backend" --message "Create FastAPI backend with /api/v1/filings endpoints"
```

**Second Command (Qwen CLI):**
```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
qwen --dir "src" --message "Create api.ts service layer with fetch wrappers"
```

**Then I'll:**
- Review both outputs
- Integrate them
- Test the integration
- Commit and push

---

**Ready to start real agent collaboration NOW!** 🚀
