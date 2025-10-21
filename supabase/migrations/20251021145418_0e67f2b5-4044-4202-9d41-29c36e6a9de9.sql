-- Drop the existing unique constraint on slug alone
DROP INDEX IF EXISTS brands_slug_idx;

-- Create a new unique constraint on slug + category_id combination
-- This allows same brand names in different categories (e.g., Samsung Mobile and Samsung Laptop)
CREATE UNIQUE INDEX brands_slug_category_idx ON brands(slug, category_id);

-- Also update the slug generation to include category for uniqueness
-- But keep it simple - just make sure slug+category combo is unique
COMMENT ON INDEX brands_slug_category_idx IS 'Ensures slug is unique within each category';