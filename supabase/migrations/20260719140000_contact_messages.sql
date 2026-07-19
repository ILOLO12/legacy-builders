-- Contact form submissions
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit the public contact form (write-only, no read/update/delete)
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only admins can read or manage submissions
CREATE POLICY "Admins can read contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact_messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
