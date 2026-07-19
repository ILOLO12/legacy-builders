-- Split activities into timeline entries vs. project highlights, add French text
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'timeline' CHECK (category IN ('timeline', 'project'));
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS title_fr text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS description_fr text;

-- Seed the current hardcoded timeline + project highlights, only if the table is still empty
INSERT INTO public.activities (title, title_fr, description, description_fr, icon, year, category, display_order)
SELECT * FROM (VALUES
  ('Foundation Established', 'Fondation Établie',
   'MUFO was founded in Kinshasa, DR Congo, with a vision to transform communities through structured humanitarian action.',
   'MUFO a été fondée à Kinshasa, en RD Congo, avec la vision de transformer les communautés par une action humanitaire structurée.',
   'Star', 2021, 'timeline', 0),
  ('Educational Support', 'Soutien Éducatif',
   'Launched comprehensive educational programs supporting over 2,000 children with materials, mentorship, and school rehabilitation assessments.',
   'Lancement de programmes éducatifs complets soutenant plus de 2 000 enfants avec du matériel, du mentorat et des évaluations de réhabilitation scolaire.',
   'BookOpen', 2023, 'timeline', 1),
  ('Community Health Campaign', 'Campagne de Santé Communautaire',
   'Deployed health awareness and access programs across underserved regions, reaching thousands of families.',
   'Déploiement de programmes de sensibilisation et d''accès aux soins de santé dans les régions défavorisées, touchant des milliers de familles.',
   'HeartPulse', 2024, 'timeline', 2),
  ('Youth Empowerment Project', 'Projet d''Autonomisation des Jeunes',
   'Initiated skill-building and leadership development for young adults, with pilot programs in entrepreneurship.',
   'Lancement du développement des compétences et du leadership pour les jeunes adultes, avec des programmes pilotes en entrepreneuriat.',
   'Users', 2025, 'timeline', 3),
  ('Education Initiative', 'Initiative Éducative',
   'Structured program delivering measurable impact in communities across the region.',
   'Programme structuré offrant un impact mesurable dans les communautés de la région.',
   'Star', NULL, 'project', 0),
  ('Health Campaign', 'Campagne de Santé',
   'Structured program delivering measurable impact in communities across the region.',
   'Programme structuré offrant un impact mesurable dans les communautés de la région.',
   'Star', NULL, 'project', 1),
  ('Youth Program', 'Programme Jeunesse',
   'Structured program delivering measurable impact in communities across the region.',
   'Programme structuré offrant un impact mesurable dans les communautés de la région.',
   'Star', NULL, 'project', 2)
) AS seed(title, title_fr, description, description_fr, icon, year, category, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.activities);
