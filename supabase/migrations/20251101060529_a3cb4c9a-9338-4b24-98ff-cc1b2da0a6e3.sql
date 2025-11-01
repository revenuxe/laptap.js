-- Add customer_email column to repair_requests table
ALTER TABLE public.repair_requests 
ADD COLUMN IF NOT EXISTS customer_email TEXT;