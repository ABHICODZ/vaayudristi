# 🔧 Environment Variables Setup Guide

## 📋 Overview

VayuDrishti requires environment variables for both backend and frontend. I've created template `.env` files for you.

---

## 📁 Files Created

### 1. Backend Environment Variables
**File:** `backend/.env`

### 2. Frontend Environment Variables  
**File:** `web-frontend/.env`

---

## 🔑 Required Variables (Get from Your Friend)

Since your friend has the Supabase account and applied the DB migration, you need these credentials from them:

### **Supabase Credentials:**

Ask your friend to go to:
1. https://app.supabase.com
2. Select the VayuDrishti project
3. Go to **Settings** → **API**
4. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **WAQI Token (Optional but Recommended):**

For real-time air quality data:
1. Go to: https://aqicn.org/api/
2. Sign up for free API token
3. Copy the token

---

## ✏️ How to Fill In the Variables

### **Step 1: Edit Backend .env**

```bash
# Open the file
nano backend/.env
# or
code backend/.env
```

**Replace these values:**
```env
SUPABASE_URL=https://your-actual-project.supabase.co
SUPABASE_KEY=your-actual-anon-key-here
WAQI_TOKEN=your-actual-waqi-token-here
```

### **Step 2: Edit Frontend .env**

```bash
# Open the file
nano web-frontend/.env
# or
code web-frontend/.env
```

**Replace these values:**
```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
VITE_API_URL=http://127.0.0.1:8080
```

---

## 🎯 Quick Setup Checklist

- [ ] Get Supabase URL from friend
- [ ] Get Supabase anon key from friend
- [ ] Update `backend/.env` with Supabase credentials
- [ ] Update `web-frontend/.env` with Supabase credentials
- [ ] (Optional) Get WAQI token and add to `backend/.env`
- [ ] Save both files
- [ ] Don't commit .env files to git (they're in .gitignore)

---

## 🔍 Verify Setup

### **Check Backend .env:**
```bash
cat backend/.env | grep SUPABASE_URL
# Should show: SUPABASE_URL=https://xxxxx.supabase.co
```

### **Check Frontend .env:**
```bash
cat web-frontend/.env | grep VITE_SUPABASE_URL
# Should show: VITE_SUPABASE_URL=https://xxxxx.supabase.co
```

### **Test Backend Connection:**
```bash
cd backend
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); print('✅ Supabase URL:', os.getenv('SUPABASE_URL'))"
```

---

## ⚠️ Important Notes

### **Security:**
- ✅ `.env` files are in `.gitignore` (won't be committed)
- ✅ Never share your `.env` files publicly
- ✅ Never commit `.env` files to git
- ✅ Use different credentials for production

### **Supabase Keys:**
- **anon/public key** - Safe to use in frontend (public)
- **service_role key** - NEVER use in frontend (secret)
- We only use the **anon key** in this project

### **Local Development:**
- Backend runs on: `http://127.0.0.1:8080`
- Frontend runs on: `http://localhost:5173`
- Make sure `VITE_API_URL` points to backend

---

## 🐛 Troubleshooting

### **Error: "Supabase configuration missing"**
- Check if `SUPABASE_URL` and `SUPABASE_KEY` are set in `backend/.env`
- Make sure there are no extra spaces
- Make sure the URL starts with `https://`

### **Error: "Could not validate credentials"**
- Check if Supabase keys are correct
- Ask your friend to verify the keys
- Make sure you're using the **anon key**, not service_role key

### **Error: "Failed to fetch"**
- Check if backend is running on port 8080
- Check if `VITE_API_URL` in frontend .env is correct
- Try: `curl http://localhost:8080/docs`

### **Frontend can't connect to Supabase:**
- Check `VITE_SUPABASE_URL` in `web-frontend/.env`
- Check `VITE_SUPABASE_ANON_KEY` in `web-frontend/.env`
- Restart frontend dev server after changing .env

---

## 📝 Example Values (DO NOT USE THESE)

These are just examples to show the format:

### Backend .env:
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.example-signature-here
WAQI_TOKEN=1234567890abcdef
```

### Frontend .env:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.example-signature-here
VITE_API_URL=http://127.0.0.1:8080
```

---

## 🚀 Next Steps

After setting up environment variables:

1. **Install Dependencies:**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd web-frontend
   npm install
   ```

2. **Start Backend:**
   ```bash
   cd backend
   python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
   ```

3. **Start Frontend:**
   ```bash
   cd web-frontend
   npm run dev
   ```

4. **Test the Application:**
   - Open: http://localhost:5173
   - Login with your account
   - Test the profile feature!

---

## 📞 Need Help?

If you're stuck:
1. Ask your friend for the Supabase credentials
2. Check the troubleshooting section above
3. Verify .env files are in the correct locations
4. Make sure there are no typos in the variable names

---

**Created:** 2026-03-25  
**Status:** Ready to configure  
**Branch:** feature/user-profile-management
