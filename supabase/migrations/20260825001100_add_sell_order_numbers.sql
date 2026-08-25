ALTER TABLE public.sell_requests
  ADD COLUMN IF NOT EXISTS order_number TEXT;

UPDATE public.sell_requests
SET order_number = 'LAP-' || TO_CHAR(COALESCE(created_at, now()), 'YYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 6))
WHERE order_number IS NULL;

CREATE OR REPLACE FUNCTION public.generate_sell_order_number()
RETURNS TEXT
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'LAP-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 6));
$$;

CREATE OR REPLACE FUNCTION public.assign_sell_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_sell_order_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_sell_order_number ON public.sell_requests;
CREATE TRIGGER set_sell_order_number
  BEFORE INSERT ON public.sell_requests
  FOR EACH ROW EXECUTE FUNCTION public.assign_sell_order_number();

CREATE UNIQUE INDEX IF NOT EXISTS sell_requests_order_number_key ON public.sell_requests(order_number);

ALTER TABLE public.sell_requests
  ALTER COLUMN order_number SET NOT NULL;
