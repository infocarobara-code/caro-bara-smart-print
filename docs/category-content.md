# Managed service categories

This batch makes category names/descriptions (AR/DE/EN), existing category images and order editable from /admin/categories. Service IDs, form fields/options, contacts and legal records are unchanged. Full service editing and uploads are deliberately not presented as working tools.

## Data and writes

- Source: cb_category_content singleton, with separate draft/published JSON documents and one optimistic revision. Migration generated with the Supabase CLI, then matched to the actual applied remote version20261015155744.
- The initial empty documents mean use repository defaults. No customer/business text was changed or published during QA.
- Only the existing authenticated admin API writes, after origin validation. Anonymous and authenticated Supabase roles have no access; RLS is enabled. Server role gets select/update only. No new auth role, secrets or public write grant.
- Saving a draft accepts incomplete translations; publishing reads the saved draft on the server and requires nonempty names/descriptions in all3 languages, all existing IDs exactly once, unique valid order positions, and existing approved local image paths. Revisions are compared again in the atomic update.

## Public connection

The root layout loads the published snapshot and provides it to category listing, category page and service visual components. Category metadata uses edited German names/descriptions when managed content differs. The public reader is cached for60 seconds; publish expires its tag. Existing open tabs need a reload/navigation that refreshes the root layout. No browser receives the draft through this provider.

During an initial database/cache outage the public reader logs a generic error and falls back to repository defaults; later cached revalidation may retain its previous snapshot. This fallback is limited to presentation metadata, never booking availability, payments or consent. The editor reports failures and never treats fallback as a saved/published result. This is not a claim of guaranteed real-time propagation during an outage.

## Verification

- Live SQL after additive migration: rls=true, anon_read=false, user_write=false, server_access=true; revision0, draft=published, published_at=null.
- Advisors: existing10 INFO RLS-without-policy notices plus the new private table's expected INFO notice. No new WARN/ERROR. No policies are intentionally defined for public roles. See https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy .
- Local Postgres tests: migration replay, role denial, draft isolation and stale update rejection. Model/API tests: image/ID/order restrictions, three-language completeness, server uses saved draft rather than caller-supplied publish content, authentication before reads.
- Rendered public-page regression verifies it consumes the managed context. Authenticated live/mobile browser verification and production alias promotion are not established by these tests.
