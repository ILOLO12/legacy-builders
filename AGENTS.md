# AGENTS.md

Rules for this project. Each rule states what must hold; values (thresholds, tiers,
addresses) live in project memory, not here.

## Data access

- Public-facing submission tables (donations, page views, error logs, membership and
  volunteer requests) accept anonymous inserts but must never be readable by anonymous
  or non-staff roles — grants give the public role `insert` only, and RLS keeps every
  read scoped to staff. Why: the site collects donor and visitor data; a form must be
  submittable without exposing the stored rows.
- Staff-only reads and writes go through `public.has_editor_access(auth.uid())` (or
  `has_role`), never through client-side storage, and roles stay in `public.user_roles`.
  Why: roles on a profile row or in the browser can be forged.
- When background code (an edge function) must find, claim and update rows that the
  public API role cannot read, do it in a `security definer` function in `public` that
  the function calls, instead of widening the public role's read access. Why: the
  publish log and similar tables hold internal state that must stay invisible while
  still being retryable.

## Frontend

- CMS content merges over local translations via `usePageContent`; a page must keep
  rendering its bundled copy when the CMS row is absent. Why: a missing or empty row
  must never blank a page.
- i18n files are parallel copies of `fr.ts`/`en.ts` — adding a key to one means adding
  it to every supported locale, including the ones not yet in the language switcher.
  Why: a missing key renders the raw key string.
