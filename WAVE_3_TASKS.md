# Wave 3 Tasks - Advanced Features

**Date:** March 23, 2026  
**Agent:** OpenAI Codex / Qwen Code  
**Focus:** Advanced Features & Production Readiness

---

## 🎯 Wave 3 Goal

Add production-ready features:
- RBAC (Role-Based Access Control)
- Advanced AI features
- Performance optimization
- Monitoring & logging
- Security hardening

---

## 📋 5 Tasks

### Task 1: PyCasbin RBAC Implementation (P0)
**File:** `backend/services/rbac.py` (create)

**Requirements:**
- [ ] Install PyCasbin
- [ ] Create RBAC model configuration
- [ ] Define roles and permissions
- [ ] Create permission middleware
- [ ] Test role-based access

**Model Configuration:**
```ini
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
```

**Roles to Implement:**
- `docket_clerk` - Can docket, assign judges
- `legal_assistant` - Can schedule hearings
- `attorney_advisor` - Can draft decisions
- `alj` - Can sign decisions, seal documents
- `board_member` - Can review appeals

---

### Task 2: Advanced AI Features (P1)
**File:** `backend/services/ai_advanced.py` (create)

**Requirements:**
- [ ] Smart judge assignment algorithm
- [ ] Deficiency prediction ML model
- [ ] Case outcome prediction
- [ ] Legal research assistant
- [ ] Citation checker

**Smart Assignment Algorithm:**
```python
def suggest_judge(case_type, office):
    # 40% Workload balance
    # 30% Geographic expertise
    # 20% Case type expertise
    # 10% Rotation fairness
    pass
```

---

### Task 3: Performance Optimization (P1)
**Files:** `backend/core/cache.py`, `src/lib/queryClient.ts`

**Requirements:**
- [ ] Redis caching layer
- [ ] Query optimization
- [ ] Database indexing
- [ ] React Query optimization
- [ ] Bundle size optimization

**Caching Strategy:**
```python
# Redis cache for frequently accessed data
@cache.cached(timeout=300)
def get_case(case_number):
    pass
```

---

### Task 4: Monitoring & Logging (P2)
**File:** `backend/core/logging.py`, `backend/core/monitoring.py`

**Requirements:**
- [ ] Structured logging (JSON)
- [ ] Request/response logging
- [ ] Performance metrics
- [ ] Error tracking
- [ ] Health check endpoints
- [ ] Prometheus metrics

**Logging Configuration:**
```python
import structlog

logger = structlog.get_logger()

logger.info("case_docketed", 
    case_id="2026-BLA-00011",
    user_id="user-123",
    duration_ms=150
)
```

---

### Task 5: Security Hardening (P0)
**File:** `backend/core/security.py`

**Requirements:**
- [ ] Rate limiting
- [ ] CORS hardening
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Input validation
- [ ] Security headers

**Rate Limiting:**
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/filings")
@limiter.limit("10/minute")
async def create_filing(request: Request):
    pass
```

---

## ✅ Definition of Done

- [ ] All 5 tasks complete
- [ ] RBAC working with 8 roles
- [ ] AI features implemented
- [ ] Performance optimized (Redis, indexing)
- [ ] Monitoring dashboard working
- [ ] Security hardened
- [ ] Code committed to git
- [ ] Documentation updated

---

## 📞 How to Work

1. **Read context from files:**
   - `todo.md` - Overall sprint plan
   - `backend/` - Existing backend code
   - `WAVE_1_CODEX.md` - Wave 1 completion
   - `WAVE_2_CODEX_TAKEOVER.md` - Wave 2 status

2. **Start with Task 1** (RBAC), then Task 5 (Security), then Task 2 (AI), then Task 3 (Performance), then Task 4 (Monitoring)

3. **Test each feature:**
   ```bash
   # Test RBAC
   python backend/test_rbac.py
   
   # Test AI features
   python backend/test_ai_advanced.py
   
   # Test performance
   python backend/benchmark.py
   
   # Test security
   python backend/security_scan.py
   ```

4. **Commit when done:**
   ```bash
   git add -A
   git commit -m "feat: Wave 3 - RBAC + Advanced AI + Performance + Monitoring + Security
   
   - Task 1: PyCasbin RBAC implementation (8 roles)
   - Task 2: Advanced AI features (smart assignment, prediction)
   - Task 3: Performance optimization (Redis, indexing)
   - Task 4: Monitoring & logging (structured logging, metrics)
   - Task 5: Security hardening (rate limiting, XSS, CSRF)
   
   All features tested and documented."
   git push origin main
   ```

---

**Start NOW by reading todo.md and backend/, then implement Task 1 (RBAC).**

Good luck! 🚀
