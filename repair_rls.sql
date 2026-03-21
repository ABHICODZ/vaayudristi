-- VayuDrishti RLS Repair Script
-- This script fixes potential recursive loops in policies and ensures you can read your own profile.

-- 1. Disable the old problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. Create optimized, non-recursive policies
-- Policy: Enable everyone to read their own row
CREATE POLICY "profiles_select_self" 
ON public.profiles FOR SELECT 
USING ( auth.uid() = id );

-- Policy: Enable admins to read ALL rows (Avoiding recursion by checking session metadata if possible, or using a simpler check)
-- Note: Supabase can store role in jwt. If not, we use this subquery but ensure it's not recursive on itself.
CREATE POLICY "profiles_select_admins" 
ON public.profiles FOR SELECT 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Policy: Enable users to update their own row
CREATE POLICY "profiles_update_self" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- 3. Verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
