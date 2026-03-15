# 🚀 Quick Setup Guide for Cloud Run Deployment

## Required Secrets (same as IACP-2.0)

This repo uses the **exact same secrets and Artifact Registry** as IACP-2.0. 

| Secret Name | Value | Where to get |
|-------------|-------|--------------|
| `GCP_PROJECT_ID` | Your GCP project ID | Same as IACP-2.0 |
| `GCP_REGION` | Deployment region | Same as IACP-2.0 |
| `GCP_SA_KEY` | Service account key JSON | Same as IACP-2.0 |
| `GEMINI_API_KEY` | Your Gemini API key | **Add this one** from https://aistudio.google.com/apikey |

---

## Step-by-Step Setup

### Step 1: Copy 3 Secrets from IACP-2.0

1. Go to **IACP-2.0** → Settings → Secrets and variables → Actions
2. Copy the values of these 3 secrets:
   - `GCP_PROJECT_ID`
   - `GCP_REGION`
   - `GCP_SA_KEY`
3. Go to **IACP-2.1** → Settings → Secrets and variables → Actions
4. Add the same 3 secrets with the same values

### Step 2: Add GEMINI_API_KEY Secret

1. In **IACP-2.1** → Settings → Secrets and variables → Actions
2. Click **"New repository secret"**
3. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key

### Step 3: Deploy!

**That's it!** No need to create Artifact Registry - we're using the same one as IACP-2.0 (`iacp-2-0-repo`).

**Automatic** (on push to main):
```bash
git push origin main
```

**Manual**:
1. Go to: https://github.com/rvadera73/IACP-2.1/actions
2. Click **"Deploy to Google Cloud Run"**
3. Click **"Run workflow"**

Your app will be live at: `https://iacp-2-1-xxxxx-uc.a.run.app`
