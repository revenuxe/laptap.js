
-- Restrict pricing_rules access to prevent competitors from copying your pricing strategy
-- Remove public access and only allow authenticated users to read pricing rules
-- Admins can still manage pricing rules

-- First, drop the existing public SELECT policy
DROP POLICY IF EXISTS "Pricing rules are viewable by everyone" ON public.pricing_rules;

-- Create new policy: Only authenticated users can view pricing rules
CREATE POLICY "Authenticated users can view pricing rules"
ON public.pricing_rules
FOR SELECT
TO authenticated
USING (true);

-- Keep admin management policy (already exists)
-- Admins can insert/update/delete pricing rules via "Admins can manage pricing rules" policy
