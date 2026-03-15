# GitHub Secrets Setup Helper

Unfortunately, GitHub Secrets **cannot be copied** from one repo to another - they're encrypted and write-only for security.

## You Must Manually Add These 4 Secrets:

Go to: **https://github.com/rvadera73/IACP-2.1/settings/secrets/actions**

Click **"New repository secret"** for each:

### 1. GCP_PROJECT_ID
**Where to find**: Google Cloud Console
- Go to: https://console.cloud.google.com/home/dashboard
- Copy the Project ID at the top (e.g., `my-project-12345`)

### 2. GCP_REGION
**Where to find**: Cloud Run Console or IACP-2.0 workflow
- Go to: https://console.cloud.google.com/run
- Click on `iacp-2-0` service
- Copy the Region (e.g., `us-central1`, `us-east1`)

OR check the file: `C:\Users\Rahul Vadera\IACP-2.0\.github\workflows\deploy-cloudrun.yml`
Look for the region value (but not the actual secret, just to confirm which region)

### 3. GCP_SA_KEY
**Where to find**: Original key.json file OR create new one

**If you have the original key.json**:
```bash
# Windows PowerShell
Get-Content key.json | Set-Clipboard

# Or on Mac/Linux
cat key.json | pbcopy  # Mac
cat key.json | xclip -selection clipboard  # Linux
```

**If you lost the key, create a new one**:
```bash
# In Cloud Shell
export PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts keys create new-key.json \
  --iam-account=github-deployer@${PROJECT_ID}.iam.gserviceaccount.com

# Display and copy
cat new-key.json | clip  # Windows
```

Copy the **entire JSON** (from `{` to `}`) as the secret value.

### 4. GEMINI_API_KEY
**Where to find**: Google AI Studio
- Go to: https://aistudio.google.com/apikey
- Click **"Create API Key"**
- Copy the key

---

## After Adding All 4 Secrets:

1. Go to: https://github.com/rvadera73/IACP-2.1/actions
2. Click **"Deploy to Google Cloud Run"**
3. Click **"Run workflow"**
4. Wait 3-5 minutes
5. Your app will be live! 🎉

---

## Why This Can't Be Automated:

| Method | Why It Doesn't Work |
|--------|---------------------|
| GitHub API | No endpoint to read secrets (security feature) |
| Workflow | Secrets are masked in logs, can't be exported |
| UI | No "copy" or "export" button (by design) |
| CLI | `gh` CLI doesn't support reading secrets |

**This is a GitHub security feature** - secrets are write-only to prevent accidental exposure.
