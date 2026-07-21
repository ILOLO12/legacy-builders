-- Social media publishing architecture (structure only — no real API
-- connections yet; each platform is wired up to a stub that reports
-- "not configured" until the corresponding secret is added).

CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter')),
  display_name TEXT,
  is_configured BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO public.social_accounts (platform) VALUES
  ('facebook'), ('instagram'), ('linkedin'), ('twitter')
ON CONFLICT (platform) DO NOTHING;

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read social_accounts" ON public.social_accounts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social_accounts" ON public.social_accounts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.social_publish_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  attempt_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_publish_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read social_publish_log" ON public.social_publish_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert social_publish_log" ON public.social_publish_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Automatic retry: every 15 minutes, ping the social-publish function so it can
-- re-attempt any failed rows with attempt_count < 3. Harmless no-op until the
-- function and a real platform integration exist; wrapped so a missing
-- pg_cron/pg_net extension (some plans) doesn't break the rest of the migration.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  CREATE EXTENSION IF NOT EXISTS pg_net;

  PERFORM cron.schedule(
    'social-publish-retry',
    '*/15 * * * *',
    $cron$
    SELECT net.http_post(
      url := 'https://oocccxfmbzkvvwfhpxsf.supabase.co/functions/v1/social-publish',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := '{"mode": "retry"}'::jsonb
    );
    $cron$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron/pg_net not available on this plan — automatic retry skipped, manual retry from the admin panel still works.';
END $$;
