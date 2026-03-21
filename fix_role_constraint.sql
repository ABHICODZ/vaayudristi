-- Fix for Role Constraint
-- The previous constraint was too restrictive: CHECK (role in ('citizen', 'admin'))
-- We need to allow 'officer' as well for the Admin Suite to function.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('citizen', 'admin', 'officer'));

-- Also ensured that the trigger function logic is consistent
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger as $$
BEGIN
  INSERT INTO public.profiles (id, username, role, home_ward)
  VALUES (new.id, new.email, 'citizen', 'Punjabi Bagh'); 
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
