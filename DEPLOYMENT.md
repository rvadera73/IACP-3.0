# Google Cloud Run Deployment Setup

## Prerequisites

1. **Google Cloud Project** with Cloud Run API enabled
2. **Service Account** with appropriate permissions
3. **GitHub Repository Secrets** configured

## Step 1: Enable Required APIs

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 2: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=$PROJECT_ID

# Grant required permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Generate key file
gcloud iam service-accounts keys create key.json \
  --iam-account=github-deployer@$PROJECT_ID.iam.gserviceaccount.com
```

## Step 3: Configure GitHub Secrets

> **Note**: If you have an existing IACP-2.0 repo with Cloud Run deployment, you can reuse the same secrets.

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID (e.g., `my-project-123`) |
| `GCP_SA_KEY` | Contents of the `key.json` file from Step 2 |

### To get the key content:
```bash
cat key.json | pbcopy  # macOS
# or
cat key.json | clip   # Windows
# or
cat key.json          # Linux, then copy manually
```

### Reusing Secrets from IACP-2.0

If you already have these secrets configured in IACP-2.0:

1. **Repository-level secrets**: Go to IACP-2.0 → Settings → Secrets → Copy values to IACP-2.1
2. **Organization-level secrets**: Already available to all repos in the org
3. **Environment secrets**: Create same environment in IACP-2.1

## Step 4: Push to GitHub

```bash
git add .
git commit -m "ci: add Cloud Run deployment workflow"
git push origin main
```

## Step 5: Monitor Deployment

1. Go to GitHub → Actions tab
2. Click on "Deploy to Google Cloud Run" workflow
3. Watch the deployment progress

## Access Your Deployed App

After successful deployment, the workflow will output your Cloud Run URL:
```
Service URL: https://iacp-portal-xxxxx-uc.a.run.app
```

## Customization Options

### Environment Variables

To add environment variables (like `GEMINI_API_KEY`), update the workflow:

```yaml
- name: Deploy to Cloud Run
  uses: google-github-actions/deploy-cloudrun@v2
  with:
    service: ${{ env.SERVICE_NAME }}
    region: ${{ env.REGION }}
    image: ${{ steps.build.outputs.image }}
    env_vars: |
      GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}
      NODE_ENV=production
```

Then add `GEMINI_API_KEY` to your GitHub secrets.

### Custom Domain

To use a custom domain:

```bash
gcloud run services update-traffic iACP-portal \
  --add-tags=custom-domain \
  --region=us-central1

gcloud run domain-mappings create \
  --service=iACP-portal \
  --domain=your-domain.com \
  --region=us-central1
```

### Scaling Configuration

Edit the workflow flags:

```yaml
flags: |
  --min-instances=1    # Keep 1 instance always running (reduces cold starts)
  --max-instances=10   # Maximum instances for scaling
  --cpu=2              # More CPU for better performance
  --memory=1Gi         # More memory
```

## Troubleshooting

### Build Fails

Check the build logs in GitHub Actions. Common issues:
- Missing `GEMINI_API_KEY` in `.env.local` (create a dummy one for build)
- Node version mismatch (update `Dockerfile` if needed)

### Deployment Fails

Check service account permissions:
```bash
gcloud projects get-iam-policy $PROJECT_ID
```

### Cold Starts

If experiencing cold starts, set `--min-instances=1` in the workflow flags.

## Cost Estimate

Cloud Run pricing (us-central1):
- **Free tier**: 2 million requests/month, 180,000 vCPU-seconds, 360,000 GiB-seconds
- **Typical usage**: ~$5-15/month for low-traffic internal apps
- **With min-instances=1**: ~$20-30/month (always-on instance)

## Security Notes

1. **Never commit** service account keys to the repository
2. Use GitHub Secrets for all sensitive data
3. Rotate service account keys every 90 days
4. Consider using Workload Identity Federation for better security
