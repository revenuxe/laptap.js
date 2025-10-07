-- Add SELECT policy for pickups table so users can view their own pickup status
CREATE POLICY "Users can view own pickups"
ON public.pickups
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.sell_requests
    WHERE sell_requests.id = pickups.sell_request_id
      AND sell_requests.user_id = auth.uid()
  )
);