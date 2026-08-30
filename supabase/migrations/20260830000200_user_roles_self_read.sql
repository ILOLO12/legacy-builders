-- The original "Admins can read user_roles" policy only let admins read
-- the table at all, so non-admin users (e.g. the new 'editor' role) could
-- never read their own role row and the app fell back to "no role" on
-- login, looping back to /admin/login.
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
