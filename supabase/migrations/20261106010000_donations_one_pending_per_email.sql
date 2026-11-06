-- A donor can have at most one donation "pending" at a time (per email,
-- case-insensitive). Prevents someone from piling up unresolved pledges
-- instead of finishing payment on the one they already started; once a
-- donation moves to 'received' or 'cancelled' it no longer counts, so a
-- new pledge is allowed again. Enforced at the DB level (partial unique
-- index) so it can't be bypassed by calling the API directly.
CREATE UNIQUE INDEX donations_one_pending_per_email
  ON public.donations (lower(donor_email))
  WHERE (status = 'pending');
