@echo off
echo ========================================
echo INSTANT BACKEND DEPLOYMENT
echo No GitHub push - Direct to Cloud Run
echo ========================================
echo.

cd backend

echo Deploying backend (3-5 minutes)...
echo.

gcloud run deploy vayudrishti-backend ^
  --source . ^
  --region=us-central1 ^
  --platform=managed ^
  --allow-unauthenticated ^
  --memory=2Gi ^
  --cpu=2 ^
  --min-instances=1 ^
  --max-instances=10 ^
  --timeout=300 ^
  --set-env-vars=WAQI_TOKEN=9abbe99f4595fa8a4d20dd26a06db8e375273034,GCP_PROJECT_ID=gee-data-490807,GCP_LOCATION=us-central1,SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY,CORS_ORIGINS=https://vayudrishti-frontend-490807.web.app,http://localhost:5173 ^
  --project=gee-data-490807

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Backend is live.
    echo ========================================
    echo.
    gcloud run services describe vayudrishti-backend --region=us-central1 --format="value(status.url)" --project=gee-data-490807
    echo.
) else (
    echo.
    echo FAILED! Check errors above.
    echo.
)

cd ..
pause
