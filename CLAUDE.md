# IACP 3.0 — eCourt System for DOL OALJ

## AI Workflow Delegation

**Claude acts as architect and planner. Qwen handles coding and deployment. Aider handles pair programming. Codex handles code review. GitHub Copilot handles DevSecOps and Scrum.**

### Coding Priority: Qwen → Aider → Claude Sonnet

1. **Qwen (Primary Coder/Deployer)**
   - Use the Qwen MCP tool (`mcp__qwen__chat_completion`) for all coding, deployment, and implementation work
   - **Qwen model**: always use `coder-model` as the model parameter
   - Qwen's role: generate code, write configs, debug issues, produce deployment scripts
   - Always try Qwen first for any coding/deployment task

2. **Aider (Secondary Coder/Pair Programmer)**
   - Use the Aider MCP tool (`mcp__aider__aider_code`) for direct code editing with file context
   - **API Key**: Alibaba `sk-f9ddd4e6a4054867884984bc1191f14b`
   - Aider's role: apply code changes directly to files, refactor existing code, fix bugs in-place
   - Accepts `files` (editable), `read_only_files` (context), and a `message` describing the task
   - Use when Qwen is rate-limited or when changes span multiple files and need direct file edits

3. **Claude Sonnet (Fallback Coder)**
   - Use the Agent tool with `model: "sonnet"` for coding tasks
   - Use when Qwen and Aider are unavailable or when the task needs Claude-level reasoning
   - Faster and more cost-effective than Opus for implementation work

### Code Review Priority: Codex → Claude Sonnet

1. **Codex (Primary Reviewer)**
   - Use OpenAI Codex CLI (`codex`) for code review and peer review tasks
   - **Commands**: `codex review` for non-interactive reviews, `codex exec` for non-interactive tasks
   - Run via Bash tool: `codex review "Review the changes in <file/path>"`
   - **Path**: `C:\Program Files\WindowsApps\OpenAI.Codex_26.313.5234.0_x64__2p2nqsd0c76g0\app\resources\codex.exe`

2. **Claude Sonnet (Secondary Reviewer)**
   - Use the Agent tool with `model: "sonnet"` for code review when Codex is unavailable
   - Good for nuanced architectural reviews that need deeper reasoning

### GitHub Copilot (DevSecOps Engineer + Scrum Master)
- **DevSecOps**: owns CI/CD pipelines, GitHub Actions workflows, security scanning, dependency updates
- **Scrum Master**: manages GitHub Issues, tracks sprint progress, updates project boards
- Integrated via GitHub account — use GitHub Copilot for:
  - Writing, reviewing, and optimizing GitHub Actions workflows
  - Security audits on pipeline configurations
  - Creating and updating GitHub Issues for task tracking
  - Sprint planning and backlog grooming via GitHub Projects
- Copilot suggestions should be reviewed by Claude Opus before merging

### Claude Opus (Architect/Planner)
- Claude Opus's role: read codebase, plan approach, orchestrate all agents, make final decisions
- Delegate coding to Qwen → Aider → Claude Sonnet (in priority order)
- Delegate code review to Codex → Claude Sonnet (in priority order)
- Delegate CI/CD and DevSecOps to GitHub Copilot
- Delegate issue tracking and scrum management to GitHub Copilot
- Make final decisions on architecture, approach, and which agent to use for each task

### Shared TODO.md
- **All agents** MUST read `TODO.md` at the start of each session for current project state
- **All agents** MUST update `TODO.md` after completing tasks, adding new tasks, or changing status
- This eliminates the need to feed full conversation history — TODO.md is the source of truth for work state
- Move completed items to the `## Completed` section with a checkmark prefix
- Include assignee, status, and blockers for in-progress items

### Commit Cadence
- **Local commits**: every 30 minutes of active development (minimum)
- **Remote push**: every 4 hours (minimum)
- Agents performing coding work must track time and trigger commits/pushes at these intervals
- Use meaningful commit messages following the project's `<type>(<scope>): <description>` format
- Never skip commits to batch up large changes — small, atomic commits are preferred

### Agent Evolution Policy
- Agent roles evolve based on observed performance and maturity over time
- After significant tasks, note which agent performed well/poorly
- Suggest role adjustments when patterns emerge
- Track: rate limiting issues, code quality, review accuracy, multi-file edit reliability
- Do NOT lock in roles permanently — adapt based on real-world results

---

## Overview

Enterprise eCourt system for DOL OALJ — modern adjudication case management with AI-powered features.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | FastAPI, Python 3.11+, Pydantic |
| Auth | Google OAuth 2.0 |
| Database | PostgreSQL (Cloud SQL) |
| Real-time | Firestore |
| Storage | GCS (documents) |
| AI | Vertex AI (Gemini 2.5) |
| Deployment | Google Cloud Run |

## Development Commands

```bash
# Backend
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
npm install && npm run dev

# Build
npm run build
```

## Key Directories

- `src/` — React frontend
- `backend/` — FastAPI backend
- `database/` — SQL schemas
- `docs/` — Project documentation
- `.github/workflows/` — CI/CD pipelines
