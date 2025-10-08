
-- Add admin policy for profiles table to allow admins to view all profiles
-- This is necessary for order management in the admin panel
-- The has_role() function ensures only users with admin role in user_roles table can access this

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add admin policy to allow admins to update any profile if needed for customer support
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);
