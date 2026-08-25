-- Model-selection bookings are guest sell orders and must be visible to admins.
ALTER TABLE public.sell_requests
  ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can create sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Admins can insert all sell requests" ON public.sell_requests;

CREATE POLICY "Anyone can create sell orders"
  ON public.sell_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
