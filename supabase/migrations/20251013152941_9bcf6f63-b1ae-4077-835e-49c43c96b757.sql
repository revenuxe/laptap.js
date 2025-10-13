-- Fix security warnings by properly recreating functions with triggers
DROP TRIGGER IF EXISTS brands_auto_slug ON public.brands;
DROP TRIGGER IF EXISTS series_auto_slug ON public.series;
DROP FUNCTION IF EXISTS auto_generate_brand_slug();
DROP FUNCTION IF EXISTS auto_generate_series_slug();
DROP FUNCTION IF EXISTS generate_slug(TEXT);

-- Recreate functions with proper search_path
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$;

CREATE OR REPLACE FUNCTION auto_generate_brand_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION auto_generate_series_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER brands_auto_slug
BEFORE INSERT OR UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION auto_generate_brand_slug();

CREATE TRIGGER series_auto_slug
BEFORE INSERT OR UPDATE ON public.series
FOR EACH ROW
EXECUTE FUNCTION auto_generate_series_slug();