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

## Next Sprint: Sprint 2 — Infra, DevSecOps, and Operational Validation

**Sprint Goal:** Make IACP deployable locally and to Cloud Run staging, with security gates and operational validation for the key user roles.

**Sprint Focus Roles:**
- Public Portal operational role: `Attorney`
- Private Portal operational role: `OALJ Docket Clerk`

### Sprint 2 Outcomes

- Local environment starts reliably for frontend, backend, and database.
- Cloud Run staging deployment works for the active frontend and backend paths.
- CI/CD enforces build, test, and security checks before merge.
- Secrets are managed outside the repo with no plaintext credential files in git history.
- Two operational workflows are validated end-to-end:
  - Attorney: New Case and New Filing submission from the public portal
  - OALJ Docket Clerk: Intake queue review, docketing, and assignment workflow from the private portal

### Sprint 2 Planned Work

| Area | Issue | Task | Status |
|---|---|---|---|
| Infra | [#5](https://github.com/rvadera73/IACP-3.0/issues/5) | Set up Alembic + initial migration | Planned |
| Infra | [#13](https://github.com/rvadera73/IACP-3.0/issues/13) | Docker Compose for local dev | Planned |
| Backend | [#6](https://github.com/rvadera73/IACP-3.0/issues/6) | Refactor backend to modular monolith | Planned |
| Backend | [#12](https://github.com/rvadera73/IACP-3.0/issues/12) | Filing API: CRUD endpoints | Planned |
| Security | [#7](https://github.com/rvadera73/IACP-3.0/issues/7) | Implement Google OAuth 2.0 backend | Planned |
| Security | [#8](https://github.com/rvadera73/IACP-3.0/issues/8) | Set up PyCasbin RBAC | Planned |
| DevSecOps | [#14](https://github.com/rvadera73/IACP-3.0/issues/14) | CI pipeline: lint + test on PR | Planned |
| DevSecOps | [#15](https://github.com/rvadera73/IACP-3.0/issues/15) | Unit tests for filing API + OAuth + RBAC | Planned |
| Cleanup | [#2](https://github.com/rvadera73/IACP-3.0/issues/2) | Remove stale references and normalize active runtime paths | Planned |

### Sprint 2 Acceptance Criteria

1. Local deployment
- `docker compose up` brings up the active app stack successfully.
- Database setup is migration-driven and documented.
- A new developer can follow one documented local setup path.

2. Cloud Run staging
- Backend deploys to Cloud Run staging successfully.
- Frontend deploys to Cloud Run staging successfully.
- Health checks pass in staging.
- Staging secrets come from GitHub/GCP configuration, not local files in the repo.

3. Public portal operational validation
- An authenticated `Attorney` can submit a New Case from the public-facing portal.
- An authenticated `Attorney` can submit a New Filing from the public-facing portal.
- Submission creates/updates filing records in the backend and returns confirmation data.

4. Private portal operational validation
- An authenticated `OALJ Docket Clerk` can view the intake queue in the private portal.
- The clerk can docket a pending filing successfully.
- The clerk can complete the judge suggestion/assignment flow successfully, even if the final persistence path is still being closed.

5. DevSecOps baseline
- PR CI runs build, test, and lint.
- Backend smoke test is runnable in CI or staging.
- Secret handling and deployment docs are updated to match the active IACP 3.0 setup.

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

- No major blocker at the moment for the root backend prototype. Backend smoke testing now works using a repo-local Python package path.

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
- Consolidated documentation entry points so `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, and `docs/DATA_MODEL.md` are the canonical design set; root PRD files now redirect instead of duplicating content.
- Updated `README.md` and `START_HERE.md` to reflect the current project state and canonical documentation flow.
- Added a reproducible backend dependency manifest at `backend/requirements.txt` and a non-interactive filing smoke test at `backend/smoke_test.py`.
- Verified the root FastAPI filing flow end-to-end: create filing -> intake queue -> auto-docket -> case creation -> judge suggestions.
- Fixed auto-docketing to generate Phase 1 docket numbers in `YYYYTTTNNNNNN` format and to set docketed/awaiting-assignment state plus BLA statutory deadlines.

### Next Session Priorities

1. Finish issue `#2` by auditing remaining data-model/code references and normalizing any stale paths beyond the PRD/doc cleanup already completed.
2. Continue Phase 1 backend work on Alembic/modularization/OAuth backend now that the filing smoke test is verified.
3. Expand Wave 4 from frontend scaffolding into backend-backed OAuth and filing API coverage.
4. Replace the temporary repo-local package bootstrap with a cleaner project-local Python environment setup if this root backend remains the active runtime path.
5. Use Sprint 2 operational validation roles explicitly: `Attorney` for the public portal and `OALJ Docket Clerk` for the private portal.

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
**Next Update:** After Alembic/modular backend progress or additional issue `#2` cleanup
