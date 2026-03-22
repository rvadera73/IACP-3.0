# IACP 3.0 - Agent Collaboration Guide

**How we work together as a three-agent team**

---

## 🚨 STOP - Read This First!

We are **NOT** working in isolation. This is a **collaborative effort** between:

- **🤖 Qwen** - Database + Frontend specialist
- **🔌 Aider** - Backend APIs + AI Integration specialist  
- **🧪 GitHub Copilot** - Testing + Deployment specialist

Each agent has specific responsibilities. We coordinate through **GitHub Issues** and **Daily Standups**.

---

## 📋 Current Sprint: Sprint 0 (Foundation Week)

**Duration:** March 24-28, 2026  
**Goal:** Set up database, backend, and CI/CD foundation  
**Issues:** 10 issues (57 story points)  
**Tracking:** [`docs/SPRINT_0_ISSUES.md`](docs/SPRINT_0_ISSUES.md)

---

## 🎯 Your Role

### If You Are Qwen:

**Your Responsibilities:**
1. **Database:** PostgreSQL schema, migrations, seed data
2. **Frontend:** React components, UI implementation, accessibility
3. **Integration:** Connect frontend to backend APIs

**Your Sprint 0 Issues:**
- Issue #1: PostgreSQL Database Schema (8 pts)
- Issue #2: Alembic Migration System (5 pts)
- Issue #7: Seed Data for Development (3 pts)
- Issue #10: Issue Templates and Labels (2 pts)

**How to Start:**
1. Go to GitHub repository: https://github.com/rvadera73/IACP-3.0
2. Find issues assigned to you in Projects
3. Comment `#standup` with your plan
4. Create PR when ready for review

---

### If You Are Aider:

**Your Responsibilities:**
1. **Backend:** FastAPI services, API endpoints
2. **AI Integration:** Gemini API, smart algorithms
3. **External Services:** OAuth, SendGrid, Pay.gov, GCS

**Your Sprint 0 Issues:**
- Issue #3: FastAPI Backend Structure (8 pts)
- Issue #4: Google OAuth 2.0 (5 pts)

**How to Start:**
1. Go to GitHub repository: https://github.com/rvadera73/IACP-3.0
2. Find issues assigned to you in Projects
3. Comment `#standup` with your plan
4. Coordinate with Qwen on database schema
5. Create PR when ready for review

---

### If You Are GitHub Copilot:

**Your Responsibilities:**
1. **Testing:** Unit, integration, E2E tests
2. **Deployment:** CI/CD, Cloud Run, Docker
3. **Quality:** Coverage reports, security scanning

**Your Sprint 0 Issues:**
- Issue #5: CI/CD Pipeline (8 pts)
- Issue #6: Docker Containerization (5 pts)
- Issue #8: Initial Test Suite (8 pts)
- Issue #9: Cloud Run Services (5 pts)

**How to Start:**
1. Go to GitHub repository: https://github.com/rvadera73/IACP-3.0
2. Find issues assigned to you in Projects
3. Comment `#standup` with your plan
4. Coordinate with Aider on backend structure
5. Create PR when ready for review

---

## 🔄 Daily Workflow

### Morning Standup (9:00 AM EST)

**Post in GitHub Discussion `#daily-standup`:**

```markdown
## [Agent Name] - Day X Standup

### Yesterday
- ✅ Completed task 1
- ✅ Completed task 2

### Today
- 🔄 Working on task 3
- 🔄 Working on task 4

### Blockers
- ⛔ [None / Describe blocker and tag relevant agent]

### PRs for Review
- [Link to PR if any]
```

### During Development

1. **Pick up an issue** from Sprint 0 backlog
2. **Comment on issue** to start working
3. **Create branch** from issue (GitHub will suggest)
4. **Work on tasks**
5. **Ask for help** if blocked (tag agent in comment)
6. **Create PR** when ready
7. **Request review** from other agents
8. **Address feedback** and merge

### Code Review

**Every PR needs:**
- ✅ At least 1 agent approval
- ✅ All CI checks passing
- ✅ Tests written and passing
- ✅ Documentation updated

**Review Checklist:**
- [ ] Code follows style guide
- [ ] Tests included
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered

---

## 📞 Communication

### GitHub Features We Use

| Feature | Purpose |
|---------|---------|
| **Issues** | Track work, user stories, bugs |
| **Projects** | Sprint board, issue assignment |
| **Discussions** | Daily standup, Q&A, brainstorming |
| **PRs** | Code review, CI/CD triggers |
| **Labels** | Categorize issues (frontend, backend, testing) |

### When to Sync

**Asynchronous (GitHub):**
- Daily standup updates
- Progress comments on issues
- Code review comments
- Blocker notifications

**Synchronous (Call):**
- Sprint planning (Monday Week 1)
- Sprint review (Friday Week 1)
- Emergency blockers (>4 hours)
- Complex architecture decisions

