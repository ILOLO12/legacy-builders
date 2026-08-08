-- Volunteer/recruitment positions shown on the public /volontariat page
CREATE TABLE IF NOT EXISTS public.volunteer_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_fr TEXT,
  description TEXT,
  description_fr TEXT,
  criteria TEXT,
  criteria_fr TEXT,
  location TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_positions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_positions' AND policyname = 'Public read published volunteer_positions'
  ) THEN
    CREATE POLICY "Public read published volunteer_positions" ON public.volunteer_positions
      FOR SELECT USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_positions' AND policyname = 'Admins full read volunteer_positions'
  ) THEN
    CREATE POLICY "Admins full read volunteer_positions" ON public.volunteer_positions
      FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_positions' AND policyname = 'Admins can insert volunteer_positions'
  ) THEN
    CREATE POLICY "Admins can insert volunteer_positions" ON public.volunteer_positions
      FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_positions' AND policyname = 'Admins can update volunteer_positions'
  ) THEN
    CREATE POLICY "Admins can update volunteer_positions" ON public.volunteer_positions
      FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_positions' AND policyname = 'Admins can delete volunteer_positions'
  ) THEN
    CREATE POLICY "Admins can delete volunteer_positions" ON public.volunteer_positions
      FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Seed with the 5 open positions visible on the recruitment flyer, as placeholders
-- the user can edit/finalize from Admin -> Volontariat.
INSERT INTO public.volunteer_positions (title_fr, title, description_fr, criteria_fr, location, display_order)
VALUES
  ('Conseiller(ère) Juridique & Institutionnel', 'Legal & Institutional Advisor', 'Appui à la vérification des documents administratifs et à la protection des droits humains.', 'Formation juridique. Rigueur et sens de la confidentialité. Candidatures féminines fortement encouragées.', 'Kinshasa, RDC', 1),
  ('Chargé(e) de Communication & Visibilité', 'Communications & Visibility Officer', 'Contenu à préciser.', 'Contenu à préciser.', 'Kinshasa, RDC', 2),
  ('Chargé(e) de Programmes & Logistique', 'Programs & Logistics Officer', 'Contenu à préciser.', 'Contenu à préciser.', 'Kinshasa, RDC', 3),
  ('Chargé(e) de Développement & Partenariats', 'Development & Partnerships Officer', 'Contenu à préciser.', 'Contenu à préciser.', 'Kinshasa, RDC', 4),
  ('Chargé(e) Administratif(ve) & Secrétariat', 'Administrative & Secretariat Officer', 'Contenu à préciser.', 'Contenu à préciser.', 'Kinshasa, RDC', 5)
ON CONFLICT DO NOTHING;
