-- Create simple_forms table for quick inquiry forms
CREATE TABLE public.simple_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  selling_type TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.simple_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create simple forms"
  ON public.simple_forms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own simple forms"
  ON public.simple_forms
  FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all simple forms"
  ON public.simple_forms
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_simple_forms_updated_at
  BEFORE UPDATE ON public.simple_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();