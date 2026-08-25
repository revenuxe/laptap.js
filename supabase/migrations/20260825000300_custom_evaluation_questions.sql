CREATE TABLE public.evaluation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), program_id UUID NOT NULL REFERENCES public.evaluation_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL, helper_text TEXT, input_type TEXT NOT NULL DEFAULT 'single' CHECK (input_type IN ('single','multiple')),
  options JSONB NOT NULL DEFAULT '[]'::jsonb, sort_order INTEGER NOT NULL DEFAULT 0, active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evaluation_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evaluation questions are public" ON public.evaluation_questions FOR SELECT USING (true);
CREATE POLICY "Admins manage evaluation questions" ON public.evaluation_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
