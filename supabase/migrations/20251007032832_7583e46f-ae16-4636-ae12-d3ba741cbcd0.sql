-- Create storage buckets for brands, series, and models
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('brand-logos', 'brand-logos', true),
  ('series-images', 'series-images', true),
  ('model-thumbnails', 'model-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for brand logos
CREATE POLICY "Brand logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

CREATE POLICY "Admins can upload brand logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update brand logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete brand logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-logos' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for series images
CREATE POLICY "Series images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'series-images');

CREATE POLICY "Admins can upload series images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'series-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update series images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'series-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete series images"
ON storage.objects FOR DELETE
USING (bucket_id = 'series-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for model thumbnails
CREATE POLICY "Model thumbnails are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'model-thumbnails');

CREATE POLICY "Admins can upload model thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'model-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update model thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'model-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete model thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'model-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));