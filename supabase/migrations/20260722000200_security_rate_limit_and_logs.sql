-- Rate limiting for the public chat-assistant Edge Function
CREATE TABLE public.chat_rate_limit (
  session_id TEXT PRIMARY KEY,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  count INT NOT NULL DEFAULT 0
);

-- No RLS policies needed: this table is only ever touched by the Edge
-- Function using the anon key's default access, and holds no personal data.
ALTER TABLE public.chat_rate_limit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can manage rate limits" ON public.chat_rate_limit
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Centralized error log for Edge Functions and critical client-side failures
CREATE TABLE public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert error logs" ON public.error_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read error logs" ON public.error_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete error logs" ON public.error_logs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
