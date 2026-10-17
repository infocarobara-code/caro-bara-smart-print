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

## Owner-only AI trial — 2026-10-16

The studio now includes a hidden-by-default assistant. `GET /api/sign-studio/assistant` exposes only an availability boolean. Both an existing admin session and `SIGN_STUDIO_AI_TRIAL_ENABLED=true` plus `AI_GATEWAY_API_KEY` are required; the POST route independently checks all three and same-origin requests. No credentials are returned to the browser. Node 22+ is required by the pinned lockfile's AI SDK 7.0.143; local verification used Node 24.

The first trial uses AI Gateway `openai/gpt-6-astra` with structured output. The model can propose only the editor's existing family, depth, font, colors, scale, logo position and lighting. A separate validator rejects unknown/duplicate fields, incompatible configurations and invalid values. Wording, dimensions and logo artwork cannot be rewritten. Family changes include the editor's normal compatible defaults, shown in the change list. Unsupported requests get a fixed workshop-review message; no unverified model prose or fabrication approval is displayed.

The customer first sees a separate SVG preview and exact change list. Applying creates a normal undo step; stale suggestions cannot be applied after the design/logo changes. Cancel, unmount and design changes abort pending requests. The session-level off button cancels the request and removes assistant controls; manual editing remains usable. Aborting cannot guarantee a provider has not already incurred usage. Global disable requires removing the trial flag and redeploying (or a deployment rollback); it is NOT an instant cross-session runtime switch.

Only the prompt, current sign text, dimensions and supported properties are sent to the provider after a deliberate request. Logo image bytes stay local. This iteration does not analyse logos or facade photos, generate artwork, approve manufacturing, calculate price, book appointments, send customer messages or write to the database. The UI explains the data sent. Existing site's cookie behavior is unchanged; no tracking was added.

Requests are capped at 8 KiB actual streamed bytes and 1,200 prompt characters, one model call, zero retries, 30-second provider timeout and 1,200 output tokens. A 15-second per-process throttle is only a trial guard, NOT a global budget or rate limit. Before live activation: obtain owner approval for a bounded trial budget, configure provider-side spend controls and credentials directly in Vercel Preview settings for this project, then enable the Preview flag and redeploy. Never paste keys into chat. Public rollout requires distributed abuse/budget controls, approved workshop rules, real-model evaluation and browser QA. No live inference or paid setup was performed during implementation.

Automated checks cover forbidden patches, preservation, family compatibility, inactive/auth/origin/body-size gates, provider failures and rate gating with mocked inference. Browser interactions, production credentials, real-model quality and actual manufacturing suitability remain unverified. Vercel connector access previously returned 403; browser preview observation is blocked by credential_observation_restricted. Do not treat successful compilation as visual acceptance.


## Superseding update — direct OpenAI, 2026-10-17

Owner approved a trial budget of at most EUR 5, then explicitly requested direct provider connection after Vercel checkout failed for both wallet and card. The API now uses `@ai-sdk/openai` Responses directly at the explicit `https://api.openai.com/v1` endpoint and model `gpt-6-astra`. It does not use Gateway, shared `OPENAI_API_KEY`, `OPENAI_BASE_URL` or automatic provider fallback. The isolated server-only secret is `SIGN_STUDIO_OPENAI_API_KEY`; the existing trial flag and admin authentication remain mandatory. `store:false`, low reasoning, output cap, timeout, no retries and independent proposal validation remain in effect. No image bytes are sent.

The earlier Gateway activation instructions are superseded: do NOT buy Vercel Gateway credits for this implementation. Configure the isolated key only in this existing Vercel project's Preview environment for `feature/interactive-sign-studio`. Keep `SIGN_STUDIO_AI_TRIAL_ENABLED` false/absent until spend protection and account access are verified. No key has been installed and no real inference has been run. The EUR 5 approval is not proof of a configured hard cap; neither an application process-local throttle nor a provider budget notification guarantees that cap. Live activation remains blocked pending secure account setup and enforceable trial controls. No production change or extra subscription is authorized by this update.

TypeScript and provider-mocked tests verify direct endpoint/key selection, disabled/auth gates, storage disabled, no retries and unchanged proposal safeguards. Actual account model access, billing and end-to-end quality remain unverified.

## Bounded direct-provider trial — 2026-10-17

Key configuration was verified in Vercel: Secret, Preview branch
`feature/interactive-sign-studio` only. The accidental Production copy was
removed with the owner's explicit confirmation. No provider calls had occurred.

Budget guard: a new isolated `cb_sign_trial_budget` row reserves one of ten
non-refundable permits atomically before each provider HTTP request. Each permit
reserves EUR .50 of the EUR 5 total authorization, NOT a claimed API unit price.
Failed/cancelled requests retain their permit. SQL UPDATE serializes callers;
15-second shared spacing, fixed ten-call constraint, enabled switch and expiry
2026-10-18 10:00 UTC fail closed. Restarts/redeploys do not reset the counter.
There is no auto-renewal/top-up. Missing database, permissions, bad response or
exhaustion prevents the model call. Only the existing server service role can
access the table/RPC; no customer information is stored in the counter.

The transport guard checks the actual serialized SDK request: <=12,000 UTF-8
bytes including schema and instructions, exact Responses endpoint/model,
standard tier, 1,200 total output tokens, no tools/background/previous response,
no redirects, retries or alternate endpoint. Only the specified Vercel Preview
branch can enable it, even if this code is later merged to Production.

Pricing verified 2026-10-17: GPT-6 Astra standard input $10/M, cache writes
$12.50/M, output $50/M. Conservatively allowing 13,000 input tokens (byte upper
bound plus framing) gives <=$0.2225 per request; ten <=$2.225. EUR/USD ECB
reference 2026-10-16: 1.1253; even 19% tax and substantial conversion margin
remain below EUR 5. The .50 EUR reservation deliberately stops well before the
monetary limit. This cap covers this studio's bounded trial only, not unrelated
usage of the same OpenAI account/key. New pricing/renewal requires re-review.
https://developers.openai.com/api/docs/models/gpt-6-astra
https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.ff.html

Eight focused tests passed, including real local PostgreSQL-compatible migration
execution, concurrent reserve attempts, tenth/eleventh boundary, disabled/expired
state, public-role denial, transport size/tier/tools rejection, provider failures
and existing proposal validation. Live deployment and inference tracked below.
