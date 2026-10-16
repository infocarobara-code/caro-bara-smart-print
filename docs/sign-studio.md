# Interactive Sign Studio

Baseline main: db49f3df8fd19299bd787e653f264fb179047d46. Only draft PR21
was open. A fresh checkout of the same approved repository replaces the pruned
local worktree whose parent Git directory no longer exists; no source was reset.

## Customer flow

Home teaser/navigation → /sign-studio → text, optional local logo, dimensions,
colors and lighting → saved/current comparison → optional PNG → existing
signage inquiry in /cart → existing WhatsApp/email handoff. No database,
booking, server submission, AI API, image upload or new dependency is involved.

German, Arabic and English labels use the existing language provider. SVG text
is measured after shaping, including Arabic, and shrunk to fit without squeezing
glyphs. Width80–480cm, height20–120cm accept decimal comma/dot. A240×60 sign
is exactly4:1 in SVG centimetre coordinates. Invalid input cannot be added.

The cafe background is a generated illustration, not a measured client facade.
Its600cm reference plane at10m sets a fixed illustrative field of view;
distance scales this plane, without reconstructing depth or guaranteeing
legibility. Light is illustrative, not a physical LED/color proof. Contrast is
the selected colors' sRGB luminance ratio, not a signage certification.
Optimization only enlarges text and corrects weak color contrast, preserving
the wording and dimensions. Materials, construction and installation need review.

Logo input: PNG/JPEG/WebP,4MB,16million decoded pixels, held only in memory.
Out-of-order loads cannot replace a later selection. PNG export embeds images
locally and burns in a generated-example label. Logo/preview bytes are not in
the inquiry; customers must attach their download separately. Adding specs
does not send anything or create a received admin request. Existing items are
preserved; storage failure keeps the design and reports an error.

## Asset and prompt

public/sign-studio/storefront.webp:1536×1024,133178bytes, generated with the
built-in image generator, encoded to WebP without resizing. Prompt: front-on
modern European cafe; upper half plain plaster without signs/text; lower warm
oak/glass interior; daylight; no people, logos or watermark. Sign geometry,
letters, dimensions and light effects are live SVG rather than generated pixels.

## Verification

30 targeted tests passed: geometric ratios, input bounds, true color ratios,
safe multilingual text, inquiry retention/storage failure, existing handoffs
and portfolio. TypeScript, targeted ESLint and production build passed. One
pre-existing Header img optimization warning remains. Browser interaction,
download, responsive and production checks are tracked separately.

Full suite:74 tests passed. No production data was written during testing.
