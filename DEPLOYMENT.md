# Deployment Guide for BreatheSafe

This guide covers deploying the BreatheSafe application using Railway.app (recommended) and other platforms.

## Quick Start with Railway

Railway offers the best developer experience for this ML-heavy application.

### Prerequisites
- Railway account (free tier available: https://railway.app)
- GitHub repository with your code
- Docker configured locally (optional, for testing)

### Step 1: Deploy Database

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Database" → "PostgreSQL"
3. Configure:
   - **Database Name:** `breath_analyzer`
   - **Username:** `postgres`
   - **Keep the auto-generated password** or set your own
4. Note the `DATABASE_URL` from the "Connect" tab

### Step 2: Deploy Redis

1. Click "New" → "Redis"
2. Note the `REDIS_URL` from the "Connect" tab

### Step 3: Deploy Backend

1. Click "New" → "GitHub Repo"
2. Select your GitHub repository
3. Railway auto-detects the `Dockerfile` and builds:
   - Ensure you select the `backend/` directory as root
   - Or configure the build path to `backend/Dockerfile`
4. Set environment variables:
   - `DATABASE_URL`: From PostgreSQL service
   - `REDIS_URL`: From Redis service
   - `ENVIRONMENT`: `production`
   - `PYTHONUNBUFFERED`: `1`

5. Configure deployment:
   - **Memory:** 2GB minimum (PyTorch requires it)
   - **Restart Policy:** Always
   - **Expose Port:** 8000
   - **Health Check:** `GET /health`

### Step 4: Deploy Frontend

1. Go to [Vercel](https://vercel.com) and connect your GitHub repo
2. Select `/web-frontend` as root directory
3. Set environment variable:
   - `VITE_BACKEND_URL`: Your Railway backend URL (e.g., `https://backend-production.railway.app`)
4. Deploy

## Docker Deployment Locally

```bash
# Build and run locally
cd VayuDrishti
docker-compose up --build

# Test the endpoints
curl http://localhost:8000/health
curl http://localhost:5173
```

## Alternative Deployment Platforms

### Option 1: DigitalOcean App Platform
- **Cost:** $12/month
- **Steps:**
  1. Create App → Connect GitHub → Select repo
  2. Add database component: PostgreSQL
  3. Add Redis component
  4. Add web service with Dockerfile
  5. Configure resources: 2GB RAM minimum

### Option 2: AWS (EC2 + ECS)
- **Cost:** ~$10-20/month
- Requires more configuration but most scalable
- Use `Dockerfile` with ECR (Elastic Container Registry)

### Option 3: Self-Hosted on Linode/DigitalOcean Droplet
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repo
git clone https://github.com/yourname/VayuDrishti.git
cd VayuDrishti

# Configure .env file
cp backend/.env.example backend/.env
nano backend/.env  # Edit with your secrets

# Deploy
docker-compose up -d

# Access via http://your_droplet_ip:8000
```

## Environment Variables Reference

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/breath_analyzer` | ✅ |
| `REDIS_URL` | `redis://host:6379/0` | ✅ |
| `ENVIRONMENT` | `production` | ⚠️ |
| `GROQ_API_KEY` | (from Groq) | ⚠️ |
| `GOOGLE_APPLICATION_CREDENTIALS` | (path to JSON) | ⚠️ |
| `LOG_LEVEL` | `INFO` | ❌ |
| `DEBUG` | `false` | ❌ |

## Monitoring & Diagnostics

### Railway Dashboard
- Real-time logs
- CPU/Memory usage
- Deployment history
- Rollback capability

### Check Backend Health
```bash
curl https://your-backend.railway.app/health
```

### View Logs
```bash
# Railway CLI
railway logs

# Docker (local)
docker-compose logs -f backend
```

## Performance Tips

1. **Model Loading:** The A3T-GCN model loads on first request (~3-5 seconds). Consider pre-warming.
2. **Worker Count:** Dockerfile uses 2 workers. Adjust based on RAM:
   - 2GB RAM → 2 workers
   - 4GB RAM → 4 workers
   
3. **Database Optimization:**
   - Create indexes on frequently queried columns
   - Use TimescaleDB's native hypertable compression

4. **Caching:**
   - Route calculations cached in Redis
   - Model predictions cached per segment

## Troubleshooting

### Timeout Errors During Deploy
- **Cause:** PyTorch/GDAL installation takes time
- **Fix:** Increase build timeout in Railway settings (usually auto-resolved)

### Out of Memory
- **Cause:** 2 workers with large model is memory-intensive
- **Fix:** Reduce to 1 worker in `Dockerfile` CMD or upgrade to 4GB RAM plan

### Database Connection Refused
- **Cause:** Database service not healthy
- **Check:** Verify `DATABASE_URL` has correct credentials
- **Wait:** Database initialization takes 30-60 seconds on first start

### Slow Model Loading
- **Expected:** First request takes 3-5 seconds
- **Optimize:** Use health check to pre-warm the model

## Next Steps

1. ✅ Set up monitoring alerts in Railway
2. ✅ Configure SSL/TLS (auto on Railway)
3. ✅ Set up CI/CD pipeline for automated deploys
4. ✅ Monitor costs and scale as needed

## Support

- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com/deployment/
- Issues? Check the logs and verify environment variables
