# Site audit implementation register

## Portfolio identity review — 16 October 2026

Continued from freshly fetched main cb2a4c5 in an isolated worktree, preserving
the previous modified checkout. Visually reviewed all122 assets in contact
sheets and inspected live gallery interactions. Corrected Dr. foody, moved the
misidentified Shahba image into its gallery, moved the LATAKIA cap out of LATARIA
while retaining the separately spelled LATARIA sweatshirt card, and classified
Legend Cut as a poster presentation.34 cards retain122 views. Guard queued
dialog close events against dismissing a newly opened gallery. Detailed evidence,
source limitations and uncompleted browser/admin matrix: docs/portfolio-visual-review.md.

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

### Live email recovery evidence — 2026-10-15

- PR13/14 promoted to the existing public site. PDF preparation now succeeds; durable owner payload targets info@carobara.com. Actual provider rejection was PROVIDER_DOMAIN_NOT_VERIFIED, not inbox spam or an assumed network fault.
- Authoritative public nameservers are IONOS ui-dns, while Resend records had only been configured in Vercel, whose UI explicitly reports third-party nameservers. No nameserver migration performed.
- Added the exact Resend DKIM TXT at resend._domainkey, SPF TXT at send, and priority-10 feedback MX at send in the correct IONOS carobara.com account. Existing apex IONOS MX/SPF, IONOS DKIM and DMARC records preserved; no paid changes.
- Google public DNS resolves all three exact expected records. Resend displays Domain verified and ready to send emails.
- Re-enabled only the existing actual booking notification rows rejected for unverified domain, within the provider idempotency window. Prepared payloads and original idempotency keys retained. No synthetic customer mail or new booking created. At 11:22:14 UTC both notifications were accepted and outbox sent_at persisted. Resend reports customer Delivered. Owner notification bounced Recipient not found and was suppressed: info@carobara.com is not an active recipient on the current IONOS mail service. IONOS offers paid Mail Basic/Business or email forwarding; no purchase or forwarding destination chosen without owner decision. Do not remove suppression or retry owner mail until recipient provisioning is fixed.

### Resolved: existing Google mailbox and both deliveries — 2026-10-15

- Owner confirmed the existing mailbox is accessed at Google as info@carobara.com itself. The earlier IONOS Recipient not found was a routing failure, not evidence the address needed to be purchased. No new mailbox, subscription or forwarding created.
- Corrected apex MX to priority 1 smtp.google.com per current official Google Workspace documentation. IONOS required deactivating its bundled Mail DNS template; replaced its apex SPF with v=spf1 include:_spf.google.com ~all and restored the exact existing DMARC policy v=DMARC1; p=none; as standalone TXT. Obsolete IONOS DKIM/autodiscover belonged to that template. Resend DKIM/send MX/send SPF preserved. Public DNS confirms Google MX.
- Removed only the erroneous bounce suppression after routing correction. Retained original notification history; queued one owner-only pending notification under transaction/advisory lock and expected appointment revision 0 to 1. Booking status unchanged; no second customer notification.
- Resend reports owner redelivery 01a13f61-3a4e-71ec-824b-9b57db32e4d1 Delivered (accepted 11:44:59 UTC), and original customer notification 01a13f4c-6761-7c1d-b59d-61813e9a19a4 Delivered. German PDF attached. Original owner bounce retained. Delivery means receiving-server acceptance, not proof the user read it.
- Google admin authentication was not completed; no account security/password/Workspace permission changes. Appointment remains pending owner approval.

### Administration workspace correction — 2026-10-15

- Inspected latest main 29d1791, existing signed-cookie authentication, both appointment sources and the actual admin API before changes. Findings, priorities and shared rules: docs/admin-workspace.md.
- Implemented shared administration navigation, translated login, primary current-booking entry, compact dedicated styling, separate appointments/email/schedule views, history/search, appointment disclosure, past-confirmation guard and honest mail acceptance labels. No booking or legal/contact record changed.
- Fixed ignored refresh failure, unsaved policy replacement and request-status filtering. Outbox reads prioritize unsent rows while including provider-accepted history; retry eligibility matches the existing five-attempt/23-hour worker bounds.
- Validation: 46/46 tests passed, including three new component regressions; tsc --noEmit and targeted ESLint passed; final Next.js production build passed. Public browser confirms admin authentication is required. Local browser visual fixture could not be opened, so no mobile screenshot or authenticated live UI pass is claimed. Publication verification remains pending.

### Administration operations batch — 2026-10-15

