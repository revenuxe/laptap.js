-- Enable realtime for sell_requests table
ALTER TABLE public.sell_requests REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sell_requests;