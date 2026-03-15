# GitHub Actions Secrets Setup

## Required Secrets

Go to: **https://github.com/rvadera73/IACP-2.1/settings/secrets/actions**

Add these **2 repository secrets**:

### 1. GCP_SA_KEY

**Name**: `GCP_SA_KEY`

**Value**: Copy the entire content of `GCP_SA_KEY.txt` (the JSON service account key)

To get the value:
```bash
# Option 1: Copy from file
cat GCP_SA_KEY.txt | clip    # Windows
cat GCP_SA_KEY.txt | pbcopy  # macOS

# Option 2: Open file and copy all content
```

The value should be a JSON that looks like:
```json
{
  "type": "service_account",
  "project_id": "gen-lang-client-0565298632",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  ...
}
```

### 2. GEMINI_API_KEY

**Name**: `GEMINI_API_KEY`

**Value**: Get your API key from https://aistudio.google.com/apikey

---

## That's It!

Once these 2 secrets are added, the GitHub Actions workflow will automatically deploy on every push to `main`.

### Manual Trigger

1. Go to: https://github.com/rvadera73/IACP-2.1/actions/workflows/deploy-cloudrun.yml
2. Click **"Run workflow"**
3. Select `main` branch
4. Click **"Run workflow"**

### Expected Output

```
✅ Deployment Successful!
==========================================
Service: iacp-2-1
Region: us-central1
Project: gen-lang-client-0565298632
URL: https://iacp-2-1-<random-id>-uc.a.run.app
```
