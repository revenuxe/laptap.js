-- Add slug columns to brands and series tables for SEO-friendly URLs
ALTER TABLE public.brands 
ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE public.series 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$;

-- Update existing brands with slugs
UPDATE public.brands
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Update existing series with slugs
UPDATE public.series
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_idx ON public.brands(slug);
CREATE UNIQUE INDEX IF NOT EXISTS series_slug_idx ON public.series(slug);

-- Create trigger to auto-generate slug on insert/update for brands
CREATE OR REPLACE FUNCTION auto_generate_brand_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER brands_auto_slug
BEFORE INSERT OR UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION auto_generate_brand_slug();

-- Create trigger to auto-generate slug on insert/update for series
CREATE OR REPLACE FUNCTION auto_generate_series_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER series_auto_slug
BEFORE INSERT OR UPDATE ON public.series
FOR EACH ROW
EXECUTE FUNCTION auto_generate_series_slug();