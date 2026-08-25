CREATE TABLE public.evaluation_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, platform TEXT NOT NULL CHECK (platform IN ('apple', 'windows')),
  brand_ids UUID[] NOT NULL DEFAULT '{}', flow JSONB NOT NULL DEFAULT '{}'::jsonb,
  pricing JSONB NOT NULL DEFAULT '{}'::jsonb, active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evaluation_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evaluation programs are public" ON public.evaluation_programs FOR SELECT USING (true);
CREATE POLICY "Admins manage evaluation programs" ON public.evaluation_programs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.evaluation_programs (name, platform, brand_ids, flow, pricing)
SELECT 'Apple / Mac evaluation', 'apple', array_agg(b.id),
  '{"questions":{"switch_on":"Does your Mac turn on?","functionality":"Select any Mac problems","screen_condition":"What is the Mac screen condition?","physical_condition":"What is the Mac body condition?","accessories":"Mac accessories included"},"enabled_questions":["switch_on","config","functionality","screen_condition","age","physical_condition","accessories"]}'::jsonb,
  s.pricing
FROM public.brands b CROSS JOIN (SELECT pricing FROM public.evaluation_settings WHERE key = 'default') s
WHERE lower(b.name) = 'apple' GROUP BY s.pricing;
INSERT INTO public.evaluation_programs (name, platform, brand_ids, flow, pricing)
SELECT 'Windows laptop evaluation', 'windows', array_agg(b.id),
  '{"questions":{"switch_on":"Does the laptop turn on?","functionality":"Select all Windows laptop problems","screen_condition":"What is the screen condition?","physical_condition":"What is the laptop body condition?","accessories":"Accessories included"},"enabled_questions":["switch_on","config","functionality","screen_condition","age","physical_condition","accessories"]}'::jsonb,
  s.pricing
FROM public.brands b CROSS JOIN (SELECT pricing FROM public.evaluation_settings WHERE key = 'default') s
WHERE lower(b.name) <> 'apple' GROUP BY s.pricing;

CREATE OR REPLACE FUNCTION public.calculate_evaluation_quote(_model_id UUID, _answers JSONB) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.evaluation_programs%ROWTYPE; o public.model_evaluation_overrides%ROWTYPE; rules JSONB; brand UUID; base NUMERIC; price NUMERIC; factor NUMERIC := 1; age INTEGER := COALESCE((_answers->>'age_months')::integer, 24); issue TEXT; k TEXT; v TEXT; deduction NUMERIC := 0;
BEGIN
 SELECT b.id, m.base_price INTO brand, base FROM public.models m JOIN public.series se ON se.id=m.series_id JOIN public.brands b ON b.id=se.brand_id WHERE m.id=_model_id AND m.active=true;
 SELECT * INTO p FROM public.evaluation_programs WHERE active AND brand=ANY(brand_ids) ORDER BY platform='apple' DESC LIMIT 1;
 SELECT * INTO o FROM public.model_evaluation_overrides WHERE model_id=_model_id; IF p.id IS NULL OR base IS NULL THEN RAISE EXCEPTION 'No evaluation program is assigned to this model'; END IF; rules:=p.pricing;
 factor:=factor*COALESCE((rules->'age_factors'->>CASE WHEN age<=12 THEN '0-12' WHEN age<=24 THEN '12-24' WHEN age<=36 THEN '24-36' ELSE '36+' END)::numeric,1)*COALESCE((rules->'condition_factors'->>(_answers->>'physical_condition'))::numeric,1)*COALESCE((rules->'screen_factors'->>(_answers->>'screen_condition'))::numeric,1);
 FOR issue IN SELECT jsonb_array_elements_text(COALESCE(_answers->'functionality_issues','[]'::jsonb)) LOOP deduction:=deduction+COALESCE((rules->'issue_deductions'->>issue)::numeric,0); END LOOP;
 FOR k,v IN SELECT key,value #>> '{}' FROM jsonb_each(COALESCE(_answers->'config','{}'::jsonb)) LOOP factor:=factor+COALESCE((rules->'config_adjustments'->>(k||'_'||v))::numeric,0); END LOOP;
 factor:=factor*(1-LEAST(deduction,COALESCE(o.maximum_discount,(rules->>'maximum_discount')::numeric,.70))); price:=GREATEST(round(base*factor),COALESCE(o.minimum_payout,(rules->>'minimum_payout')::numeric,0)); RETURN jsonb_build_object('standard_price',price,'offer_price',price+COALESCE(o.offer_bonus,(rules->>'offer_bonus')::numeric,0),'offer_bonus',COALESCE(o.offer_bonus,(rules->>'offer_bonus')::numeric,0));
END; $$;