- Baseline main33fc091 inspected; continued within the existing project. Design and remaining module boundaries: docs/admin-operations.md.
- Added actionable appointment views (pending, Berlin today, late cancellation, past undecided requests) with bounded-source counts and last-refreshed time. Separate upcoming/unfinished/history database queries prevent archives displacing current work; removed internal idempotency/hash fields from the admin response. Bounds are disclosed.
- Hardened response validation and synchronous duplicate-action protection. A durable write followed by refresh failure is now explicitly reported and blocks repeated writes until fresh data is loaded. Draft state now reports dirty versus saved accurately.
- Email review shows appointment/event/recipient and safe actionable failure guidance, with scoped retries for eligible rows of one appointment. Provider acceptance still does not imply inbox delivery; no webhook is claimed.
- Replaced 980px customer table with responsive cards and a secondary selection/delete flow requiring explicit confirmation. Folded request editors and deletion, removed duplicate section heading. Independent data reads avoid unrelated outages blocking customer records; load failures no longer appear as empty results.
- Added actual component/model/API regressions for Berlin/DST queues, retry bounds/scope, internal-field minimization, concurrency guard, partial-success refresh handling and customer selection/confirmation in three languages. No actual customer records changed or messages sent.
- Publication and authenticated mobile browser verification remain gated by existing Vercel scope/browser restrictions; a successful build alone is not publication evidence.

### Managed categories batch — 2026-10-15

- Recovered latest main c054bc2 from GitHub after workspace maintenance removed local git/dependencies. Existing administration work preserved.
- Implemented /admin/categories, private draft/publish storage, optimistic revision checks, three-language validation, approved image selection and ordering. Root context connects published content to category listings/pages and service visuals; category metadata follows managed content.
- Applied additive category_content migration to the existing verified project, with no public content edit. Live grants/RLS and unchanged initial revision verified; no new WARN/ERROR advisor finding. Details and explicit fallback/refresh limits: docs/category-content.md.
- Public login check still serves the legacy interface. This does not establish current alias promotion or authenticated mobile UI verification. No real booking changes, customer emails or paid changes made.
- Validation:57/57 tests passed, tsc --noEmit and targeted ESLint passed, Next production build passed. A new regression renders the actual category page with managed context. The initial catalogue remains unpublished at revision0.

## 2026-10-15 — Responsive administration workspace

Priority: high. User requests a coherent mobile, iPad and desktop admin. Replaced the shared horizontal header with a responsive navigation rail/top navigation and a shared flexible content shell; unified surfaces, spacing, focus, touch targets, responsive appointment filters, search and legacy schedule forms. Details and destructive controls keep their prior behavior. No customer/database/email actions. See docs/responsive-admin.md for rules, verification matrix and the unresolved browser/public-promotion blocker.

## 2026-10-15 — Quick contact collapsed by default

Owner screenshot showed the footer contact panel expanded on initial load. Changed
HomeFooter's shared initial contact state to false for AR/DE/EN and all viewport
sizes. Existing explicit button toggling and aria-expanded remain unchanged.
Targeted ESLint and diff whitespace check passed. Public publication must be
verified separately; no customer, database or mail changes.

## 2026-10-15 — Always open the public site in German

Owner requested German on every fresh opening. Removed browser-language and
previous-visit preference restoration from the root LanguageProvider. German
initial server/client rendering now remains German after hydration. Explicit
AR/DE/EN switching remains active during in-app navigation; returning focus or
another tab's storage event no longer overrides that choice. Fresh reloads
start German. Existing dedicated admin language URLs remain explicit.

## 2026-10-15 — Social profiles and recognizable brand icons

Added owner-provided TikTok @caro.bara.werbeag alongside existing Facebook,
Instagram and WhatsApp destinations. Locally bundled Simple Icons 13.21.0
CC0 brand silhouettes replace generic camera/globe/chat symbols for these
platforms. Shared footer includes named 44px links for all four; home social
panel uses the same brand assets and WhatsApp contact also uses its logo.
TikTok is included in organization sameAs. No tracking SDK, inbox integration,
customer message or account permission change. German fresh-opening behavior
and collapsed contact defaults are preserved. Type/lint and public visual
verification are recorded with the release result.

## 2026-10-15 — Compact contact launcher and cookie preferences

Added mailto:info@carobara.com alongside social profiles, unified platform
silhouettes in the same teal color and replaced the shared footer contact strip
with a closed native-details corner launcher. It offers labeled links, a close
control, Escape/focus return, wrapping and bounded scrolling at small widths.
The homepage social panel also includes email with the same icon treatment.

Added a native modal cookie/storage notice in DE/AR/EN with a necessary-only
choice, privacy link, keyboard dismissal/focus return and persistent settings
entry. Reviewed source: no optional analytics/marketing tracker is embedded.
The notice honestly describes this rather than offering fictional optional
tracking toggles. Versioned necessary-only preference expires after 180 days;
malformed/expired records reopen the notice and storage failures are disclosed.
No optional tracker is introduced or activated; future nonessential purposes
require a separately implemented consent gate and preference-version change.
No customer data, mail or account permissions changed.

## 2026-10-15 — Refine privacy notice and contact destinations

