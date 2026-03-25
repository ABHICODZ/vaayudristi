@echo off
echo ========================================
echo VayuDrishti Production Deployment
echo ========================================
echo.

echo [1/4] Deploying Backend to Cloud Run...
echo.

cd backend

gcloud run deploy vayudrishti-backend ^
  --source . ^
  --region us-central1 ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 2Gi ^
  --cpu 2 ^
  --port 8080 ^
  --project gee-data-490807 ^
  --timeout 300 ^
  --max-instances 10 ^
  --min-instances 1 ^
  --set-env-vars "WAQI_TOKEN=9abbe99f4595fa8a4d20dd26a06db8e375273034,GCP_PROJECT_ID=gee-data-490807,GCP_LOCATION=us-central1,SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY,VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY,DATABASE_URL=postgresql://postgres:Abhinav%%400719w@db.tmavkmymbdcmugunjtle.supabase.co:5432/postgres"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend deployment failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo Backend deployed successfully!
echo URL: https://vayudrishti-backend-906923550075.us-central1.run.app
echo ========================================
echo.

echo [2/4] Building Frontend...
echo.

cd web-frontend

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    cd ..
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo [3/4] Deploying Frontend to Cloud Run...
echo.

gcloud run deploy vayudrishti-frontend ^
  --source . ^
  --region us-central1 ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --port 80 ^
  --project gee-data-490807 ^
  --set-env-vars "VITE_API_URL=https://vayudrishti-backend-906923550075.us-central1.run.app,VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Frontend deployment failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo [4/4] Deployment Complete!
echo ========================================
echo.
echo Backend:  https://vayudrishti-backend-906923550075.us-central1.run.app
echo Frontend: https://vayudrishti-frontend-906923550075.us-central1.run.app
echo.
echo Testing backend health...
curl https://vayudrishti-backend-906923550075.us-central1.run.app/health
echo.
echo.
echo ========================================
echo All services deployed successfully!
echo ========================================
pause
