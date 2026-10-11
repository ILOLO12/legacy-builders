-- Volunteer application form upgrade: new structured fields, additive and
-- nullable only — no existing row is touched or overwritten.
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS cv_url TEXT;
