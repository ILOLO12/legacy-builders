-- Temporary demo photos for the Impact in Action gallery carousel.
-- Titles are prefixed "DEMO —" so they're easy to find and delete once
-- real photos are added (Admin > Galerie, or run the DELETE below).
INSERT INTO public.gallery (title, description, media_url, media_type, display_order)
SELECT * FROM (VALUES
  ('DEMO — Soutien scolaire', 'Photo de démonstration', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', 'image', 100),
  ('DEMO — Sensibilisation santé', 'Photo de démonstration', 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80', 'image', 101),
  ('DEMO — Mentorat jeunesse', 'Photo de démonstration', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', 'image', 102),
  ('DEMO — Distribution de fournitures', 'Photo de démonstration', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 'image', 103),
  ('DEMO — Rassemblement communautaire', 'Photo de démonstration', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 'image', 104)
) AS seed(title, description, media_url, media_type, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery WHERE title LIKE 'DEMO —%');

-- To remove all demo photos later, run:
-- DELETE FROM public.gallery WHERE title LIKE 'DEMO —%';
