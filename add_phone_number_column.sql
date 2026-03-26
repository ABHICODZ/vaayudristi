-- Add phone_number and health_condition columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_condition TEXT;

-- Add comments
COMMENT ON COLUMN profiles.phone_number IS 'User phone number for SMS notifications';
COMMENT ON COLUMN profiles.health_condition IS 'User health condition (asthma, copd, heart_disease, respiratory)';
