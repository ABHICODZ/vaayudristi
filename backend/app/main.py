from dotenv import load_dotenv; load_dotenv()
import os
import pathlib

# Globally configure Google Application Default Credentials to use our Backend Service Account
# This ensures Vertex AI and Google Earth Engine SDKs authenticate seamlessly without Windows ADC hangs
credentials_path = os.path.join(os.path.dirname(__file__), "services", "ee-credentials.json")
if os.path.exists(credentials_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import api_router
import asyncio

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set up CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Update for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {"message": "Welcome to the Breath-Analyzer API"}

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    # Fire ML inference loop immediately at startup (not lazily on first request)
    @app.on_event("startup")
    async def startup_event():
        try:
            from app.api.endpoints.dashboard import _autonomous_ml_inference_loop
            asyncio.create_task(_autonomous_ml_inference_loop())
            print("[STARTUP] TNN background inference loop launched.")
        except Exception as e:
            print(f"[STARTUP] ML inference loop failed to launch (non-fatal, continuing): {e}")

    # Include routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app

app = create_app()
