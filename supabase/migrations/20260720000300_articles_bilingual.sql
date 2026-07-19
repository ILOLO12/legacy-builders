-- French text columns for articles/news
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS title_fr text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS excerpt_fr text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content_fr text;

-- Seed the current hardcoded news items, only if the table is still empty
INSERT INTO public.articles (title, title_fr, slug, excerpt, excerpt_fr, published, published_at)
SELECT * FROM (VALUES
  ('Youth Empowerment Program Launch', 'Lancement du Programme d''Autonomisation des Jeunes', 'youth-empowerment-program-launch',
   'MUFO launches a comprehensive youth empowerment program targeting 500 young people in Kinshasa with skills training and mentorship opportunities.',
   'MUFO lance un programme complet d''autonomisation des jeunes ciblant 500 jeunes à Kinshasa avec des formations et du mentorat.',
   true, '2025-02-15T00:00:00Z'::timestamptz),
  ('Community Health Campaign Success', 'Succès de la Campagne de Santé Communautaire', 'community-health-campaign-success',
   'Our community health screening campaign reached over 1,200 families across three provinces, providing essential medical checkups and awareness sessions.',
   'Notre campagne de dépistage a atteint plus de 1 200 familles dans trois provinces, offrant des bilans de santé et des sessions de sensibilisation.',
   true, '2024-11-20T00:00:00Z'::timestamptz),
  ('Back-to-School Supply Distribution', 'Distribution de Fournitures Scolaires', 'back-to-school-supply-distribution',
   'Over 800 children received school supplies, uniforms, and learning materials as part of our annual educational support initiative.',
   'Plus de 800 enfants ont reçu des fournitures scolaires, des uniformes et du matériel pédagogique dans le cadre de notre initiative annuelle.',
   true, '2024-08-10T00:00:00Z'::timestamptz),
  ('MUFO Strategic Partnership Announcement', 'Annonce de Partenariat Stratégique', 'mufo-strategic-partnership-announcement',
   'Muller''s Foundation signs strategic partnerships with international organizations to expand its reach and impact across Central Africa.',
   'La Fondation Muller signe des partenariats stratégiques avec des organisations internationales pour étendre son impact en Afrique centrale.',
   true, '2024-03-05T00:00:00Z'::timestamptz)
) AS seed(title, title_fr, slug, excerpt, excerpt_fr, published, published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.articles);
