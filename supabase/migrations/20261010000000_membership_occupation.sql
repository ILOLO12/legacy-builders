-- Membership form was collecting a single "full name" + an optional free
-- message, which read like a generic comment box rather than a real
-- membership application. Add the occupation ("Poste") field Jkevin asked
-- for; first/last name stay combined into the existing `name` column
-- (the signup form now collects them as two inputs and joins them).
ALTER TABLE public.membership_signups ADD COLUMN IF NOT EXISTS occupation TEXT;
