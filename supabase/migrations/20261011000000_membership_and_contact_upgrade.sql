-- Membership form upgrade: new fields, a status pipeline (mirroring
-- donations/volunteer_applications), and CGU acceptance tracking.
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS expertise_field TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'membership_signups_status_check') THEN
    ALTER TABLE public.membership_signups
      ADD CONSTRAINT membership_signups_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Editors/admins can update status (and any field) on membership_signups.
-- Admins already have UPDATE from an earlier migration pattern on similar
-- tables; this table never got one, so add both roles explicitly here.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Admins can update membership_signups'
  ) THEN
    CREATE POLICY "Admins can update membership_signups" ON public.membership_signups
      FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Editors can read membership_signups'
  ) THEN
    CREATE POLICY "Editors can read membership_signups" ON public.membership_signups
      FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'membership_signups' AND policyname = 'Editors can update membership_signups'
  ) THEN
    CREATE POLICY "Editors can update membership_signups" ON public.membership_signups
      FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
  END IF;
END $$;

-- Contact messages: read/reply tracking for the new in-dashboard reply flow.
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS reply_text TEXT;

-- Dedicated, restricted bucket for membership CV uploads — separate from the
-- general `media` bucket (which only admins/editors can write to). Anyone
-- can INSERT a CV (needed for the public signup form), but only admins and
-- editors can read or delete them — CVs are not meant to be publicly listed.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('membership-cv', 'membership-cv', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can upload membership CVs" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'membership-cv');

CREATE POLICY "Admins can read membership CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'membership-cv' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can read membership CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'membership-cv' AND public.has_editor_access(auth.uid()));

CREATE POLICY "Admins can delete membership CVs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'membership-cv' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can delete membership CVs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'membership-cv' AND public.has_editor_access(auth.uid()));
