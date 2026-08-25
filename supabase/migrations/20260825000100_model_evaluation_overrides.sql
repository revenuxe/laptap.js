CREATE TABLE IF NOT EXISTS public.model_evaluation_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL UNIQUE REFERENCES public.models(id) ON DELETE CASCADE,
  minimum_payout NUMERIC(10,2), offer_bonus NUMERIC(10,2), maximum_discount NUMERIC(5,4),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.model_evaluation_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage model evaluation overrides" ON public.model_evaluation_overrides FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.calculate_evaluation_quote(_model_id UUID, _answers JSONB) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.evaluation_settings%ROWTYPE; o public.model_evaluation_overrides%ROWTYPE; rules JSONB; base NUMERIC; price NUMERIC; factor NUMERIC := 1; age INTEGER := COALESCE((_answers->>'age_months')::integer, 24); issue TEXT; k TEXT; v TEXT; deduction NUMERIC := 0;
BEGIN
  SELECT * INTO s FROM public.evaluation_settings WHERE key = 'default'; SELECT * INTO o FROM public.model_evaluation_overrides WHERE model_id = _model_id; SELECT base_price INTO base FROM public.models WHERE id = _model_id AND active = true;
  IF s.id IS NULL OR base IS NULL THEN RAISE EXCEPTION 'Unable to price this model'; END IF; rules := s.pricing;
  factor := factor * COALESCE((rules->'age_factors'->>CASE WHEN age <= 12 THEN '0-12' WHEN age <= 24 THEN '12-24' WHEN age <= 36 THEN '24-36' ELSE '36+' END)::numeric, 1) * COALESCE((rules->'condition_factors'->>(_answers->>'physical_condition'))::numeric, 1) * COALESCE((rules->'screen_factors'->>(_answers->>'screen_condition'))::numeric, 1);
  FOR issue IN SELECT jsonb_array_elements_text(COALESCE(_answers->'functionality_issues','[]'::jsonb)) LOOP deduction := deduction + COALESCE((rules->'issue_deductions'->>issue)::numeric, 0); END LOOP;
  FOR k, v IN SELECT key, value #>> '{}' FROM jsonb_each(COALESCE(_answers->'config','{}'::jsonb)) LOOP factor := factor + COALESCE((rules->'config_adjustments'->>(k || '_' || v))::numeric, 0); END LOOP;
  factor := factor * (1 - LEAST(deduction, COALESCE(o.maximum_discount, (rules->>'maximum_discount')::numeric, .70))); price := GREATEST(round(base * factor), COALESCE(o.minimum_payout, (rules->>'minimum_payout')::numeric, 0));
  RETURN jsonb_build_object('standard_price', price, 'offer_price', price + COALESCE(o.offer_bonus, (rules->>'offer_bonus')::numeric, 0), 'offer_bonus', COALESCE(o.offer_bonus, (rules->>'offer_bonus')::numeric, 0));
END; $$;
