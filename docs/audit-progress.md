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
