-- Create admin user seed function
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'User % is now an admin', user_email;
END;
$$;

-- Add some sample series and models for testing
DO $$
DECLARE
  apple_brand_id UUID;
  dell_brand_id UUID;
  macbook_series_id UUID;
  xps_series_id UUID;
BEGIN
  -- Get brand IDs
  SELECT id INTO apple_brand_id FROM public.brands WHERE name = 'Apple' LIMIT 1;
  SELECT id INTO dell_brand_id FROM public.brands WHERE name = 'Dell' LIMIT 1;
  
  -- Insert MacBook series
  INSERT INTO public.series (brand_id, name)
  VALUES (apple_brand_id, 'MacBook Air')
  ON CONFLICT DO NOTHING
  RETURNING id INTO macbook_series_id;
  
  IF macbook_series_id IS NULL THEN
    SELECT id INTO macbook_series_id FROM public.series WHERE brand_id = apple_brand_id AND name = 'MacBook Air';
  END IF;
  
  -- Insert XPS series
  INSERT INTO public.series (brand_id, name)
  VALUES (dell_brand_id, 'XPS')
  ON CONFLICT DO NOTHING
  RETURNING id INTO xps_series_id;
  
  IF xps_series_id IS NULL THEN
    SELECT id INTO xps_series_id FROM public.series WHERE brand_id = dell_brand_id AND name = 'XPS';
  END IF;
  
  -- Insert sample MacBook models
  INSERT INTO public.models (series_id, name, base_price, active)
  VALUES 
    (macbook_series_id, 'MacBook Air M1 2020', 55000.00, true),
    (macbook_series_id, 'MacBook Air M2 2022', 75000.00, true)
  ON CONFLICT DO NOTHING;
  
  -- Insert sample Dell XPS models
  INSERT INTO public.models (series_id, name, base_price, active)
  VALUES 
    (xps_series_id, 'XPS 13 9310', 45000.00, true),
    (xps_series_id, 'XPS 15 9520', 65000.00, true)
  ON CONFLICT DO NOTHING;
  
  -- Add more series for Apple
  INSERT INTO public.series (brand_id, name)
  VALUES 
    (apple_brand_id, 'MacBook Pro'),
    (apple_brand_id, 'iMac')
  ON CONFLICT DO NOTHING;
  
  -- Add more series for Dell
  INSERT INTO public.series (brand_id, name)
  VALUES 
    (dell_brand_id, 'Inspiron'),
    (dell_brand_id, 'Latitude')
  ON CONFLICT DO NOTHING;
END $$;
