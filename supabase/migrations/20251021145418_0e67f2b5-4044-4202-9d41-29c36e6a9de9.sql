-- Drop the existing unique constraint on slug alone
DROP INDEX IF EXISTS brands_slug_idx;

-- Deduplicate any existing brands with matching (slug, category_id) before index creation
DO $$
DECLARE
  dup RECORD;
  keep_id UUID;
BEGIN
  FOR dup IN
    SELECT slug, category_id
    FROM brands
    GROUP BY slug, category_id
    HAVING COUNT(*) > 1
  LOOP
    SELECT id INTO keep_id
    FROM brands
    WHERE slug = dup.slug AND (category_id = dup.category_id OR (category_id IS NULL AND dup.category_id IS NULL))
    ORDER BY created_at ASC
    LIMIT 1;

    UPDATE series
    SET brand_id = keep_id
    WHERE brand_id IN (
      SELECT id FROM brands
      WHERE slug = dup.slug AND (category_id = dup.category_id OR (category_id IS NULL AND dup.category_id IS NULL))
      AND id <> keep_id
    );

    DELETE FROM brands
    WHERE slug = dup.slug AND (category_id = dup.category_id OR (category_id IS NULL AND dup.category_id IS NULL))
    AND id <> keep_id;
  END LOOP;
END $$;

-- Create a new unique constraint on slug + category_id combination
-- This allows same brand names in different categories (e.g., Samsung Mobile and Samsung Laptop)
CREATE UNIQUE INDEX brands_slug_category_idx ON brands(slug, category_id);

-- Also update the slug generation to include category for uniqueness
-- But keep it simple - just make sure slug+category combo is unique
COMMENT ON INDEX brands_slug_category_idx IS 'Ensures slug is unique within each category';