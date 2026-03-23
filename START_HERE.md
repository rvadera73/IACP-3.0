# IACP 3.0 Start Here

This file is the quick navigation guide for future sessions.

## Read In This Order

1. `todo.md` for current sprint status, blockers, and next-session priorities.
2. `docs/PRD.md` for product requirements.
3. `docs/ARCHITECTURE.md` for system shape and service boundaries.
4. `docs/DECISIONS.md` for accepted ADRs.
5. `docs/DATA_MODEL.md` for entity definitions and business rules.

## Canonical Docs Rule

The canonical copies for requirements and design documents are:
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/DATA_MODEL.md`

Root-level summaries such as wave reports, setup notes, and implementation summaries are supporting or historical documents, not the source of truth.

## Current State Snapshot

- Wave 2 React Query/API integration is complete for the current frontend surfaces.
- Public filing wizard and demo auth entry points are in place.
- Backend model/schema stabilization for Phase 1 is complete enough to continue with runtime verification.
- Local backend smoke tests still require installation of Python dependencies.

## Recommended Next Work

1. Install backend dependencies and run create -> queue -> docket smoke tests.
2. Finish cleanup for issue `#2` by removing stale references and normalizing older docs/code paths.
3. Continue Wave 4 backend work for OAuth and filing API coverage.
