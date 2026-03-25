# ⚡ Fast Deployment Guide - 3-5 Minutes

## Quick Start

Run this command and wait 3-5 minutes:

```bash
deploy-backend-now.bat
```

That's it! Your backend will be live.

## Why So Fast?

We're using Cloud Run's direct source deployment instead of the old 15-minute Cloud Build pipeline:

| Old Method (15 min) | New Method (3-5 min) |
|---------------------|----------------------|
| Upload to Cloud Build | Upload directly to Cloud Run |
| Build Docker image | Cloud Run builds internally |
| Push to Container Registry | (skipped) |
| Deploy to Cloud Run | Deploy immediately |
| Wait for cold start | min-instances=1 (always warm) |

## Deployment Options

### Option 1: Deploy Only (Fastest)
```bash
deploy-backend-now.bat
```
- No GitHub push
- Direct deployment
- 3-5 minutes
- Use for quick testing

### Option 2: Deploy + GitHub
```bash
deploy-fast.bat
```
- Pushes to GitHub first
- Then deploys
- 4-6 minutes
- Use for production updates

### Option 3: Local Development (Instant)
```bash
# Terminal 1
cd backend
uvicorn app.main:app --reload --port 8080

# Terminal 2
cd web-frontend
npm run dev
```
- Instant startup
- No deployment needed
- Use for active development

## After Deployment

1. Get your backend URL:
```bash
gcloud run services describe vayudrishti-backend --region=us-central1 --format="value(status.url)" --project=gee-data-490807
```

2. Test the health endpoint:
```bash
curl https://your-backend-url/health
```

3. Update frontend `.env`:
```env
VITE_API_URL=https://your-backend-url
```

## Troubleshooting

### Deployment Fails

Check if Cloud Run API is enabled:
```bash
gcloud services enable run.googleapis.com --project=gee-data-490807
```

Check if you're authenticated:
```bash
gcloud auth list
```

View deployment logs:
```bash
gcloud run services logs read vayudrishti-backend --region=us-central1 --project=gee-data-490807
```

### Build Fails

Test Docker build locally:
```bash
cd backend
docker build -t test .
docker run -p 8080:8080 test
```

Check requirements.txt for issues:
```bash
cd backend
pip install -r requirements.txt
```

### Deployment Succeeds but App Crashes

View live logs:
```bash
gcloud run services logs tail vayudrishti-backend --region=us-central1 --project=gee-data-490807
```

Check environment variables:
```bash
gcloud run services describe vayudrishti-backend --region=us-central1 --format="yaml(spec.template.spec.containers[0].env)" --project=gee-data-490807
```

## Cost Optimization

Current setup costs ~$5-10/month:
- `min-instances=1` keeps one instance always warm ($5-7/month)
- `max-instances=10` allows scaling under load
- 2GB RAM, 2 CPU cores

To reduce costs (but add cold starts):
```bash
# Remove min-instances (free tier eligible)
gcloud run services update vayudrishti-backend --min-instances=0 --region=us-central1 --project=gee-data-490807
```

## Performance Tips

1. **Develop locally first** - Test everything before deploying
2. **Use .gcloudignore** - Already configured to skip large files
3. **Keep Docker image small** - Multi-stage build already optimized
4. **Monitor logs** - Use Cloud Logging to catch issues early

## What Gets Deployed

The `.gcloudignore` file excludes:
- Cache files (`__pycache__`, `*.pyc`)
- Large data files (`*.pkl`, `*.pt`, `*.csv`)
- Test files (`test_*.py`)
- Documentation (`*.md`)
- Virtual environments (`venv/`)

This keeps uploads fast (usually < 50MB).

## Comparison with Other Methods

| Method | Time | Cost | Pros | Cons |
|--------|------|------|------|------|
| **Cloud Run (This)** | 3-5 min | $5-10/mo | Fast, scalable, simple | Requires GCP |
| App Engine | 15 min | $20-50/mo | Managed | Slow, expensive |
| Cloud Build | 10-15 min | $10-20/mo | CI/CD | Complex setup |
| Localhost | Instant | $0 | Free, instant | Not accessible online |

## Next Steps

1. Run `deploy-backend-now.bat`
2. Wait 3-5 minutes
3. Copy the backend URL from output
4. Update `web-frontend/.env` with the URL
5. Test at `https://your-url/health`
6. Done!

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. View logs: `gcloud run services logs read vayudrishti-backend --region=us-central1`
3. Verify billing is enabled: https://console.cloud.google.com/billing
4. Check Cloud Run dashboard: https://console.cloud.google.com/run

## Advanced: Manual Deployment

If the scripts don't work, run manually:

```bash
cd backend

gcloud run deploy vayudrishti-backend \
  --source . \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=10 \
  --timeout=300 \
  --set-env-vars=WAQI_TOKEN=9abbe99f4595fa8a4d20dd26a06db8e375273034,GCP_PROJECT_ID=gee-data-490807,GCP_LOCATION=us-central1,SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY,CORS_ORIGINS=https://vayudrishti-frontend-490807.web.app,http://localhost:5173 \
  --project=gee-data-490807
```

## Summary

- **Fastest**: `deploy-backend-now.bat` (3-5 min)
- **With GitHub**: `deploy-fast.bat` (4-6 min)
- **Development**: `uvicorn app.main:app --reload` (instant)

Choose based on your needs. For quick iterations, use local development. For production updates, use the fast deployment scripts.
