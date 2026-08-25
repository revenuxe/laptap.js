-- Each answer can reduce the quote by a percentage, a fixed rupee amount, or both.
CREATE OR REPLACE FUNCTION public.calculate_evaluation_quote(_model_id UUID, _answers JSONB) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.evaluation_programs%ROWTYPE; ovr public.model_evaluation_overrides%ROWTYPE; rules JSONB; brand UUID; base NUMERIC; price NUMERIC; factor NUMERIC:=1; age INTEGER:=COALESCE((_answers->>'age_months')::integer,24); issue TEXT; k TEXT; v TEXT; deduction NUMERIC:=0; custom_percent NUMERIC:=0; custom_amount NUMERIC:=0;
BEGIN
 SELECT b.id,m.base_price INTO brand,base FROM public.models m JOIN public.series s ON s.id=m.series_id JOIN public.brands b ON b.id=s.brand_id WHERE m.id=_model_id AND m.active=true;
 SELECT * INTO p FROM public.evaluation_programs WHERE active AND brand=ANY(brand_ids) LIMIT 1; SELECT * INTO ovr FROM public.model_evaluation_overrides WHERE model_id=_model_id; IF p.id IS NULL OR base IS NULL THEN RAISE EXCEPTION 'No evaluation program assigned'; END IF; rules:=p.pricing;
 factor:=factor*COALESCE((rules->'age_factors'->>CASE WHEN age<=12 THEN '0-12' WHEN age<=24 THEN '12-24' WHEN age<=36 THEN '24-36' ELSE '36+' END)::numeric,1)*COALESCE((rules->'condition_factors'->>(_answers->>'physical_condition'))::numeric,1)*COALESCE((rules->'screen_factors'->>(_answers->>'screen_condition'))::numeric,1);
 FOR issue IN SELECT jsonb_array_elements_text(COALESCE(_answers->'functionality_issues','[]'::jsonb)) LOOP deduction:=deduction+COALESCE((rules->'issue_deductions'->>issue)::numeric,0); END LOOP;
 FOR k,v IN SELECT key,value #>> '{}' FROM jsonb_each(COALESCE(_answers->'config','{}'::jsonb)) LOOP factor:=factor+COALESCE((rules->'config_adjustments'->>(k||'_'||v))::numeric,0); END LOOP;
 SELECT COALESCE(sum((choice->>'deduction_percent')::numeric),0),COALESCE(sum((choice->>'deduction_amount')::numeric),0) INTO custom_percent,custom_amount FROM public.evaluation_questions q CROSS JOIN LATERAL jsonb_array_elements(q.options) choice WHERE q.program_id=p.id AND q.active AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(COALESCE(_answers->'custom_answers'->q.id::text,'[]'::jsonb)) answer WHERE answer=choice->>'id');
 factor:=factor*(1-LEAST(deduction+custom_percent/100,COALESCE(ovr.maximum_discount,(rules->>'maximum_discount')::numeric,.70))); price:=GREATEST(round(base*factor-custom_amount),COALESCE(ovr.minimum_payout,(rules->>'minimum_payout')::numeric,0)); RETURN jsonb_build_object('standard_price',price,'offer_price',price+COALESCE(ovr.offer_bonus,(rules->>'offer_bonus')::numeric,0),'offer_bonus',COALESCE(ovr.offer_bonus,(rules->>'offer_bonus')::numeric,0));
END; $$;

INSERT INTO public.evaluation_questions (program_id,title,helper_text,input_type,options,sort_order)
SELECT id,'Overall body condition','Choose the closest condition. This is separate from screen condition.','single',
 '[{"id":"like_new","label":"Like new — no dents or visible wear","deduction_percent":0,"deduction_amount":0},{"id":"good","label":"Good — light scratches or normal use","deduction_percent":5,"deduction_amount":0},{"id":"average","label":"Average — visible scratches or small dents","deduction_percent":12,"deduction_amount":0},{"id":"damaged","label":"Damaged — cracks, dents or missing parts","deduction_percent":25,"deduction_amount":0}]'::jsonb,0 FROM public.evaluation_programs;
