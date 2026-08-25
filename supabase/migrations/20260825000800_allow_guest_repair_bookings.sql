-- Customer accounts are no longer part of the booking flow.
ALTER TABLE public.repair_requests
  ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can create repair requests" ON public.repair_requests;

CREATE POLICY "Anyone can create repair requests"
  ON public.repair_requests
  FOR INSERT
  WITH CHECK (true);
