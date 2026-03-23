# IACP 3.0

Intelligent Adjudicatory Case Portal for the U.S. Department of Labor Office of Administrative Law Judges.

This repository currently contains:
- a Vite/React frontend prototype and integration layer
- a FastAPI backend prototype
- seed data and local database assets
- planning, architecture, and sprint documentation

## Canonical Documentation

The canonical product and technical references live under `docs/`.

| Topic | Canonical Document |
|---|---|
| Product requirements | `docs/PRD.md` |
| System architecture | `docs/ARCHITECTURE.md` |
| Architecture decisions | `docs/DECISIONS.md` |
| Domain data model | `docs/DATA_MODEL.md` |
| Phase 1 plan | `docs/PHASE1_IMPLEMENTATION_PLAN.md` |

Root-level status reports and wave summaries should be treated as historical execution notes unless they explicitly say otherwise.

## Current Project State

- Phase 1 backend stabilization is underway
- Wave 2 frontend/API integration has been completed for the current React surfaces
- Wave 4 frontend work is partially complete through the public filing flow and demo auth UI
- Backend runtime smoke testing is still blocked until Python dependencies are installed locally

## Local Development

### Frontend

```bash
npm install
npm run dev
```

### Backend

Install the Python dependencies for the backend environment first, then run the FastAPI app from `backend/`.

## Where To Start

- Read `todo.md` first for active sprint status and next-session priorities
- Use `docs/PRD.md` for requirements
- Use `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, and `docs/DATA_MODEL.md` for design truth
- Use `START_HERE.md` for a short repo navigation guide
