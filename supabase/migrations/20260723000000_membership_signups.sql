-- Membership signup requests submitted from the public Membership page
CREATE TABLE IF NOT EXISTS public.membership_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_signups ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Public can submit membership signups'
  ) THEN
    CREATE POLICY "Public can submit membership signups" ON public.membership_signups
      FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Admins can read membership_signups'
  ) THEN
    CREATE POLICY "Admins can read membership_signups" ON public.membership_signups
      FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Admins can delete membership_signups'
  ) THEN
    CREATE POLICY "Admins can delete membership_signups" ON public.membership_signups
      FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
