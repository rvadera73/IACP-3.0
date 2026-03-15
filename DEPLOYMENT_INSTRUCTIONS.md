# Deployment Guide - IACP 2.1 (Folder-Centric Dashboard)

## ✅ Build Status
The application builds successfully. Built assets are in `dist/` folder.

## Deployment Options

### Option 1: Deploy to Google Cloud Run (Recommended)

#### Prerequisites
1. Enable Cloud Build API:
   ```
   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview?project=gen-lang-client-0991422818
   ```

2. Set your GCP project:
   ```bash
   gcloud config set project gen-lang-client-0991422818
   ```

#### Deploy using Cloud Build (Automated)
```bash
cd "C:\Users\Rahul Vadera\IACP-2.1"

# Submit build to Cloud Build
gcloud builds submit --tag us-central1-docker.pkg.dev/gen-lang-client-0991422818/iacp-2-0-repo/iacp-2-1:latest --region us-central1

# Or use the cloudbuild.yaml configuration
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=us-central1,_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

#### Deploy directly to Cloud Run
```bash
gcloud run deploy iacp-2-1 \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300 \
  --set-env-vars GEMINI_API_KEY=your-api-key-here
```

### Option 2: Manual Docker Deploy

```bash
# Build Docker image locally
docker build -t iacp-2-1 .

# Tag for Google Container Registry
docker tag iacp-2-1 us-central1-docker.pkg.dev/gen-lang-client-0991422818/iacp-2-0-repo/iacp-2-1:latest

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/gen-lang-client-0991422818/iacp-2-0-repo/iacp-2-1:latest

# Deploy to Cloud Run
gcloud run deploy iacp-2-1 \
  --image us-central1-docker.pkg.dev/gen-lang-client-0991422818/iacp-2-0-repo/iacp-2-1:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-api-key-here
```

### Option 3: Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build and preview
npm run build
npm run preview
```

## Environment Variables

Set these in Cloud Run or your `.env.local` file:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `PORT` | Server port (default: 8080) | No |

## Post-Deployment

1. **Access the application**:
   - Cloud Run URL will be provided after deployment
   - Format: `https://iacp-2-1-[hash]-uc.a.run.app`

2. **Test the features**:
   - Navigate to `/` for landing page
   - Login to access UFS Portal
   - View "My Cases" folder-centric dashboard
   - Create new cases or request access

3. **Monitor logs**:
   ```bash
   gcloud run services logs read iacp-2-1 --region us-central1 --limit 50
   ```

## Troubleshooting

### Cloud Build API Not Enabled
```bash
gcloud services enable cloudbuild.googleapis.com --project gen-lang-client-0991422818
```

### Permission Denied
Ensure your account has these roles:
- Cloud Build Service Account
- Cloud Run Admin
- Artifact Registry Writer

### Build Fails
Check `dist/` folder exists and contains:
- `index.html`
- `assets/` folder with JS/CSS

## Current Build Output
```
dist/index.html                   0.42 kB │ gzip:   0.29 kB
dist/assets/index-98rLEViy.css   70.41 kB │ gzip:  12.79 kB
dist/assets/index-BnCWezne.js   778.08 kB │ gzip: 208.32 kB
```

## Features Deployed

### Folder-Centric Dashboard
- ✅ Case folders with minimal info (prefix, deadline, status)
- ✅ Adjudication vs Appeals categorization
- ✅ Grid layout for "My Cases"
- ✅ Notifications panel (bell icon + full view)
- ✅ Case record detail view with table lists
- ✅ Filings & Motions table
- ✅ Parties list
- ✅ Deadlines tracker

### New Case Filing
- ✅ Multi-step form (type selection → details → review)
- ✅ Manual entry with AI form validation
- ✅ Document upload with virus scan simulation
- ✅ Support for all DOL case types (BLA, LHC, PER, DBA, WB, FECA)
- ✅ Support for appeals (BRB, ARB, ECAB)

### Access Request
- ✅ Case search functionality
- ✅ Notice of Appearance upload
- ✅ AI validation of documents
- ✅ Attorney information capture
- ✅ Success confirmation flow

### Mock Data
- ✅ 8 sample cases (5 adjudication, 3 appeals)
- ✅ 8 notifications (urgent, upcoming, resolved)
- ✅ Comprehensive filings for each case
- ✅ Parties and deadlines data
