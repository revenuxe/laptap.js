-- Model prices are no longer entered from the catalog dashboard. Keep the
-- column for the existing evaluation engine, but allow new records to use a
-- neutral default until pricing is configured elsewhere.
ALTER TABLE public.models
  ALTER COLUMN base_price SET DEFAULT 0;
