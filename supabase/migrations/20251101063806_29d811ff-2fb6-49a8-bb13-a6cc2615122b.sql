-- Enable real-time for blogs table
ALTER TABLE public.blogs REPLICA IDENTITY FULL;

-- Add blogs table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;