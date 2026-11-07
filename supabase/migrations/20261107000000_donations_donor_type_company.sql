-- Lets a donor identify as an individual or a company. A company donor
-- must give its name (useful for donation receipts / tax purposes); the
-- tax ID (RCCM / NIF) is optional since not every donor has one at hand.
ALTER TABLE public.donations
  ADD COLUMN donor_type TEXT NOT NULL DEFAULT 'individual' CHECK (donor_type IN ('individual', 'company')),
  ADD COLUMN company_name TEXT,
  ADD COLUMN company_tax_id TEXT;

ALTER TABLE public.donations
  ADD CONSTRAINT donations_company_name_required
  CHECK (donor_type <> 'company' OR (company_name IS NOT NULL AND length(trim(company_name)) > 0));
