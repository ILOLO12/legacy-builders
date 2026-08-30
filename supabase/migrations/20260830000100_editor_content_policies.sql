-- Grants editors the same content-management access as admins, scoped to
-- public-facing content tables only. Messages, memberships, analytics,
-- logs, settings, and user_roles remain admin-only (no editor policies
-- added on those tables).
CREATE OR REPLACE FUNCTION public.has_editor_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'editor')
$$;

-- Articles (also needs read access to unpublished/draft rows)
CREATE POLICY "Editors can read all articles" ON public.articles FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update articles" ON public.articles FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete articles" ON public.articles FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Pages
CREATE POLICY "Editors can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update pages" ON public.pages FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid())) WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete pages" ON public.pages FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Team members
CREATE POLICY "Editors can insert team_members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update team_members" ON public.team_members FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete team_members" ON public.team_members FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Activities
CREATE POLICY "Editors can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update activities" ON public.activities FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete activities" ON public.activities FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Events
CREATE POLICY "Editors can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update events" ON public.events FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete events" ON public.events FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Volunteer positions (also needs read access to unpublished/draft rows)
CREATE POLICY "Editors can read all volunteer_positions" ON public.volunteer_positions FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can insert volunteer_positions" ON public.volunteer_positions FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update volunteer_positions" ON public.volunteer_positions FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete volunteer_positions" ON public.volunteer_positions FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Partners
CREATE POLICY "Editors can insert partners" ON public.partners FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update partners" ON public.partners FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete partners" ON public.partners FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Gallery
CREATE POLICY "Editors can insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update gallery" ON public.gallery FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Testimonials
CREATE POLICY "Editors can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));

-- Social accounts (structural config only, no credentials stored here)
CREATE POLICY "Editors can read social_accounts" ON public.social_accounts FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update social_accounts" ON public.social_accounts FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can read social_publish_log" ON public.social_publish_log FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can insert social_publish_log" ON public.social_publish_log FOR INSERT TO authenticated WITH CHECK (public.has_editor_access(auth.uid()));
