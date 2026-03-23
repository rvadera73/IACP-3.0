# Wave 1 Tasks - Codex (Backend Focus)

**Date:** March 23, 2026  
**Agent:** OpenAI Codex  
**Focus:** Backend API Enhancement

---

## 🎯 Wave 1 Goal

Enhance backend with production-ready features:
- Google OAuth 2.0 authentication
- AI streaming endpoint (SSE)
- Email service integration
- PostgreSQL migration support

---

## 📋 Tasks

### Task 1: Google OAuth 2.0 Endpoint
**Priority:** P0  
**File:** `backend/services/auth.py` (create)

**Requirements:**
- [ ] Google OAuth 2.0 flow
- [ ] JWT token generation
- [ ] Session management
- [ ] User creation on first login

**Implementation:**
```python
# Create endpoint
POST /api/v1/auth/google

# Request body
{
  "access_token": "google-access-token"
}

# Response
{
  "user_id": "...",
  "token": "jwt-token",
  "role": "..."
}
```

---

### Task 2: AI Streaming Endpoint (SSE)
**Priority:** P0  
**File:** `backend/services/ai_stream.py` (create)

**Requirements:**
- [ ] Server-Sent Events endpoint
- [ ] Stream AI validation results
- [ ] Real-time deficiency detection
- [ ] Progress updates

**Implementation:**
```python
# Create endpoint
GET /api/v1/ai/validate-stream

# Response (SSE)
data: {"progress": 10, "message": "Analyzing document..."}
data: {"progress": 50, "message": "Detecting PII..."}
data: {"progress": 100, "ai_score": 95, "deficiencies": []}
```

---

### Task 3: Email Service Integration
**Priority:** P1  
**File:** `backend/services/email.py` (create)

**Requirements:**
- [ ] SendGrid integration
- [ ] Email templates
- [ ] Deficiency notice emails
- [ ] Hearing notice emails

**Implementation:**
```python
# Create service
def send_deficiency_notice(filing_id, deficiencies):
    # Load template
    # Send via SendGrid
    pass
```

---

### Task 4: PostgreSQL Migration Support
**Priority:** P1  
**File:** `backend/database.py` (update)

**Requirements:**
- [ ] Support both SQLite and PostgreSQL
- [ ] Environment variable configuration
- [ ] Migration scripts
- [ ] Connection pooling

**Implementation:**
```python
# Update database.py
DATABASE_URL = os.getenv("DATABASE_URL")

if "postgresql" in DATABASE_URL:
    # Use PostgreSQL with pooling
    engine = create_engine(DATABASE_URL, pool_size=20)
else:
    # Use SQLite for local
    engine = create_engine(DATABASE_URL)
```

---

## ✅ Definition of Done

- [ ] All 4 tasks complete
- [ ] Tests written for each service
- [ ] API documentation updated
- [ ] Code committed to git
- [ ] Backend still runs without errors

---

## 📞 How to Work

1. **Read context from files:**
   - `todo.md` - Overall tasks
   - `backend/` - Existing code
   - `docs/EXISTING_COMPONENTS_INVENTORY.md` - What exists

2. **Create files as specified above**

3. **Test each service:**
   ```bash
   # Test OAuth
   curl -X POST http://localhost:8000/api/v1/auth/google
   
   # Test AI streaming
   curl -N http://localhost:8000/api/v1/ai/validate-stream
   
   # Test email (mock)
   python backend/test_email.py
   ```

4. **Commit when done:**
   ```bash
   git add -A
   git commit -m "feat: Wave 1 - OAuth, AI streaming, email service"
   git push origin main
   ```

---

**Start with Task 1 (OAuth), then Task 2 (AI streaming), then Task 3 (email), then Task 4 (PostgreSQL)**

Good luck! 🚀
