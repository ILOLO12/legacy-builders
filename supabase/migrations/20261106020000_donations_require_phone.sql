-- Phone number is now required when pledging a donation (the admin needs
-- a reliable way to reach a donor beyond email). Enforced at the DB level
-- so it can't be skipped by calling the insert API directly, bypassing the
-- Donate form's own validation.
ALTER TABLE public.donations
  ADD CONSTRAINT donations_donor_phone_required
  CHECK (donor_phone IS NOT NULL AND length(trim(donor_phone)) > 0);
