-- Editors get scoped access to just the contact_email/contact_phone rows
-- of site_settings (a key-value table), not the rest of site identity
-- (logo, org name, social links) which stays admin-only.
CREATE POLICY "Editors can update contact info" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_editor_access(auth.uid()) AND key IN ('contact_email', 'contact_phone'))
  WITH CHECK (public.has_editor_access(auth.uid()) AND key IN ('contact_email', 'contact_phone'));

CREATE POLICY "Editors can insert contact info" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_editor_access(auth.uid()) AND key IN ('contact_email', 'contact_phone'));
