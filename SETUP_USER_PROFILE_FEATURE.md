# Quick Setup Guide - User Profile Feature

## Step 1: Switch to Feature Branch
```bash
cd vaayudristi
git checkout feature/user-profile-management
```

## Step 2: Apply Database Migration

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Run this SQL:
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;
```

### Option B: Using psql
```bash
psql -h <your-supabase-host> -U postgres -d postgres -f add_full_name_column.sql
```

## Step 3: Install Dependencies (if needed)
```bash
# Frontend
cd web-frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

## Step 4: Start the Application

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Terminal 2 - Frontend
```bash
cd web-frontend
npm run dev
```

## Step 5: Test the Feature

1. Open browser: `http://localhost:5173`
2. Login with your account
3. Click on your profile avatar (top-right corner)
4. Profile modal should open
5. Update your information:
   - Full Name
   - Age
   - Home Ward
   - Health Condition
6. Click "Save Changes"
7. Verify success message appears
8. Close modal and refresh page
9. Verify changes persisted

## Step 6: Test Password Change

1. Open profile modal
2. Click "Change Password"
3. Enter new password (min 6 characters)
4. Confirm password
5. Click "Update Password"
6. Logout
7. Login with new password

## Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Verify UserProfileModal.tsx exists
- Check App.tsx has the import

### API errors
- Verify backend is running on port 8080
- Check Supabase credentials in .env
- Verify JWT token is valid

### Database errors
- Ensure migration was applied
- Check Supabase connection
- Verify RLS policies are enabled

### Password change fails
- Check Supabase Auth is configured
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Ensure password meets minimum requirements

## Verification Checklist

- [ ] Database migration applied successfully
- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] Profile modal opens on avatar click
- [ ] All form fields are editable
- [ ] Role field is read-only
- [ ] Profile updates save successfully
- [ ] Success message displays
- [ ] Changes persist after refresh
- [ ] Password change works
- [ ] No console errors

## Rollback (if needed)

```bash
# Switch back to main branch
git checkout main

# Optionally remove database column
# Run in Supabase SQL Editor:
# ALTER TABLE public.profiles DROP COLUMN IF EXISTS full_name;
```

## Documentation

- **Frontend Changes:** See `frontend-changes-pavan.md`
- **Backend Changes:** See `backend-changes-pavan.md`
- **Complete Summary:** See `USER_PROFILE_FEATURE_SUMMARY.md`

## Support

If you encounter issues:
1. Check the documentation files
2. Review the code comments
3. Check browser console for errors
4. Check backend logs for API errors
5. Verify database migration was applied

---

**Branch:** feature/user-profile-management  
**Status:** Ready for Testing  
**Last Updated:** 2026-03-25
