-- Donation intents captured from the public Donate page. This does NOT
-- process real payments — no gateway is connected yet (that needs real
-- PayPal/M-Pesa/etc. credentials, a separate decision). It records what a
-- donor pledges (amount, chosen method, contact info) so staff can follow
-- up manually today, and gives a ready data source to wire a real gateway
-- and automatic email receipts into later.
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'mobile_money', 'paypal', 'zelle', 'other')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit donations" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read donations" ON public.donations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update donations" ON public.donations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete donations" ON public.donations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can read donations" ON public.donations
  FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update donations" ON public.donations
  FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete donations" ON public.donations
  FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));
