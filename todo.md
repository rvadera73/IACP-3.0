# IACP 3.0 — TODO

> **Purpose**: Shared task tracker for all agents (Qwen, Aider, Codex, Copilot, Claude Sonnet, Claude Opus).
> Agents MUST read this file at the start of each session and update it after completing or adding tasks.
> Last updated: 2026-03-23

---

## Current Sprint: Sprint 1 — Foundation Fixes + Public E-Filing Part 1

**Sprint Goal:** Fix data model, set up modular backend, implement Google OAuth, and build the public filing wizard (steps 1-3).

**Sprint Dates:** March 23 – March 30, 2026
**GitHub Issues:** https://github.com/rvadera73/IACP-3.0/issues

---

## P0 — Must Complete (Blocks Sprint Goal)

### Codex (DB Fixes + Cleanup + Seed Data)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 1 | [#1](https://github.com/rvadera73/IACP-3.0/issues/1) | Fix UUID primary keys in backend models | Complete |
| 2 | [#2](https://github.com/rvadera73/IACP-3.0/issues/2) | Delete legacy data model files, update references | In Progress |
| 3 | [#3](https://github.com/rvadera73/IACP-3.0/issues/3) | Add Pydantic request/response schemas | Complete |
| 4 | [#4](https://github.com/rvadera73/IACP-3.0/issues/4) | Generate comprehensive seed_data.sql from prototype mock data | Complete |

### Aider (Backend Infrastructure)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 5 | [#5](https://github.com/rvadera73/IACP-3.0/issues/5) | Set up Alembic + initial migration | Pending |
| 7 | [#7](https://github.com/rvadera73/IACP-3.0/issues/7) | Implement Google OAuth 2.0 backend | Pending |

### Qwen (Backend Refactor + Frontend)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 6 | [#6](https://github.com/rvadera73/IACP-3.0/issues/6) | Refactor backend to modular monolith | Pending |
| 8 | [#8](https://github.com/rvadera73/IACP-3.0/issues/8) | Set up PyCasbin RBAC | Pending |
| 9 | [#9](https://github.com/rvadera73/IACP-3.0/issues/9) | Public Portal: Landing page | Pending |
| 10 | [#10](https://github.com/rvadera73/IACP-3.0/issues/10) | Public Portal: Google OAuth frontend | In Progress |
| 17 | [#17](https://github.com/rvadera73/IACP-3.0/issues/17) | React Query + API client setup | Complete |

### Copilot (DevOps)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 13 | [#13](https://github.com/rvadera73/IACP-3.0/issues/13) | Docker Compose for local dev | Pending |

---

## P1 — Should Complete

### Qwen (Frontend)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 11 | [#11](https://github.com/rvadera73/IACP-3.0/issues/11) | Filing type selection wizard | In Progress |
| 16 | [#16](https://github.com/rvadera73/IACP-3.0/issues/16) | Shared UI component library | Pending |

### Aider (Backend)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 12 | [#12](https://github.com/rvadera73/IACP-3.0/issues/12) | Filing API: CRUD endpoints | Pending |

### Copilot (Testing + CI)

| # | Issue | Task | Status |
|---|-------|------|--------|
| 14 | [#14](https://github.com/rvadera73/IACP-3.0/issues/14) | CI pipeline: lint + test on PR | Pending |
| 15 | [#15](https://github.com/rvadera73/IACP-3.0/issues/15) | Unit tests for filing API + OAuth + RBAC | Pending |

---

## Dependency Graph

```
#1 (UUID fix) ──┐
#2 (Doc cleanup) │
#3 (Pydantic)  ──┤──→ #6 (Modular monolith) ──→ #7 (OAuth backend) ──→ #10 (OAuth frontend)
#5 (Alembic)   ──┘                            ──→ #8 (RBAC)
#4 (Seed data) ──→ #13 (Docker Compose)       ──→ #12 (Filing API) ──→ #11 (Filing wizard)
                                               ──→ #17 (React Query) ──→ #9 (Landing page)
                                                                     ──→ #16 (UI components)
                   #14 (CI) ──→ #15 (Tests)
```

**Execution Order:**
1. **Wave 1 (parallel):** #1, #2, #3, #4, #5 — Codex does fixes/cleanup, Aider does Alembic
2. **Wave 2 (parallel):** #6, #13, #17, #16 — Frontend integration complete for React Query/API wiring; backend/devops items remain separate
3. **Wave 3 (parallel):** #7, #8, #9, #14 — Aider does OAuth, Qwen does RBAC + landing page, Copilot does CI
4. **Wave 4 (parallel):** #10, #11, #12, #15 — Frontend OAuth, wizard, filing API, tests

---

## Blocked

- Local Python environment is missing `fastapi`, `sqlalchemy`, and `pydantic`, so backend runtime smoke tests cannot run until dependencies are installed.

---

## Session Notes

### 2026-03-23 Codex Summary

- Completed backend UUID/default ID fixes and added typed Pydantic schemas for the FastAPI surface.
- Repaired backend auto-docketing so filings without an attached case can still be docketed safely.
- Fixed both seed paths:
  - `backend/seed_data.py` now uses the live SQLAlchemy session factory and creates its required clerk/judge people.
  - `database/seed_data.sql` now includes valid organization rows and all referenced internal users/offices.
- Added public filing wizard/frontend auth work in progress on the React side.
- Wave 2 frontend/API integration is complete for the current React surfaces; Wave 4 frontend work is partially complete through the public filing entry flow and demo sign-in UI.

### Next Session Priorities

1. Install backend Python dependencies locally and run a true create → queue → docket smoke test.
2. Finish issue `#2` by auditing remaining data-model/documentation references and normalizing any stale paths.
3. Continue Phase 1 backend work on Alembic/modularization/OAuth backend once local runtime is verified.
4. Expand Wave 4 from frontend scaffolding into backend-backed OAuth and filing API coverage.

---

## Sprint 0 — Completed

- [x] Aider: Created FastAPI backend structure
- [x] Qwen: Created database.py, models.py, main.py
- [x] Qwen: Created React Query hooks
- [x] Qwen: Updated EFSPortal for real API
- [x] All changes committed and pushed

---

## Agent Assignment Summary

| Agent | Sprint 1 Issues | Focus |
|-------|-----------------|-------|
| **Codex** | #1, #2, #3, #4 | DB fixes, doc cleanup, seed data, Pydantic schemas |
| **Aider** | #5, #7, #12 | Alembic, Google OAuth, Filing API |
| **Qwen** | #6, #8, #9, #10, #11, #16, #17 | Backend refactor, RBAC, all frontend |
| **Copilot** | #13, #14, #15 | Docker, CI, tests |
| **Opus** | — | Architect, review, orchestrate |

---

**Last Updated:** 2026-03-23
**Next Update:** After backend smoke testing or Wave 4 backend progress
