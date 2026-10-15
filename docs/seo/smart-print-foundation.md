# Smart Print SEO foundation

Smart Print is an additional inquiry and appointment site, not a replacement for
https://www.carobara.de/. The verified Smart Print origin is currently
https://caro-bara-smart-print.vercel.app. Keep these two identities separate.

The shared `data/seoSite.ts` configuration owns the verified origin and social
profiles confirmed in the Google Business Profile. Changing the Smart Print
origin requires checking the domain, updating Search Console, and submitting the
new sitemap. Do not point Smart Print canonicals at the company website.

This increment adds the sitemap, robots instructions, public company links,
organization/website identity, and route canonicals. Administrative, cart,
booking-management, and form screens carry noindex metadata. Robots rules do not
replace authentication or access control.

Language switching remains the existing DE/AR/EN client workflow. It is not yet
three independently indexable language versions. Same-URL hreflang declarations
have been removed; add them only alongside distinct, rendered language URLs.

Google Business Profile: preserve the company website as the main website;
Smart Print /booking is an additional booking link. Last confirmed action:
booking link saved; restoring the main website was pending Google review.

Booking email delivery is outside this increment and remains a separate open
verification item. This change does not claim that notification delivery works.
