-- Grant admin role to admin@laptap.in if the user already exists in auth.users
DO $$
DECLARE
  admin_uid UUID;
BEGIN
  SELECT id INTO admin_uid FROM auth.users WHERE lower(email) = 'admin@laptap.in' LIMIT 1;
  IF admin_uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Update handle_new_user trigger to auto-grant admin role on signup for admin@laptap.in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'admin@laptap.in' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Populate brand logos with high quality SVG URLs
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' WHERE lower(name) = 'apple';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' WHERE lower(name) = 'dell';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' WHERE lower(name) = 'hp';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' WHERE lower(name) = 'lenovo';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' WHERE lower(name) = 'asus';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_Logo.svg' WHERE lower(name) = 'acer';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/3/3a/MSI_logo.svg' WHERE lower(name) = 'msi';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' WHERE lower(name) = 'samsung';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' WHERE lower(name) = 'microsoft';
UPDATE public.brands SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' WHERE lower(name) = 'lg';
