CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages"
  ON public.contact_submissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
