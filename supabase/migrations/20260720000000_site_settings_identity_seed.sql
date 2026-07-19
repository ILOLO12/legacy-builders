-- Seed default site identity / contact / footer / social keys (idempotent)
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'MUFO'),
  ('site_tagline', 'Muller''s Foundation'),
  ('logo_url', ''),
  ('contact_email', 'info@mullersfoundation.org'),
  ('contact_phone', '+243 000 000 000'),
  ('footer_hq_text', 'Kinshasa, DR Congo'),
  ('footer_regions_text', 'USA · France · Canada'),
  ('social_facebook', ''),
  ('social_twitter', ''),
  ('social_instagram', ''),
  ('social_linkedin', ''),
  ('social_youtube', '')
ON CONFLICT (key) DO NOTHING;
