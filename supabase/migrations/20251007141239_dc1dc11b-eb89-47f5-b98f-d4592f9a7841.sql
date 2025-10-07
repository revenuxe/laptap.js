-- Drop the existing foreign key constraint
ALTER TABLE public.sell_requests 
DROP CONSTRAINT IF EXISTS sell_requests_model_id_fkey;

-- Add the foreign key constraint with CASCADE
ALTER TABLE public.sell_requests 
ADD CONSTRAINT sell_requests_model_id_fkey 
FOREIGN KEY (model_id) 
REFERENCES public.models(id) 
ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_sell_requests_model_id 
ON public.sell_requests(model_id);