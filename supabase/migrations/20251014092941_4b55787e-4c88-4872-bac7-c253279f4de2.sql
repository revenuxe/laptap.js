-- Add slug columns to brands, series, and models tables
ALTER TABLE brands ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE series ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate slugs for existing brands
UPDATE brands SET slug = generate_slug(name) WHERE slug IS NULL;

-- Generate slugs for existing series
UPDATE series SET slug = generate_slug(name) WHERE slug IS NULL;

-- Generate slugs for existing models
UPDATE models SET slug = generate_slug(name) WHERE slug IS NULL;

-- Create triggers to auto-generate slugs
CREATE OR REPLACE FUNCTION auto_generate_brand_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_generate_series_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_generate_model_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_brand_slug ON brands;
CREATE TRIGGER trigger_auto_generate_brand_slug
  BEFORE INSERT OR UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_brand_slug();

DROP TRIGGER IF EXISTS trigger_auto_generate_series_slug ON series;
CREATE TRIGGER trigger_auto_generate_series_slug
  BEFORE INSERT OR UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_series_slug();

DROP TRIGGER IF EXISTS trigger_auto_generate_model_slug ON models;
CREATE TRIGGER trigger_auto_generate_model_slug
  BEFORE INSERT OR UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_model_slug();