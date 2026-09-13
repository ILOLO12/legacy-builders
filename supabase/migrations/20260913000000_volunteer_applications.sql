-- Applications submitted from the public /volontariat page, tied to a
-- specific open position (denormalized title kept as a snapshot so it
-- stays readable even if the position is later edited or removed).
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES public.volunteer_positions(id) ON DELETE SET NULL,
  position_title TEXT,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit volunteer applications" ON public.volunteer_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read volunteer applications" ON public.volunteer_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update volunteer applications" ON public.volunteer_applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete volunteer applications" ON public.volunteer_applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can read volunteer applications" ON public.volunteer_applications
  FOR SELECT TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can update volunteer applications" ON public.volunteer_applications
  FOR UPDATE TO authenticated USING (public.has_editor_access(auth.uid()));
CREATE POLICY "Editors can delete volunteer applications" ON public.volunteer_applications
  FOR DELETE TO authenticated USING (public.has_editor_access(auth.uid()));
