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

## Construction editor, 2026-10-17 (supersedes studio facade controls above)

Main and PR37 rechecked before editing: db49f3d and 533778b respectively.
The studio now defaults to a dimension-driven orthographic construction view;
the older illustrative facade scene remains in the home teaser only.

Supported rectangular concept families: flat panel, lightbox and projecting
cabinet. Family changes preserve artwork and dimensions and reset incompatible
lighting/depth. The panel is unlit; cabinets support unlit/face-lit. Halo and
individual channel letters are deferred until their actual geometry/rules exist.
Depth, font (including local Cairo), proportional logo scale, signed yaw,
elevation, front/side/angle presets, sketch/color view and manually controlled
face separation are available. Projection uses centimetre coordinates, not a
skewed bitmap. Part separation shows only body/graphic face; no invented LED
module layout or precise installation sequence. The projecting bracket is
schematic. Matching reverse artwork is requested but not separately rendered.

All ranges are EDITOR limits, not supplier manufacturing rules. No price,
structural suitability, installation approval or manufacturability guarantee.
Unknown material/mounting/electrical details explicitly require workshop review.
The inquiry now carries schema version2 and exact artwork/construction values,
plus readable notes; uploaded logo bytes still require manual attachment.
No database, email, DNS, booking or production data changes.

Remaining product scope: individual extruded glyphs with proper Arabic shaping;
custom shapes and editable reverse; selection by touching individual parts;
logo drag/placement; calibrated facade photo; supplier-backed constraints;
reviewed manufacturing BOM; immutable customer approval workflow. Current
orthographic drawing is a concept, not a CAD manufacturing file.

Research basis: Gemini design guides (minimum strokes depend on product/depth),
SloanLED Layout Estimator (depth-specific LED selection), W3C Arabic layout
(joining/shaping), 3M translucent sign films. These inform architecture and are
not imported as universal production limits.
https://hub.geminimade.com/knowledge/design-guide-fabricated-stainless-steel-halo-lit
https://sloanled.com/downloads/SloanLEDLayoutEstimatorUserGuide.pdf
https://www.w3.org/TR/alreq/
https://www.3m.com/3M/en_US/p/d/b00024960/

Validation:78 tests passed including family transitions, physical projection,
invalid construction rejection, versioned inquiry retention and escaping at
extreme dimensions/angles; TypeScript and targeted ESLint passed. Browser
interaction, logo PNG export with fonts and responsive signoff remain required.

Own SVG raster inspection verified the separated face/body geometry. Added an explicit background rectangle so PNG exports do not depend on external CSS backgrounds. This is not a browser interaction test. Preview browser remains blocked by credential_observation_restricted.

## Direct editing and document history — 2026-10-17

Follow-up starts from PR37 head 58f76bd; main still db49f3d. No newer work was
replaced. Body, face, lettering and logo are separately keyboard-selectable in
the current SVG; choosing a part opens its own controls. Comparison SVG is
read-only. On mobile, text/face/body selection scrolls to the editor; logo drag
keeps the drawing in place. Analysis is now collapsed by default.

Logo position is a normalized percentage of travel within the face margins.
Pointer dragging maps screen coordinates through the inverse face transform,
with pointer capture, bounds and cancellation. Arrow keys provide a touch-free
alternative. Edge-on singular transforms cannot be dragged: front view and
position sliders remain available. The text column automatically occupies the
larger free side so it cannot intersect the reserved logo box. Both preview and
inquiry use the same layout inputs. Editor selection outlines are removed from
PNG export. Export takes a synchronous SVG snapshot before asynchronous work.

Undo/redo stores up to40 in-memory document revisions (text, dimension input,
logo and construction). Focused input edits and a whole drag each form one
transaction. Cancelling a drag restores its origin and redo history. Upload
completion remains sequence-guarded; undo/reset/removal invalidates pending
uploads. No localStorage autosave is claimed, and no logo bytes leave the device.
Inquiry schema v3 includes logo X/Y and scale, plus readable placement notes.

Verification added: exhaustive logo/text bounds at supported dimension/scale/
placement extremes, document undo/redo, drag coalescing/cancellation, history
limit, keyboard part labels and clean comparison rendering. Browser interaction
and PNG font fidelity still require visual signoff; the previously observed
credential protection block has not been bypassed or repeatedly retried.

Validation for direct editing:82 full-suite tests passed (16 studio tests),
TypeScript, targeted ESLint and production build passed. Follow-up snapshot and
same-family preservation adjustments also passed the16 studio tests. No live
browser or public production result is claimed for this update.
