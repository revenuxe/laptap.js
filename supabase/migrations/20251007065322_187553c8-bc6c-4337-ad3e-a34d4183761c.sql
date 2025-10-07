-- Fix RLS policies for sell_requests to allow admins full access
DROP POLICY IF EXISTS "Admins can manage all sell requests" ON public.sell_requests;

-- Create separate policies for each operation for admins
CREATE POLICY "Admins can select all sell requests"
ON public.sell_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert all sell requests"
ON public.sell_requests
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all sell requests"
ON public.sell_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all sell requests"
ON public.sell_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));