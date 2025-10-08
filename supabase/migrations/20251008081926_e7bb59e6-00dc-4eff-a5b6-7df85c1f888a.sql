
-- Fix the foreign key constraint to prevent accidental deletion of sell_requests
-- when models are deleted. Change from CASCADE to RESTRICT.
ALTER TABLE public.sell_requests
DROP CONSTRAINT sell_requests_model_id_fkey;

ALTER TABLE public.sell_requests
ADD CONSTRAINT sell_requests_model_id_fkey
FOREIGN KEY (model_id) REFERENCES public.models(id)
ON DELETE RESTRICT;

-- Also fix the user_id foreign key to reference auth.users instead of profiles
-- to prevent deletion cascades from profiles table
ALTER TABLE public.sell_requests
DROP CONSTRAINT sell_requests_user_id_fkey;

ALTER TABLE public.sell_requests
ADD CONSTRAINT sell_requests_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;
