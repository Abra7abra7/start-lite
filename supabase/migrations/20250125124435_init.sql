-- Initial migration setup

-- Remove the previous Clerk-specific function if it exists
DROP FUNCTION IF EXISTS public.requesting_user_id();