-- DimensionUI: Purchases Table Schema for PayPal Orders & Authorization
-- Supports safe recording of pending PayPal orders and completed captures.

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  capture_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'refunded'
  license_key TEXT,
  license_type TEXT DEFAULT 'Commercial (Unlimited Projects)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast lookups during download verification & dashboard display
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_template_id ON public.purchases(template_id);
CREATE INDEX IF NOT EXISTS idx_purchases_order_id ON public.purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Restrict direct insertion/modification to service_role / server actions only
CREATE POLICY "Server can manage purchases"
  ON public.purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
