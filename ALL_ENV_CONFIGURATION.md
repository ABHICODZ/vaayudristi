# 🔐 COMPLETE ENVIRONMENT CONFIGURATION

## Overview
Your VayuDrishti app uses environment variables for configuration. Here's everything you need.

---

## 📁 BACKEND ENVIRONMENT (.env)

**Location**: `backend/.env`

```env
# ============================================
# BACKEND ENVIRONMENT VARIABLES
# ============================================

# ── Air Quality Data API ──
WAQI_TOKEN="9abbe99f4595fa8a4d20dd26a06db8e375273034"

# ── Google Cloud Platform ──
GCP_PROJECT_ID=gee-data-490807
GCP_LOCATION=us-central1

# ── Supabase Authentication & Database ──
SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY

# ── Frontend Supabase Config (for CORS) ──
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY

# ── PostgreSQL Database (Supabase) ──
# Note: @ symbol in password is URL-encoded as %40
DATABASE_URL=postgresql://postgres:Abhinav%400719w@db.tmavkmymbdcmugunjtle.supabase.co:5432/postgres
```

### What Each Variable Does:

| Variable | Purpose | Required |
|----------|---------|----------|
| `WAQI_TOKEN` | World Air Quality Index API token for real-time AQI data | ✅ Yes |
| `GCP_PROJECT_ID` | Google Cloud project for Earth Engine satellite data | ✅ Yes |
| `GCP_LOCATION` | GCP region for deployments | ✅ Yes |
| `SUPABASE_URL` | Supabase project URL for authentication | ✅ Yes |
| `SUPABASE_KEY` | Supabase anonymous key for client auth | ✅ Yes |
| `VITE_SUPABASE_URL` | Frontend Supabase URL (same as above) | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Frontend Supabase key (same as above) | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |

---

## 📁 FRONTEND ENVIRONMENT (.env)

**Location**: `web-frontend/.env`

```env
# ============================================
# FRONTEND ENVIRONMENT VARIABLES
# ============================================

# ── Backend API URL ──
VITE_API_URL=http://127.0.0.1:8080

# ── Supabase Authentication ──
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY
```

### What Each Variable Does:

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_API_URL` | Backend API endpoint (localhost or production) | ✅ Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |

---

## 📁 FRONTEND LOCAL OVERRIDE (.env.local)

**Location**: `web-frontend/.env.local`

```env
# ============================================
# LOCAL DEVELOPMENT OVERRIDES
# ============================================

# ── Backend API URL (Local) ──
VITE_API_URL=http://localhost:8080

# ── Supabase Authentication ──
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY
```

**Note**: `.env.local` overrides `.env` in Vite. Use this for local development.

---

## 🔧 ENVIRONMENT PRIORITY

Vite loads environment files in this order (later overrides earlier):

1. `.env` - Base configuration
2. `.env.local` - Local overrides (gitignored)
3. `.env.production` - Production build
4. `.env.production.local` - Production local overrides

---

## 🚀 DEPLOYMENT CONFIGURATIONS

### For Production (Cloud Run, Vercel, etc.)

#### Backend (.env for production)
```env
WAQI_TOKEN="your_production_token"
GCP_PROJECT_ID=your-production-project
GCP_LOCATION=us-central1
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_production_key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.run.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_key
```

---

## 🔐 SECURITY NOTES

### ⚠️ NEVER COMMIT THESE FILES:
- `backend/.env`
- `web-frontend/.env.local`
- `web-frontend/.env.production.local`

### ✅ SAFE TO COMMIT:
- `backend/.env.example` (template only)
- `web-frontend/.env.example` (template only)

### 🛡️ CURRENT SECURITY STATUS:

**⚠️ WARNING**: Your current `.env` files contain REAL credentials!

**Exposed in this conversation:**
- Supabase URL: `https://tmavkmymbdcmugunjtle.supabase.co`
- Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Database Password: `Abhinav@0719w`
- WAQI Token: `9abbe99f4595fa8a4d20dd26a06db8e375273034`

**RECOMMENDED ACTIONS:**
1. ✅ Keep `.env` files in `.gitignore` (already done)
2. ⚠️ Consider rotating Supabase keys if this is production
3. ⚠️ Consider rotating database password
4. ⚠️ Consider getting new WAQI token if compromised
5. ✅ Use environment variables in CI/CD (not committed files)

---

## 📝 HOW TO USE

### For Local Development:

1. **Backend**:
   ```bash
   cd backend
   # .env is already configured
   python -m uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd web-frontend
   # .env and .env.local are already configured
   npm run dev
   ```

### For Production Deployment:

1. **Set environment variables in your hosting platform**:
   - Cloud Run: Use `gcloud run deploy --set-env-vars`
   - Vercel: Use dashboard or `vercel env add`
   - Railway: Use dashboard environment variables
   - Heroku: Use `heroku config:set`

2. **Never deploy with .env files committed**

---

## 🔍 CHECKING YOUR ENVIRONMENT

### Backend:
```bash
cd backend
python -c "from app.core.config import settings; print(settings.SUPABASE_URL)"
```

### Frontend:
```bash
cd web-frontend
npm run dev
# Check browser console: console.log(import.meta.env.VITE_API_URL)
```

---

## 🆘 TROUBLESHOOTING

### Backend can't connect to database:
- Check `DATABASE_URL` format
- Verify password is URL-encoded (`@` → `%40`)
- Test connection: `psql $DATABASE_URL`

### Frontend can't reach backend:
- Check `VITE_API_URL` matches backend port
- Verify backend is running: `curl http://localhost:8080/docs`
- Check CORS settings in backend

### Supabase auth not working:
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase dashboard for project status
- Verify RLS policies in Supabase

### WAQI API errors:
- Verify `WAQI_TOKEN` is valid
- Check rate limits: https://aqicn.org/api/
- Test token: `curl "https://api.waqi.info/feed/delhi/?token=YOUR_TOKEN"`

---

## 📋 QUICK COPY-PASTE

### Create backend/.env:
```bash
cat > backend/.env << 'EOF'
WAQI_TOKEN="9abbe99f4595fa8a4d20dd26a06db8e375273034"
GCP_PROJECT_ID=gee-data-490807
GCP_LOCATION=us-central1
SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY
DATABASE_URL=postgresql://postgres:Abhinav%400719w@db.tmavkmymbdcmugunjtle.supabase.co:5432/postgres
EOF
```

### Create web-frontend/.env:
```bash
cat > web-frontend/.env << 'EOF'
VITE_API_URL=http://127.0.0.1:8080
VITE_SUPABASE_URL=https://tmavkmymbdcmugunjtle.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYXZrbXltYmRjbXVndW5qdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzAyMDYsImV4cCI6MjA4OTYwNjIwNn0.BEr2krViE54HjVtmm-WD6KV7cIcDQMOSmM-VyjiH7cY
EOF
```

---

## ✅ CURRENT STATUS

Your environment is **FULLY CONFIGURED** and working:

- ✅ Backend `.env` exists and valid
- ✅ Frontend `.env` exists and valid
- ✅ Frontend `.env.local` exists and valid
- ✅ All credentials are set
- ✅ Servers are running
- ✅ API connections working

**You're ready to go!** 🚀

Open http://localhost:5174 to test your app.
