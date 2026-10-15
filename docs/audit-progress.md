# Site audit implementation register

Baseline: main d68d73b. Audit: 15 October 2026, 33 findings A01-A33,
16 construction rules R01-R16 in Caro_Bara_Site_Audit_AR.pdf.

## Batch: request foundations

| Finding | Implementation | Verification / remaining work |
| --- | --- | --- |
| A01 | POST/PATCH/DELETE booking slots authenticate before body or database access; reject cross-origin mutations | Anonymous and cross-origin requests tested with zero DB access; authenticated creation tested |
| A02 | Cart renders localized safe failures; submit API no longer returns raw storage exception | Both fetch spellings and private error strings tested; underlying production connectivity still requires diagnosis |
| A03 | Render known titles, field labels and option values in current UI language; store canonical choices separately | Actual cart renders in AR/DE/EN; legacy Arabic choices translate, customer free text remains unchanged; unknown legacy fields preserved |
| A04 | Clear cart only for explicit savedToDatabase=true, success=true and valid reference | Actual submit handler tested with empty, partial and valid responses; saved reference displayed |
| A06 | Cart writes throw when storage fails; form resets only after successful write | Quota failure preserves previous cart and reports failure; readable items survive failed normalization persistence |
| A07 | WhatsApp readiness appears as an informational message, never a receipt-success panel | Distinct confirmed-reference state; no claim of verified WhatsApp delivery |
| A13 | Real calendar date and valid 24-hour clock ranges | Impossible date and 99:99 rejected before DB calls |
| A16 | Send controls now follow customer fields | Actual rendered markup order tested |
| A18 | First three details plus expandable full detail list | No 12-field truncation; in-place editing remains open |
| A21 | Customer inputs have persistent labels; errors/status use live roles | Full keyboard/screen-reader review and field-specific error linking remain open |
| A23/A24 | Neutral cart surfaces, cyan actions, single-column layout, remove redundant home control | Live browser review pending deployment; wider design-system rollout remains open |
| A26/A27 | Extract receipt/error and option-presentation helpers; correct compiler memoization and hook issues; typed PDF identity | Full lint and build required; further component extraction remains open |
| A28 | Add authorization, input validation, storage, language and real-submit-handler regressions | Tests in tests/audit-foundations.test.mjs; remaining end-to-end matrix is not declared complete |

## Open findings / no completion claim

A05 durable idempotency needs a verified database constraint and migration.
A08 alternative send endpoint consolidation; A09 shared server validation;
A10 rate limiting; A11 bounded requests/outbox; A12 production data connectivity;
A14 DB overlap constraints; A15 durable notification retries; A17 conditional
customer data; A19 file delivery; A20 drafts; A22 server language resolution;
A25 confirmed contact source; A29/A30 canonical languages and sitemap;
A31 operational compliance; A32 actual portfolio; A33 performance/restore.

No customer records or existing appointments were deleted. No paid services,
legal agreements or database schema were changed in this batch. Public inquiry
semantics and existing legal texts remain intact.

## Owner direction: compact external handoff (15 October 2026)

The owner explicitly replaced cart internal submission with WhatsApp and email
only, and requested automatic emptying and minimal visible information.

- Cart now shows service title and quantity; complete translated details are
  folded and remain included in both messages.
- No customer/contact/address form, internal-submit button, clear-all button,
  confirmation modal, or large success panel.
- WhatsApp and mailto links open a prepared inquiry. Neither is described as
  confirmed sending or receipt. The cart clears on the user's handoff click.
- A temporary in-memory/session recovery copy is available under a collapsed
  recovery action for 15 minutes if no app handles the link. A storage failure
  prevents navigation and preserves the existing cart.
- Email uses the confirmed legal company email info@carobara.de. WhatsApp uses
  the existing established number. No API/database write or notification is
  initiated from this page; existing backend routes and admin protections stay.
- Summary rendering and outbound payload use one shared module, with actual
  cart tests for DE/AR/EN, automatic clearing, storage failure and all details.

The prior audit batch was published as main 1fc21c3, promoted to Current and
reviewed live in AR/DE/EN. Its underlying booking-connectivity finding A12 is
still open and is not fixed by this change to the cart's transport.

## Batch: booking language continuity (15 October 2026)

Baseline main d37454b (#9), confirmed Current in Vercel. Live read-only probe:
GET /api/available-days returned HTTP 500 with `fetch failed`. Connectivity
cause remains unverified; this batch does not claim to restore database access.

| Priority / problem | Evidence | Change | Validation |
| --- | --- | --- | --- |
| P1 language switch loses selected appointment time | slots effect depended on currentLanguage and reset selectedSlotId | Fetch availability only when its data dependency changes; derive error text from language-independent failure state | Build/types, lint and tests; live selection check still needs available production data |
| P1 failed/malformed availability appears empty | loaders accepted unsuccessful JSON and returned empty arrays | Reject unsuccessful or malformed payloads, retain genuine successful empty lists | Regression executes actual loader functions against success/failure/malformed payloads |
| P1 internal error disclosure | public days endpoint returned raw DB exceptions and configuration messages | Stable BOOKING_DAYS_UNAVAILABLE error | Tests cover missing environment and thrown private DB error |

Data ownership observed: data/services.ts and data/categories.ts supply the
public service catalog; administration currently manages requests, customers,
appointments, booking_available_days and booking_slots. It has no service catalog
editing path. External inquiry handoff remains external and creates no admin
receipt. Catalog CMS migration is pending a verified storage and migration plan.

Shared rules: language switching must not refetch language-independent data or
reset selections; protocol failure is never empty availability; public failures
must not return private upstream errors. No database or customer records changed.

## Batch: weekly appointment lifecycle (15 October 2026)

Owner requested recurring visits Tue/Wed 11–18 and Fri 15–19, max two hours,
24-hour phone requests, shop appointments during working hours, approval,
German email/PDF/calendar, code-based cancellation and EUR 20 express option.
Implementation, architecture, decisions and activation requirements are recorded
in docs/weekly-appointments.md. Production activation remains gated by BOOKING_WEEKLY_ENABLED and Vercel
promotion. After connection, the matching Supabase project was found INACTIVE
and restored. The old available-days endpoint then returned HTTP 200. The
additive schema, legacy Arabic-time guards and private RLS protections were
applied to the verified production database. The two legacy appointment rows
were preserved. The durable outbox now has a database cron wakeup every five
minutes, with replay-proof tickets and no customer data in wakeup requests.

## Booking email incident — 2026-10-15

- P0: actual booking saved, both notification rows unsent after three retries; neither prepared payload persisted. Worker wakeups return HTTP 200. Local production route trace excludes Cairo-Regular.ttf although PDF reads it from disk. Include font explicitly in API deployment traces; preserve durable retries.
- Correct booking office fallback/reply-to to info@carobara.com as explicitly requested; legal company record unchanged.
- Record sanitized failure stage/code in outbox and server logs without customer content or provider error text.
- Validation: notification retry/recipient regression, full tests/build, inspect generated route trace; live retry and provider acceptance to be checked after promotion.
