# IACP 3.0 - Database Migration Guide

**Version:** 3.0  
**Date:** March 22, 2026  
**Database:** PostgreSQL 15 (Cloud SQL)

---

## Quick Start

### Local Development

```bash
# 1. Start PostgreSQL via Docker Compose
docker-compose up -d postgres

# 2. Run migrations
psql -h localhost -U postgres -d iacp -f database/schema.sql

# 3. Seed initial data
psql -h localhost -U postgres -d iacp -f database/seed_data.sql

# 4. Verify
psql -h localhost -U postgres -d iacp -c "SELECT * FROM core.case_type_registry;"
```

### Google Cloud SQL (Production)

```bash
# 1. Connect to Cloud SQL
gcloud sql connect iacp-postgres --user=postgres

# 2. Run migrations
psql -h <CLOUD_SQL_HOST> -U postgres -d iacp -f database/schema.sql

# 3. Seed data (production subset only)
psql -h <CLOUD_SQL_HOST> -U postgres -d iacp -f database/seed_production.sql
```

---

## Schema Files

| File | Purpose |
|------|---------|
| `database/schema.sql` | Complete database schema (all 9 schemas) |
| `database/seed_data.sql` | Development seed data |
| `database/seed_production.sql` | Production seed data (minimal) |
| `database/migrations/` | Incremental migrations (v1.1, v1.2, etc.) |

---

## Database Schemas

| Schema | Tables | Description |
|--------|--------|-------------|
| `core` | person, user, case, case_party, docket_event, case_type_registry | Core case management |
| `filing` | filing, deficiency, validation_result | E-filing intake pipeline |
| `document` | document, document_version | Document storage metadata |
| `scheduling` | hearing, courtroom, court_reporter, hearing_participant | Hearing scheduling |
| `judicial` | bench_memo, decision_draft | Judicial workspace |
| `identity` | role, permission, session | Authentication & authorization |
| `ai` | ai_request, ai_result | AI/ML request tracking |
| `notification` | notification, service_record | Notifications & legal service |
| `reporting` | case_metrics, judge_workload (materialized views) | Analytics & reporting |

---

## Key Features

### Event-Sourced Docket

```sql
-- Docket events are immutable (append-only)
INSERT INTO core.docket_event (case_id, event_type, event_category, title, event_data, actor_id, actor_type)
VALUES 
  ('case-uuid', 'CASE_DOCKETED', 'action', 'Case Docketed', 
   '{"docket_number": "2026BLA00011", "method": "auto"}',
   'user-uuid', 'internal_user');

-- Current case state is derived from events
-- Materialized in core.case table (CQRS pattern)
```

### Party-Centric Model

```sql
-- A person can be a party in multiple cases
INSERT INTO core.person (person_type, first_name, last_name, email, bar_number)
VALUES ('individual', 'John', 'Doe', 'john@example.com', 'MD12345');

-- Link to multiple cases with different roles
INSERT INTO core.case_party (case_id, person_id, role_in_case)
VALUES 
  ('case-1-uuid', 'person-uuid', 'claimant'),
  ('case-2-uuid', 'person-uuid', 'employer');
```

### SLA Tracking

```sql
-- 270-day deadline for BLA cases
UPDATE core.case 
SET statutory_deadline = core.calculate_sla_deadline(case_type, docketed_date),
    sla_status = CASE 
      WHEN CURRENT_DATE > statutory_deadline THEN 'breached'
      WHEN CURRENT_DATE > statutory_deadline - INTERVAL '30 days' THEN 'red'
      WHEN CURRENT_DATE > statutory_deadline - INTERVAL '90 days' THEN 'amber'
      ELSE 'green'
    END
WHERE case_type = 'BLA';
```

---

## Indexes

### Performance Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `case` | `idx_case_docket_number` | Fast docket number lookup |
| `case` | `idx_case_assigned_judge` | Judge workload queries |
| `case` | `idx_case_sla` | SLA deadline monitoring |
| `docket_event` | `idx_docket_event_case_seq` | Event replay per case |
| `document` | `idx_document_case` | Case documents |
| `document` | `idx_document_access_level` | Access control filtering |
| `person` | `idx_person_email` | Deduplication, login |
| `person` | `idx_person_name` | Text search (trigram) |

### Full-Text Search

```sql
-- Case title search
SELECT * FROM core.case 
WHERE title ILIKE '%coal%';

-- Using trigram index (faster)
SELECT * FROM core.case 
WHERE title % 'coal';  -- Fuzzy match
```

---

## Security

### Row-Level Security (RLS)

```sql
-- Enable RLS on sealed documents
ALTER TABLE document.document ENABLE ROW LEVEL SECURITY;

-- Policy: Only authorized users can access sealed documents
CREATE POLICY sealed_documents_policy ON document.document
    FOR ALL
    USING (
        is_sealed = FALSE OR
        EXISTS (
            SELECT 1 FROM core.user u 
            WHERE u.id = current_setting('app.current_user_id')::uuid
            AND u.role IN ('alj', 'chief_judge', 'sys_admin')
        )
    );
```

### Audit Logging

All changes are logged via:
1. `docket_event` table (case actions)
2. `document_version` table (document changes)
3. `identity.session` table (user sessions)

---

## Backup & Recovery

### Daily Backups (Cloud SQL)

```bash
# Automated backups enabled in Cloud SQL
# Retention: 7 days (configurable)

# Manual backup
gcloud sql backups create --instance=iacp-postgres
```

### Point-in-Time Recovery

```bash
# Restore to specific timestamp
gcloud sql instances clone iacp-postgres iacp-postgres-restore \
  --point-in-time 2026-03-22T10:00:00Z
```

---

## Migration Strategy

### v1.0 to v1.1

```sql
-- Example: Add Login.gov support
ALTER TABLE core."user" 
ADD COLUMN logingov_sub VARCHAR(255) UNIQUE;

ALTER TABLE identity.session
ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'google_oauth';
```

### Rollback Plan

```bash
# Each migration has rollback script
database/migrations/v1.1_add_logingov.sql
database/migrations/v1.1_add_logingov_rollback.sql
```

---

## Monitoring

### Slow Query Log

```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Connection Pooling

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check connection by user
SELECT usename, count(*) 
FROM pg_stat_activity 
GROUP BY usename;
```

---

## Troubleshooting

### Common Issues

**Issue:** Duplicate docket numbers
```sql
-- Find duplicates
SELECT docket_number, count(*) 
FROM core.case 
GROUP BY docket_number 
HAVING count(*) > 1;
```

**Issue:** Missing sequence numbers in docket events
```sql
-- Find gaps
SELECT a.case_id, a.sequence_number + 1 as missing_seq
FROM core.docket_event a
LEFT JOIN core.docket_event b 
  ON a.case_id = b.case_id AND a.sequence_number + 1 = b.sequence_number
WHERE b.sequence_number IS NULL
  AND a.sequence_number < (SELECT MAX(sequence_number) FROM core.docket_event WHERE case_id = a.case_id);
```

---

## Next Steps

1. **Review** schema with team
2. **Test** with mock data
3. **Deploy** to staging Cloud SQL
4. **Validate** with prototype screens
5. **Migrate** to production

---

**References:**
- `docs/ARCHITECTURE.md` - Section 5: Data Architecture
- `docs/DATA_MODEL.md` - Complete entity definitions
- `docs/DECISIONS.md` - ADR-002 (PostgreSQL), ADR-005 (Event Sourcing)
