# Responsive administration workspace

## Evidence / priority
The existing mobile screenshot showed four narrow, tall navigation cards, repeated headings and oversized empty sections. Earlier merged admin work was not active on the public alias. This batch improves the current source and does not treat a successful build as proof of publication.

## Shared rules
- One workspace shell across appointments, incoming requests, customer records and category management. No public-page footer is added to admin.
- Desktop / landscape tablet above900 CSS pixels: 200–230px sticky navigation rail in normal document flow, flexible content column. No fixed overlay or bottom bar.
- Portrait tablet through900px: navigation above content, four equal destination buttons. Phone through600px: two-by-two navigation, single-column fields, two-column metrics and separate wide final queue.
- Search grows with the viewport; on phones its input is above two actions. Appointment filters align in two columns and collapse to one. Legacy schedule forms also wrap rather than force six columns.
- Labels accompany icons; native links/buttons retain keyboard semantics and active destination is identified. Controls have44px minimum heights; inputs use16px text. Focus outline, reduced motion, logical spacing/RTL and wrapping long customer content are shared.
- Preserve authentication, server permissions, booking actions, draft handling, original customer text and all three languages. No database/schema change, payment, email, record deletion or customer transition is part of this batch. The separate optional EUR80 appointment change remains in PR21.

## Validation / release
Types, lint, build and behavior tests must pass for the exact committed tree. Navigation regression checks labels/destination semantics and language/search preservation. Existing tests cover action guards, failed refresh, schedule draft preservation and original text.

Browser review matrix still required before claiming visual signoff:360/390px phone;768px tablet portrait;1024px tablet landscape;1440px desktop; AR/DE/EN; long names/contact details; loading/error/empty states; keyboard and200% zoom. The shared browser remains blocked after credential protection and Vercel scope authorization was previously denied. No authenticated screenshots or live visual verification are claimed by this document.
