#!/bin/bash

# Deploy VayuDrishti to GCP Cloud Run

PROJECT_ID="gee-data-490807"
REGION="us-central1"

echo "🚀 Deploying VayuDrishti to GCP Cloud Run..."

# Build and deploy backend
echo "📦 Building backend..."
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/vayudrishti-backend:latest \
  --gcs-source-staging-dir=gs://$PROJECT_ID\_cloudbuild/source \
  backend/

echo "🚀 Deploying backend to Cloud Run..."
gcloud run deploy vayudrishti-backend \
  --image gcr.io/$PROJECT_ID/vayudrishti-backend:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars "WAQI_TOKEN=9abbe99f4595fa8a4d20dd26a06db8e375273034,GCP_PROJECT_ID=gee-data-490807,GCP_LOCATION=us-central1,SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY,VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY"

# Get backend URL
BACKEND_URL=$(gcloud run services describe vayudrishti-backend --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# Build and deploy frontend
echo "📦 Building frontend..."
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/vayudrishti-frontend:latest \
  --gcs-source-staging-dir=gs://$PROJECT_ID\_cloudbuild/source \
  web-frontend/

echo "🚀 Deploying frontend to Cloud Run..."
gcloud run deploy vayudrishti-frontend \
  --image gcr.io/$PROJECT_ID/vayudrishti-frontend:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe vayudrishti-frontend --region $REGION --format 'value(status.url)')
echo "✅ Frontend deployed at: $FRONTEND_URL"

echo ""
echo "🎉 Deployment complete!"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