Owner feedback: previous modal was visually heavy and overly verbose. Replaced
blocking showModal with a compact, nonmodal privacy notice at the bottom, no
backdrop/blur, short DE/AR/EN factual copy, privacy link and Understood action.
Existing necessary-only acknowledgement/expiry remains; no claim of optional
consent or certification. Escape/close and reopening settings remain available.

Google Maps and the company website now share the same icon-and-label tile
layout and monochrome color as the social links. Removed serves@carobara.com
and help@carobara.com from every runtime/public source, including contact data,
quick-contact cards and relevant legal-page contact references. Complaints now
use the retained info@carobara.com where a replacement is needed. No mailbox,
DNS, email delivery policy, historical record or customer data was deleted.
Validation: targeted ESLint, TypeScript, diff check and six translated legal
rendering tests passed. Production browser verification follows activation.

## 2026-10-16 — Branded link sharing preview

Added a build-time 1200×630 PNG card at /share-image using embedded local logo
and JPEG hero photography. German heading, service line and primary domain
remain readable at sharing-card size. Root Open Graph and large Twitter card
now use a versioned image URL and German descriptions. Metadata base now points
to the connected primary https://www.carobara.com domain. No client tracking,
external image fetch or runtime image-generation dependency is introduced.
Validation: ESLint, TypeScript and production build passed; generated PNG
visually inspected (1200×630, about 595 KiB). Platform-specific cached previews
may require refresh; no promise of identical rendering across applications.

## 2026-10-16 — Curated portfolio and customer goals

Reviewed 39 owner-supplied images, grouped duplicates and selected 12 project,
design and workshop entries. Prepared nine AI-retouched variants overall; seven
are used in the initial curated portfolio with their supplied originals available
from the viewer. Design mockups remain labelled as design presentations; no
invented before/after or customer testimonial. Source originals retained.
Local WebP derivatives are capped at 1200px, lazy-loaded, and only six cards
render initially. Four group filters, a native modal viewer, original/presentation
switching and category inquiry links are translated in DE/AR/EN with RTL,
keyboard focus and reduced-motion handling. Earlier PR29 goal navigation is
included. No booking, CMS, mailbox, DNS or customer data changes.
Validation: targeted ESLint and TypeScript passed, production build passed,
four component/asset/category/language tests passed. Browser validation and
production promotion remain separate steps; no claim of exhaustive device QA.
Image prompts requested faithful perspective/lighting improvements and unchanged
installed branding. AI-retouched displays are explicitly labelled, not asserted
to be untouched photographs. Original file view is available for comparison.


## 2026-10-16 — Compact goal actions and horizontal portfolio

Owner mobile screenshots showed oversized stacked goal cards, unbounded white
space and a long vertical portfolio. Goal navigation now uses a distinct tinted
panel, compact icon/text rows and explicit guidance/catalog buttons. Portfolio
uses a single native horizontal scroll-snap rail with touch/keyboard access,
translated previous/next buttons, start/end states, RTL direction and reduced
motion handling. No autoplay, vertical expansion or image crop introduced.
Filters, originals, viewer and category links remain.
Validation: targeted ESLint, TypeScript, four updated portfolio tests and local
production build passed. Browser interaction and publication verified separately.


## 2026-10-16 — Portfolio image framing

Owner rejected the cluttered lettering workbench photo. Removed that entry from
the public gallery; source asset retained. Gallery images now position absolutely
inside their 3:2 frame so portrait intrinsic dimensions cannot stretch the card.
Contain preserves the complete image; full-size modal remains available.
Validation: portfolio tests and targeted lint passed; deployment verified separately.


## 2026-10-16 — Ten additional owner-supplied projects

Added all ten newly supplied images as separate portfolio entries, ahead of the
existing eleven. Faithful AI photo cleanup/perspective prompts preserve installed
branding; enhanced presentations are labelled and supplied originals retained
for comparison. Landscape presentation derivatives share a 1200x800 frame.
No invented before/after, service pricing, booking or other project changes.
Validation and public deployment recorded after asset inspection.


### Expanded scope — full source reconciliation and grouped galleries

Owner supplied 33 more screenshots and requested all brand photos in one place.
Reviewed all 33, extracted 68 regions, retained 63 after duplicate/incomplete
fragment reconciliation. Reviewed earlier 39 uploads: included 38, excluding the
expressly rejected cluttered lettering workbench. Ten preceding project photos
received AI presentation retouching, with their original files retained.
Final inventory: 35 cards and 122 views, grouped by brand. Native modal adds
previous/next controls, thumbnails and photo position; RTL and DE/AR/EN remain.
Presentation mockups are labelled separately from supplied project photos.
New gallery assets use a 1200x800 presentation frame with contain, without
stretching source artwork. Catalog screenshot prices are not imported.
Validation: TypeScript, targeted ESLint and four asset/language tests passed.
Browser verification and production promotion are separate release steps.
