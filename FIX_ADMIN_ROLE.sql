-- Run this in Supabase SQL Editor to fix admin role

-- 1. Update the profiles table
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'ilate0344@gmail.com';

-- 2. Update the auth.users metadata (this updates the JWT token)
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'ilate0344@gmail.com';

-- 3. Verify the changes
SELECT id, email, raw_app_meta_data->>'role' as role FROM auth.users WHERE email = 'ilate0344@gmail.com';
SELECT id, username, role FROM profiles WHERE username = 'ilate0344@gmail.com';
