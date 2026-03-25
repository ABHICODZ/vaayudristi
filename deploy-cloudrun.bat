@echo off
REM VayuDrishti Cloud Run Deployment Script for Windows
REM This script builds and deploys both backend and frontend to Google Cloud Run

setlocal enabledelayedexpansion

set PROJECT_ID=gee-data-490807
set REGION=us-central1
set BACKEND_SERVICE=vayudrishti-backend
set FRONTEND_SERVICE=vayudrishti-frontend

echo 🚀 Starting VayuDrishti Cloud Run Deployment...
echo Project: %PROJECT_ID%
echo Region: %REGION%

REM Set the project
gcloud config set project %PROJECT_ID%

echo.
echo 📦 Building and deploying backend...
cd backend
gcloud run deploy %BACKEND_SERVICE% --source . --region=%REGION% --platform=managed --allow-unauthenticated --memory=2Gi --cpu=2 --max-instances=10 --set-env-vars="WAQI_TOKEN=9abbe99f4595fa8a4d20dd26a06db8e375273034,GCP_PROJECT_ID=gee-data-490807,GCP_LOCATION=us-central1,SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY"

if errorlevel 1 (
    echo ❌ Backend deployment failed!
    cd ..
    exit /b 1
)

REM Get backend URL
for /f "delims=" %%i in ('gcloud run services describe %BACKEND_SERVICE% --region=%REGION% --format="value(status.url)"') do set BACKEND_URL=%%i
echo ✅ Backend deployed at: %BACKEND_URL%

cd ..

echo.
echo 🎨 Building and deploying frontend...
cd web-frontend
gcloud run deploy %FRONTEND_SERVICE% --source . --region=%REGION% --platform=managed --allow-unauthenticated --memory=512Mi --cpu=1 --max-instances=10 --set-env-vars="VITE_API_URL=%BACKEND_URL%,VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY"

if errorlevel 1 (
    echo ❌ Frontend deployment failed!
    cd ..
    exit /b 1
)

REM Get frontend URL
for /f "delims=" %%i in ('gcloud run services describe %FRONTEND_SERVICE% --region=%REGION% --format="value(status.url)"') do set FRONTEND_URL=%%i
echo ✅ Frontend deployed at: %FRONTEND_URL%

cd ..

echo.
echo 🎉 Deployment Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Backend:  %BACKEND_URL%
echo Frontend: %FRONTEND_URL%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

endlocal
