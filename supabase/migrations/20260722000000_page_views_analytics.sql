-- Lightweight page-view tracking for the homemade analytics dashboard
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  session_id TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at);
CREATE INDEX idx_page_views_path ON public.page_views (path);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can record a page view; nobody can read
-- raw rows directly from the client — only through the admin-gated summary function below.
CREATE POLICY "Public can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read page views" ON public.page_views
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Aggregated analytics summary, admin-only.
CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT json_build_object(
    'total', (SELECT COUNT(DISTINCT session_id) FROM public.page_views),
    'today', (SELECT COUNT(DISTINCT session_id) FROM public.page_views WHERE created_at >= date_trunc('day', now())),
    'this_week', (SELECT COUNT(DISTINCT session_id) FROM public.page_views WHERE created_at >= date_trunc('week', now())),
    'this_month', (SELECT COUNT(DISTINCT session_id) FROM public.page_views WHERE created_at >= date_trunc('month', now())),
    'this_year', (SELECT COUNT(DISTINCT session_id) FROM public.page_views WHERE created_at >= date_trunc('year', now())),
    'daily_series', (
      SELECT COALESCE(json_agg(row_to_json(d) ORDER BY d.day), '[]'::json)
      FROM (
        SELECT date_trunc('day', created_at)::date AS day, COUNT(DISTINCT session_id) AS visitors
        FROM public.page_views
        WHERE created_at >= now() - interval '30 days'
        GROUP BY 1
      ) d
    ),
    'top_pages', (
      SELECT COALESCE(json_agg(row_to_json(p)), '[]'::json)
      FROM (
        SELECT path, COUNT(*) AS views
        FROM public.page_views
        GROUP BY path
        ORDER BY views DESC
        LIMIT 5
      ) p
    ),
    'top_articles', (
      SELECT COALESCE(json_agg(row_to_json(a)), '[]'::json)
      FROM (
        SELECT path, COUNT(*) AS views
        FROM public.page_views
        WHERE path LIKE '/news/%'
        GROUP BY path
        ORDER BY views DESC
        LIMIT 5
      ) a
    )
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_analytics_summary() TO authenticated;
