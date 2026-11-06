-- Anti-fraud mechanism for manual donation reconciliation (no bank API):
-- 1. Every donation gets a short, unique reference_code shown to the donor,
--    who is asked to put it in their bank transfer memo / Mobile Money note.
-- 2. An admin/editor can only flip a donation to "received" if they also
--    record the matching payment_reference they found on the real bank or
--    Mobile Money statement — enforced below at the DB level, not just in
--    the UI, so this can't be bypassed by calling the API directly.
ALTER TABLE public.donations
  ADD COLUMN reference_code TEXT NOT NULL
    DEFAULT ('MUFO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  ADD COLUMN payment_reference TEXT;

ALTER TABLE public.donations
  ADD CONSTRAINT donations_reference_code_unique UNIQUE (reference_code);

ALTER TABLE public.donations
  ADD CONSTRAINT donations_received_requires_reference
  CHECK (status <> 'received' OR (payment_reference IS NOT NULL AND length(trim(payment_reference)) > 0));

-- Close a gap this feature would otherwise leave open: the public insert
-- policy had no restriction on which columns a donor could set, so anyone
-- calling the API directly (not just through the Donate form) could have
-- inserted a row already marked "received" with a fabricated reference,
-- bypassing admin review entirely. Public submissions must now start
-- pending and unreferenced; only admins/editors (via the existing UPDATE
-- policies) can move a donation to "received".
DROP POLICY "Public can submit donations" ON public.donations;
CREATE POLICY "Public can submit donations" ON public.donations
  FOR INSERT WITH CHECK (status = 'pending' AND payment_reference IS NULL);
