# IACP 3.0 - Codex + Qwen Workflow

**Date:** March 23, 2026  
**Status:** ✅ Switching from Aider to OpenAI Codex

---

## 🎯 New Agent Setup

### Backend Agent: OpenAI Codex
**Location:** `C:\Program Files\WindowsApps\OpenAI.Codex_26.313.5234.0_x64__2p2nqsd0c76g0\app\resources\codex.exe`

**Usage:**
```bash
# Full path
"C:\Program Files\WindowsApps\OpenAI.Codex_26.313.5234.0_x64__2p2nqsd0c76g0\app\resources\codex.exe" "task description"

# Or add to PATH for easier use
```

### Frontend Agent: Qwen CLI
**Location:** `C:\Users\Rahul Vadera\AppData\Roaming\npm\qwen`

**Usage:**
```bash
qwen "task description" -y
```

### Planner: Qwen Code (Me)
**Role:** Coordinate tasks, review code, commit to git

---

## 📋 Today's Tasks (Day 2 - Continued)

### For Codex (Backend)

**Read from files:**
- `todo.md` - Task list
- `database/schema.sql` - Database models
- `backend/` - Existing backend code

**Tasks:**
1. Add PostgreSQL database connection
2. Create SQLAlchemy models from schema.sql
3. Add CRUD operations
4. Test backend endpoints

**Command:**
```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
"C:\Program Files\WindowsApps\OpenAI.Codex_26.313.5234.0_x64__2p2nqsd0c76g0\app\resources\codex.exe" "Read todo.md and database/schema.sql. Add PostgreSQL connection to backend. Create models from schema.sql core tables."
```

### For Qwen CLI (Frontend)

**Read from files:**
- `todo.md` - Task list
- `src/hooks/` - New hooks we created
- `src/components/EFSPortal.tsx` - Component to update

**Tasks:**
1. Update EFSPortal.tsx to use hooks
2. Add loading states
3. Add error handling

**Command:**
```bash
cd "C:\Users\Rahul Vadera\IACP-3.0"
qwen "Read todo.md and update EFSPortal.tsx to use the new hooks from src/hooks/" -y
```

---

## 🔄 Workflow

1. **I (Qwen Code) update todo.md** with tasks
2. **Codex reads todo.md** and creates backend code
3. **Qwen CLI reads todo.md** and creates frontend code
4. **I review and commit** all changes
5. **I update todo.md** with progress

---

## ✅ Advantages

| Before (Aider) | Now (Codex + Qwen) |
|----------------|-------------------|
| Groq API (rate limited) | OpenAI API (more stable) |
| Token-heavy prompts | File-based context |
| Configuration issues | Simple CLI |
| API key setup needed | Uses OpenAI account |

---

## 🚀 Let's Start!

**First:** Test Codex CLI
**Second:** Backend database setup
**Third:** Frontend EFSPortal update
**Fourth:** Commit and push

---

**Let's build with Codex! 🚀**
