-- The membership form collects an occupation (required field) and the admin
-- list shows it, but the column was never created, so every submission from
-- the Adhésion page failed. Add it as a plain nullable text column.
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS occupation text;