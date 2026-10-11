-- =============================================================
-- Tables + function the app already references but that were
-- never migrated: donations, page_views, error_logs,
-- social_accounts, social_publish_log, get_analytics_summary().
-- =============================================================

-- ---------- 1) Donations (intents from the Donate page) ----------
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','received','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.donations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a donation intent" ON public.donations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read donations" ON public.donations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete donations" ON public.donations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Editors can read donations" ON public.donations FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update donations" ON public.donations FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid())) WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete donations" ON public.donations FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- ---------- 2) Page views (anonymous visit tracking) ----------
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  session_id text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON public.page_views (created_at);
CREATE INDEX page_views_path_idx ON public.page_views (path);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a page view" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Editors can read page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));

-- ---------- 3) Error logs (written by the edge functions) ----------
CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  message text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX error_logs_created_at_idx ON public.error_logs (created_at);
GRANT INSERT ON public.error_logs TO anon, authenticated;
GRANT SELECT, DELETE ON public.error_logs TO authenticated;
GRANT ALL ON public.error_logs TO service_role;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
-- The edge functions call the Data API with the public key, so the insert
-- policy has to cover anon. No read or delete for anon: logs stay staff-only.
CREATE POLICY "Edge functions can log errors" ON public.error_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Editors can read error logs" ON public.error_logs FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete error logs" ON public.error_logs FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- ---------- 4) Social accounts (connection cards in the dashboard) ----------
CREATE TABLE public.social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE CHECK (platform IN ('facebook','instagram','linkedin','twitter')),
  is_configured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.social_accounts TO authenticated;
GRANT ALL ON public.social_accounts TO service_role;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Editors can read social accounts" ON public.social_accounts FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Admins can update social accounts" ON public.social_accounts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.social_accounts (platform) VALUES ('facebook'), ('instagram'), ('linkedin'), ('twitter');

-- ---------- 5) Social publish log ----------
CREATE TABLE public.social_publish_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  error_message text,
  attempt_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX social_publish_log_article_id_idx ON public.social_publish_log (article_id);
GRANT INSERT, UPDATE ON public.social_publish_log TO anon;
GRANT SELECT ON public.social_publish_log TO authenticated;
GRANT ALL ON public.social_publish_log TO service_role;
ALTER TABLE public.social_publish_log ENABLE ROW LEVEL SECURITY;
-- The publish function runs with the public key: it needs to insert a row,
-- then update it once the platform answers. It never needs to read logs,
-- and anon gets no read policy, so nothing here is exposed to visitors.
CREATE POLICY "Edge functions can create publish logs" ON public.social_publish_log FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Edge functions can update publish logs" ON public.social_publish_log FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Editors can read publish logs" ON public.social_publish_log FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Admins can delete publish logs" ON public.social_publish_log FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------- 6) Analytics summary (dashboard widget) ----------
CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  IF NOT public.has_editor_access(auth.uid()) THEN
    RAISE EXCEPTION 'Accès réservé aux administrateurs et éditeurs.';
  END IF;

  SELECT json_build_object(
    'total', (SELECT count(*) FROM page_views),
    'today', (SELECT count(*) FROM page_views WHERE created_at >= current_date),
    'this_week', (SELECT count(*) FROM page_views WHERE created_at >= date_trunc('week', now())),
    'this_month', (SELECT count(*) FROM page_views WHERE created_at >= date_trunc('month', now())),
    'this_year', (SELECT count(*) FROM page_views WHERE created_at >= date_trunc('year', now())),
    'daily_series', (
      SELECT coalesce(
        json_agg(json_build_object('day', to_char(d.day, 'YYYY-MM-DD'), 'visitors', d.visitors) ORDER BY d.day),
        '[]'::json
      )
      FROM (
        SELECT gs.day::date AS day,
               (SELECT count(DISTINCT pv.session_id) FROM page_views pv WHERE pv.created_at::date = gs.day::date) AS visitors
        FROM generate_series(current_date - interval '29 days', current_date, '1 day') AS gs(day)
      ) d
    ),
    'top_pages', (
      SELECT coalesce(
        json_agg(json_build_object('path', p.path, 'views', p.views) ORDER BY p.views DESC),
        '[]'::json
      )
      FROM (
        SELECT path, count(*) AS views FROM page_views GROUP BY path ORDER BY count(*) DESC LIMIT 8
      ) p
    ),
    'top_articles', (
      SELECT coalesce(
        json_agg(json_build_object('path', p.path, 'views', p.views) ORDER BY p.views DESC),
        '[]'::json
      )
      FROM (
        SELECT path, count(*) AS views FROM page_views
        WHERE path LIKE '/article/%' OR path LIKE '/news/%'
        GROUP BY path ORDER BY count(*) DESC LIMIT 8
      ) p
    )
  ) INTO result;

  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_analytics_summary() TO authenticated;
GRANT ALL ON FUNCTION public.get_analytics_summary() TO service_role;