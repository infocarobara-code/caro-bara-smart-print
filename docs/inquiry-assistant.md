# Guided inquiry assistant — implementation checkpoint, 2026-10-17

## Scope and superseded direction

Owner chose guided intake instead of the sign-design studio. One public entry point eventually accepts Arabic/German/English voice or text, opens existing service forms, fills real fields, asks one necessary question at a time, and proposes optional improvements without silently accepting them. Final request, administration copy, customer email and documents are German. Preserve exact artwork wording, names and addresses. Customers inspect contact data and explicitly approve the final revision before submission. Manual correction and stopping the assistant remain available.

This supersedes the former external-handoff-only decision for the NEW assistant intake. Existing cart/WhatsApp/email flows must remain intact until the new intake passes verification. No customer test messages or bookings. No new Vercel/Supabase project. No changes to other businesses.

## Baseline and audit

Main at implementation start: db49f3df8fd19299bd787e653f264fb179047d46. Isolated worktree/branch: feature/guided-inquiry. Original dirty sign-studio checkout preserved untouched. PR37/sign studio is not merged into this branch. Only its two AI SDK dependencies and lockfile are reused.

- `data/services/index.ts` supplies 24 service definitions and translated fields/options.
- `ServiceForm.tsx` currently owns local form state, hides contact/file fields, and adds inquiry items. It has no assistant navigation/action bridge yet.
- `/cart` performs external handoffs; it does not confirm receipt.
- `/api/submit-request` contains legacy persistence + mail logic. It is NOT called by this batch. It needs revision-bound consent, idempotency, bounded validation, abuse controls, optional-address rules and notification retry design before reuse.
- Existing service forms do not upload files. Mentioning a logo must never mark an attachment uploaded.

## Implemented in this checkpoint

- Public catalogue adapter derives service IDs, routes, field IDs and German options from existing definitions. No independent duplicate catalogue.
- Atomic draft actions with separate item IDs (including repeated services), strict field/option validation, stale-revision rejection and automatic review invalidation. A failed batch never partially changes the draft.
- Dependent hidden design details are excluded. Required visible fields are reported. All existing form helper/conditional behaviours still require reconciliation before calling this complete form parity.
- German summary labels/options. Free-text translation requires the model step; names/artwork wording remain verbatim.
- Model orchestration using existing direct OpenAI SDK stack. Validates structured actions before applying. No send/upload/approve tool exists. New service routing is followed by a separate turn with that service's authoritative schema; no guessed field IDs.
- Private admin workbench `/admin/inquiry-assistant`, three interface languages, real catalogue fields, local German review and local confirmation only. Manual test surface, NOT the intended customer-facing assistant.
- Authenticated bounded API route returns explicit `trial_not_activated`; it does NOT invoke a paid model. Provider orchestration currently covered with mocked responses only.

## Not implemented / not claimed

No customer entry button, cross-page state bridge, production AI conversation, audio capture/transcription/playback, durable drafts, file uploads, submission or mail integration. Workbench state is in memory and is lost on reload. Local review is not server consent. No real inference, visual browser QA or public deployment verification in this checkpoint. Build success does not imply those work.

## Next implementation gates

1. Persist minimal draft state through navigation; service form bridge must reuse validation and never overwrite a manual edit with a late model response. Changes to catalogue definitions require version checks.
2. Add bounded provider transport and server-side conversation limits. Existing sign-trial €5 cap/counter is not reset, extended or silently repurposed. Never turn on public paid inference with process-local rate limiting alone.
3. Add concise conversation panel using real existing routes/fields; customer can pause/undo/finish manually. No forced page change until the utterance is complete.
4. Audio: explicit microphone activation, pause/resume, interruption-safe bounded chunks, accurate displayed transcript with correction. No promise of unlimited recording or silent third-party speech processing. Define retention and disclosure before activation.
5. Attachments: private storage, MIME/signature and size limits, authorized access, upload state, expiry for abandoned drafts. No fabricated file status.
6. Intake: server-persisted revision and consent, idempotent request reference, single atomic creation, German documents, durable mail status/retries. Provider acceptance != inbox delivery. Keep received request durable even if mail fails.
7. End-to-end tests on 360/390/768/1024/1440px, Arabic RTL, all languages, keyboard, denied microphone, interruption, contradictory dimensions, multiple identical services, edits after approval, double submit and notification failure. No production customer messages.

## Acceptance example

Arabic request for 1000 A5 double-sided flyers plus 200 cards, logo available and design requested. Route and populate both items. Change ONLY flyer quantity to 2000 on correction. Unknown paper remains unknown, not silently chosen. Review German summary and exact customer details; modify any field -> consent clears. Actual final approval saves once, admin shows same reference/files, notification failures are visible and recoverable. This complete scenario has NOT passed yet.
