-- A single, admin-managed source of truth for the valuation journey and offer rules.
CREATE TABLE IF NOT EXISTS public.evaluation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE DEFAULT 'default',
  flow JSONB NOT NULL DEFAULT '{}'::jsonb,
  pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evaluation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Evaluation flow is public"
  ON public.evaluation_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage evaluation settings"
  ON public.evaluation_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.evaluation_settings (key, flow, pricing)
VALUES (
  'default',
  '{
    "windows": {"title":"Confirm your Windows PC configuration","fields":["cpu","generation","ram","storage","screen_size","has_graphics_card"]},
    "mac": {"title":"Confirm your Mac configuration","fields":["cpu","ram","storage","screen_size"]},
    "questions": {
      "switch_on":"Does the device power on?",
      "functionality":"Select every issue that applies",
      "screen_condition":"How is the screen?",
      "physical_condition":"How is the body and casing?",
      "accessories":"Which accessories are included?"
    }
  }'::jsonb,
  '{
    "age_factors":{"0-12":1,"12-24":0.85,"24-36":0.70,"36+":0.50},
    "condition_factors":{"like_new":1,"excellent":0.93,"good":0.82,"average":0.65,"faulty":0.35},
    "screen_factors":{"like_new":1,"excellent":0.98,"good":0.93,"average":0.80,"faulty":0.55},
    "issue_deductions":{"keyboard":0.05,"trackpad":0.03,"battery":0.10,"ports":0.04,"wifi":0.05,"speakers":0.02,"webcam":0.02,"overheating":0.08,"display_flickering":0.07,"hinge":0.05},
    "config_adjustments":{"cpu_i7":0.03,"cpu_i9":0.05,"cpu_m1":0.05,"cpu_m2":0.08,"cpu_m3":0.11,"cpu_m4":0.14,"ram_16gb":0.03,"ram_32gb":0.06,"ram_64gb":0.08,"storage_512_ssd":0.02,"storage_1tb_ssd":0.04,"storage_2tb_ssd":0.06,"has_graphics_card_yes":0.05},
    "minimum_payout":1000,"offer_bonus":500,"maximum_discount":0.70
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Calculate on Postgres so browser code never becomes the source of truth for prices.
CREATE OR REPLACE FUNCTION public.calculate_evaluation_quote(
  _model_id UUID, _answers JSONB
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.evaluation_settings%ROWTYPE; base NUMERIC; price NUMERIC; factor NUMERIC := 1;
  age INTEGER := COALESCE((_answers->>'age_months')::integer, 24);
  issue TEXT; k TEXT; v TEXT; deduction NUMERIC := 0;
BEGIN
  SELECT * INTO s FROM public.evaluation_settings WHERE key = 'default';
  SELECT base_price INTO base FROM public.models WHERE id = _model_id AND active = true;
  IF s.id IS NULL OR base IS NULL THEN RAISE EXCEPTION 'Unable to price this model'; END IF;
  factor := factor * COALESCE((s.pricing->'age_factors'->>CASE WHEN age <= 12 THEN '0-12' WHEN age <= 24 THEN '12-24' WHEN age <= 36 THEN '24-36' ELSE '36+' END)::numeric, 1);
  factor := factor * COALESCE((s.pricing->'condition_factors'->>(_answers->>'physical_condition'))::numeric, 1);
  factor := factor * COALESCE((s.pricing->'screen_factors'->>(_answers->>'screen_condition'))::numeric, 1);
  FOR issue IN SELECT jsonb_array_elements_text(COALESCE(_answers->'functionality_issues','[]'::jsonb)) LOOP
    deduction := deduction + COALESCE((s.pricing->'issue_deductions'->>issue)::numeric, 0);
  END LOOP;
  FOR k, v IN SELECT key, value #>> '{}' FROM jsonb_each(COALESCE(_answers->'config','{}'::jsonb)) LOOP
    factor := factor + COALESCE((s.pricing->'config_adjustments'->>(k || '_' || v))::numeric, 0);
  END LOOP;
  factor := factor * (1 - LEAST(deduction, COALESCE((s.pricing->>'maximum_discount')::numeric, .70)));
  price := GREATEST(round(base * factor), COALESCE((s.pricing->>'minimum_payout')::numeric, 0));
  RETURN jsonb_build_object('standard_price', price, 'offer_price', price + COALESCE((s.pricing->>'offer_bonus')::numeric, 0), 'offer_bonus', COALESCE((s.pricing->>'offer_bonus')::numeric, 0));
END; $$;

GRANT EXECUTE ON FUNCTION public.calculate_evaluation_quote(UUID, JSONB) TO anon, authenticated;
