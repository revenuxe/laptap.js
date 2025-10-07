-- Drop the constraint if it exists (ignore error if it doesn't)
ALTER TABLE public.sell_requests DROP CONSTRAINT IF EXISTS sell_requests_user_id_fkey;

-- Add the foreign key constraint
ALTER TABLE public.sell_requests
ADD CONSTRAINT sell_requests_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;