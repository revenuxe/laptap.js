-- Create enums only if they don't exist
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM (
    'quoted',
    'pickup_scheduled',
    'picked_up',
    'inspected',
    'payment_processing',
    'paid',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.device_condition AS ENUM (
    'like_new',
    'excellent',
    'good',
    'average',
    'faulty'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Series table
CREATE TABLE IF NOT EXISTS public.series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Models table
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  config_presets JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing rules table
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  age_brackets JSONB DEFAULT '{}'::jsonb,
  condition_factors JSONB DEFAULT '{}'::jsonb,
  accessory_factors JSONB DEFAULT '{}'::jsonb,
  config_premiums JSONB DEFAULT '{}'::jsonb,
  min_payout_floor DECIMAL(10,2),
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sell requests table
CREATE TABLE IF NOT EXISTS public.sell_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model_id UUID REFERENCES public.models(id) NOT NULL,
  age_months INTEGER NOT NULL,
  condition device_condition NOT NULL,
  accessories JSONB DEFAULT '{}'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  estimated_price DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2),
  status order_status DEFAULT 'quoted',
  address TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pickups table
CREATE TABLE IF NOT EXISTS public.pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sell_request_id UUID REFERENCES public.sell_requests(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sell_request_id UUID REFERENCES public.sell_requests(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin notes/audit log table
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
DROP POLICY IF EXISTS "Series are viewable by everyone" ON public.series;
DROP POLICY IF EXISTS "Admins can manage series" ON public.series;
DROP POLICY IF EXISTS "Active models are viewable by everyone" ON public.models;
DROP POLICY IF EXISTS "Admins can manage models" ON public.models;
DROP POLICY IF EXISTS "Pricing rules are viewable by everyone" ON public.pricing_rules;
DROP POLICY IF EXISTS "Admins can manage pricing rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "User roles viewable by admins" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Users can create sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Users can update own sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Admins can manage all sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Admins can manage pickups" ON public.pickups;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage notes" ON public.admin_notes;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for brands
CREATE POLICY "Brands are viewable by everyone"
  ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands"
  ON public.brands FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for series
CREATE POLICY "Series are viewable by everyone"
  ON public.series FOR SELECT USING (true);
CREATE POLICY "Admins can manage series"
  ON public.series FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for models
CREATE POLICY "Active models are viewable by everyone"
  ON public.models FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage models"
  ON public.models FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pricing_rules
CREATE POLICY "Pricing rules are viewable by everyone"
  ON public.pricing_rules FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing rules"
  ON public.pricing_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "User roles viewable by admins"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for sell_requests
CREATE POLICY "Users can view own sell requests"
  ON public.sell_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create sell requests"
  ON public.sell_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sell requests"
  ON public.sell_requests FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all sell requests"
  ON public.sell_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pickups
CREATE POLICY "Admins can manage pickups"
  ON public.pickups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sell_requests
      WHERE sell_requests.id = payments.sell_request_id
      AND sell_requests.user_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_notes
CREATE POLICY "Admins can manage notes"
  ON public.admin_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
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
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories if not exists
INSERT INTO public.categories (name, slug) 
VALUES ('Laptop', 'laptop'), ('Desktop', 'desktop')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample brands
DO $$
DECLARE
  laptop_id UUID;
BEGIN
  SELECT id INTO laptop_id FROM public.categories WHERE slug = 'laptop';
  
  INSERT INTO public.brands (name, category_id) VALUES
    ('Apple', laptop_id),
    ('Dell', laptop_id),
    ('HP', laptop_id),
    ('Lenovo', laptop_id),
    ('Asus', laptop_id),
    ('Acer', laptop_id),
    ('MSI', laptop_id),
    ('Microsoft', laptop_id)
  ON CONFLICT DO NOTHING;
END $$;

-- Insert default global pricing rules if not exists
INSERT INTO public.pricing_rules (is_global, age_brackets, condition_factors, accessory_factors, config_premiums)
SELECT
  true,
  '{"0-3": 0.90, "3-6": 0.80, "6-12": 0.67, "12-24": 0.52, "24+": 0.35}'::jsonb,
  '{"like_new": 0.975, "excellent": 0.90, "good": 0.77, "average": 0.60, "faulty": 0.25}'::jsonb,
  '{"box": 0.05, "bill": 0.03, "charger": 0.04, "original_ram": 0.02, "extra_battery": 0.03}'::jsonb,
  '{"cpu_i3": 0.00, "cpu_i5": 0.08, "cpu_i7": 0.15, "cpu_i9": 0.22, "cpu_m1": 0.18, "cpu_m2": 0.25, "ram_8gb": 0.00, "ram_16gb": 0.08, "ram_32gb": 0.15, "storage_256_ssd": 0.00, "storage_512_ssd": 0.06, "storage_1tb_ssd": 0.12, "gpu_integrated": 0.00, "gpu_discrete": 0.12}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_rules WHERE is_global = true);