---

## 🎯 Sprint 0 Priorities

### Critical Path (Must Complete)

1. **Database Schema** (Qwen) - Blocks all backend work
2. **Backend Structure** (Aider) - Blocks all API work
3. **CI/CD Pipeline** (Copilot) - Blocks all deployments

### Important (Should Complete)

4. **OAuth Integration** (Aider) - Needed for auth
5. **Test Suite** (Copilot) - Quality gate
6. **Docker Setup** (Copilot) - Needed for deployment

### Nice to Have (If Time Permits)

7. **Seed Data** (Qwen) - Helps development
8. **Issue Templates** (Qwen) - Helps organization

---

## 🚀 Getting Started RIGHT NOW

### Step 1: Review the Docs

Read these before starting work:
1. [`README_IACP3.md`](README_IACP3.md) - Project overview
2. [`docs/PHASE1_IMPLEMENTATION_PLAN.md`](docs/PHASE1_IMPLEMENTATION_PLAN.md) - 5-week plan
3. [`docs/THREE_AGENT_WORKFLOW.md`](docs/THREE_AGENT_WORKFLOW.md) - Collaboration guide
4. [`docs/SPRINT_0_ISSUES.md`](docs/SPRINT_0_ISSUES.md) - Your issues

### Step 2: Set Up Local Dev

```bash
# Clone repo
git clone https://github.com/rvadera73/IACP-3.0.git
cd IACP-3.0

# Check what's already there
ls -la
cat README_IACP3.md

# See pending issues
open docs/SPRINT_0_ISSUES.md
```

### Step 3: Pick Your First Issue

**Qwen:** Start with Issue #1 (Database Schema)  
**Aider:** Start with Issue #3 (Backend Structure)  
**Copilot:** Start with Issue #5 (CI/CD Pipeline)

### Step 4: Post Your Standup

Go to GitHub Discussions → New Discussion → `#daily-standup`

```
## [Your Agent Name] - Sprint 0 Day 1

### Today
- 🔄 Starting Issue #X: [Issue Name]
- 🔄 Planning to [describe approach]

### Blockers
- ⛔ None

### Questions
- [Any questions for the team]
```

---

## 📊 Tracking Progress

### GitHub Projects Board

We use a Kanban board with columns:

```
┌──────────┬──────────┬──────────────┬──────────┬──────────┐
│  Backlog │   Todo   │  In Progress │  Review  │  Done    │
├──────────┼──────────┼──────────────┼──────────┼──────────┤
│ Future   │ Sprint 0 │ Current work │ PRs open │ Completed│
│ issues   │ issues   │              │          │ issues   │
└──────────┴──────────┴──────────────┴──────────┴──────────┘
```

### Update Your Issues

As you work:
1. Move issue card across board
2. Comment progress updates
3. Link PR when created
4. Close when merged

### Burndown Chart

Track daily in Sprint Review:
- Story points remaining
- Days remaining in sprint
- On track? (ideal burndown line)

---

## 🎉 Sprint 0 Completion Criteria

Sprint 0 is done when:

- ✅ All 10 issues closed
- ✅ Database deployed to staging Cloud SQL
- ✅ Backend services running on Cloud Run
- ✅ CI/CD pipeline deploying on merge
- ✅ Test coverage > 75%
- ✅ Local dev environment working

**Sprint 0 Review Demo:** Friday March 28, 2026

**Demo Agenda:**
1. Database schema walkthrough (Qwen)
2. Backend services demo (Aider)
3. CI/CD pipeline demo (Copilot)
4. Test coverage report (Copilot)
5. Local dev setup (All)

---

## 🆘 Getting Help

### Blocked on Something?

1. **Check documentation** first
2. **Search existing issues** for similar problems
3. **Tag relevant agent** in issue comment
4. **Post in `#help`** discussion if urgent

### Example Blocker Comment

```markdown
⛔ **BLOCKED**

@Aider I'm blocked on Issue #1. The database schema 
references a `filing-review` service endpoint that 
doesn't exist yet. Can you prioritize Issue #3 
(Backend Structure) so I know the API paths?

Estimated delay: 4 hours if not addressed.
```

---

## 📚 Resources

### Documentation

- [PostgreSQL Docs](https://www.postgresql.org/docs/15/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Cloud Run](https://cloud.google.com/run/docs)

### Code Examples

- [US Tax Court EFS](https://github.com/ustaxcourt/ef-cms) - Reference implementation
- [FastAPI + PostgreSQL](https://github.com/tiangolo/full-stack-fastapi-postgresql) - Template

---

**Last Updated:** March 22, 2026  
**Current Sprint:** Sprint 0 (Foundation)  
**Next Sprint:** Sprint 1 (Public E-Filing Part 1)
