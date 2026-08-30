-- Give editors access to contact form submissions (contact_messages),
-- mirroring the admin SELECT/UPDATE/DELETE policies. Deliberately opted
-- into by the client despite these rows containing visitor-submitted
-- PII (name/email/message).
CREATE POLICY "Editors can view contact messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));

CREATE POLICY "Editors can update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));

CREATE POLICY "Editors can delete contact messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));
