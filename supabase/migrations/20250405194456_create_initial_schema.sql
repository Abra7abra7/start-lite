-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'customer'::text,
  updated_at timestamptz DEFAULT now()
);
-- Allow users to update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user access" ON public.profiles FOR ALL
  USING (auth.uid() = id);
-- Admin access policy using a function to prevent recursion
CREATE POLICY "Allow admin access" ON public.profiles FOR ALL
  USING (public.is_admin());

-- Create products table
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now()
);
-- Allow read access for everyone, restrict write access
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON public.products FOR SELECT
  USING (true);
CREATE POLICY "Allow admin write access" ON public.products FOR ALL
  USING (public.is_admin());

-- Create orders table
CREATE TABLE public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- User might be deleted, keep order history
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending'::text, -- e.g., pending, paid, shipped, cancelled
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
-- Allow users to view/manage their own orders, admins to manage all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user access" ON public.orders FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "Allow admin access" ON public.orders FOR ALL
  USING (public.is_admin());

-- Create order_items table
CREATE TABLE public.order_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, -- If order is deleted, items are deleted
  product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT, -- Don't delete product if it's in an order item
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL CHECK (price_at_purchase >= 0) -- Price when the order was placed
);
-- Inherit access from orders table implicitly via foreign key relationship,
-- but explicit RLS might be needed depending on direct query patterns.
-- For simplicity, let's add basic RLS similar to orders.
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user access based on order" ON public.order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND auth.uid() = orders.user_id));
CREATE POLICY "Allow admin access" ON public.order_items FOR ALL
  USING (public.is_admin());

-- Function to check if the current user is an admin
-- SECURITY DEFINER runs the function with the privileges of the user who created it (superuser),
-- bypassing the RLS checks of the calling user for the SELECT inside the function.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Important to specify schema
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger for orders updated_at
CREATE TRIGGER on_order_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();