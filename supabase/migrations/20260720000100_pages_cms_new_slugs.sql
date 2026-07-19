-- Empty content rows for newly editable pages (admin overrides start empty,
-- public site falls back to i18n defaults until an admin edits a field)
INSERT INTO public.pages (slug, content) VALUES
  ('home', '{}'::jsonb),
  ('team', '{}'::jsonb),
  ('donate', '{}'::jsonb),
  ('membership', '{}'::jsonb),
  ('contact', '{}'::jsonb),
  ('footer', '{}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
