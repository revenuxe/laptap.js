-- Add Mobile category
INSERT INTO categories (name, slug) 
VALUES ('Mobile', 'mobile')
ON CONFLICT (slug) DO NOTHING;