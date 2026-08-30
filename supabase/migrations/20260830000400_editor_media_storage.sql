-- Editors also need to upload files to the shared 'media' storage bucket
-- (used by ImageUploadField across all editor-accessible sections:
-- Gallery, Articles, Team, Activities, Events, Partners, Testimonials,
-- Volunteer positions). Table-level RLS on those content tables was
-- already scoped to editors; this covers the separate storage layer.
CREATE POLICY "Editors can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_editor_access(auth.uid()));

CREATE POLICY "Editors can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_editor_access(auth.uid()));

CREATE POLICY "Editors can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_editor_access(auth.uid()));
