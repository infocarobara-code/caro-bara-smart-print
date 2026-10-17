# Guided inquiry assistant — implementation checkpoint, 2026-10-17

## Scope and superseded direction

Owner chose guided intake instead of the sign-design studio. One public entry point eventually accepts Arabic/German/English voice or text, opens existing service forms, fills real fields, asks one necessary question at a time, and proposes optional improvements without silently accepting them. Final request, administration copy, customer email and documents are German. Preserve exact artwork wording, names and addresses. Customers inspect contact data and explicitly approve the final revision before submission. Manual correction and stopping the assistant remain available.

This supersedes the former external-handoff-only decision for the NEW assistant intake. Existing cart/WhatsApp/email flows must remain intact until the new intake passes verification. No customer test messages or bookings. No new Vercel/Supabase project. No changes to other businesses.

## Baseline and audit

Main at implementation start: db49f3df8fd19299bd787e653f264fb179047d46. Isolated worktree/branch: feature/guided-inquiry. Original dirty sign-studio checkout preserved untouched. PR37/sign studio is not merged into this branch. Only its two AI SDK dependencies and lockfile are reused.

- `data/services/index.ts` supplies 24 service definitions and translated fields/options.
- `ServiceForm.tsx` currently owns local form state, hides contact/file fields, and adds inquiry items. Its existing component now supports a controlled assistant mode used privately in the workbench; public-route navigation is not connected yet.
- `/cart` performs external handoffs; it does not confirm receipt.
- `/api/submit-request` contains legacy persistence + mail logic. It is NOT called by this batch. It needs revision-bound consent, idempotency, bounded validation, abuse controls, optional-address rules and notification retry design before reuse.
- Existing service forms do not upload files. Mentioning a logo must never mark an attachment uploaded.

## Implemented in this checkpoint

- Public catalogue adapter derives service IDs, routes, field IDs and German options from existing definitions. No independent duplicate catalogue.
- Atomic draft actions with separate item IDs (including repeated services), strict field/option validation, stale-revision rejection and automatic review invalidation. A failed batch never partially changes the draft.
- Dependent hidden design details are excluded. Required visible fields are reported. Existing smart options and custom companion inputs now share the original form logic. Full behavioural parity still needs browser verification.
- German summary labels/options. Free-text translation requires the model step; names/artwork wording remain verbatim.
- Model orchestration using existing direct OpenAI SDK stack. Validates structured actions before applying. No send/upload/approve tool exists. New service routing is followed immediately by an internal population call using authoritative schemas and the SAME utterance. Maximum two calls, zero retries; both commit as one revision or no changes. No repeated customer message is required. Existing-item edits normally use one call. This behaviour has mock-based tests only.
- Private admin workbench `/admin/inquiry-assistant`, three interface languages, conversation panel with explicit unavailable status, real catalogue fields, local German review and local confirmation only. Manual test surface, NOT the intended customer-facing assistant.
- Authenticated bounded API route returns explicit `trial_not_activated`; it does NOT invoke a paid model. Provider orchestration currently covered with mocked responses only.

## Not implemented / not claimed

No customer entry button, cross-page service-form bridge, production AI conversation, audio capture/transcription/playback, server-durable drafts, file uploads, submission or mail integration. Workbench draft, unsent text, language and bounded history are saved to sessionStorage in the same tab, with a two-hour restore window after the latest edit. Closing the tab normally clears it; browser session restoration behaviour may vary. This is not server persistence. Expired/incompatible snapshots are refused, not silently imported. Failed storage writes are reported. Local review is not server consent. No real inference, visual browser QA or public deployment verification in this checkpoint. Build success does not imply those work.

## Next implementation gates

1. Tab-local state, catalogue compatibility marker, stale-response rejection and revision-monotonic undo implemented. Original ServiceForm component and helper/custom fields now connected inside the private workspace. Still connect public routes; no claim of cross-page form filling yet.
2. Add bounded provider transport and server-side conversation limits. Existing sign-trial €5 cap/counter is not reset, extended or silently repurposed. Never turn on public paid inference with process-local rate limiting alone.
3. Add concise conversation panel using real existing routes/fields; customer can pause/undo/finish manually. No forced page change until the utterance is complete.
4. Audio: explicit microphone activation, pause/resume, interruption-safe bounded chunks, accurate displayed transcript with correction. No promise of unlimited recording or silent third-party speech processing. Define retention and disclosure before activation.
5. Attachments: private storage, MIME/signature and size limits, authorized access, upload state, expiry for abandoned drafts. No fabricated file status.
6. Intake: server-persisted revision and consent, idempotent request reference, single atomic creation, German documents, durable mail status/retries. Provider acceptance != inbox delivery. Keep received request durable even if mail fails.
7. End-to-end tests on 360/390/768/1024/1440px, Arabic RTL, all languages, keyboard, denied microphone, interruption, contradictory dimensions, multiple identical services, edits after approval, double submit and notification failure. No production customer messages.

## Acceptance example

Arabic request for 1000 A5 double-sided flyers plus 200 cards, logo available and design requested. Route and populate both items. Change ONLY flyer quantity to 2000 on correction. Unknown paper remains unknown, not silently chosen. Review German summary and exact customer details; modify any field -> consent clears. Actual final approval saves once, admin shows same reference/files, notification failures are visible and recoverable. This complete scenario has NOT passed yet.


## Conversation and recovery batch — 2026-10-17

- `turn.ts` validates utterances/language and bounded user/assistant history before any model call. No user-supplied system role.
- `provider.ts` performs internal routing then population only when needed. The second call may not create further items; no unbounded loop. Abort/error in either stage leaves the original draft unchanged. Model URLs are never accepted; destinations derive from the live catalogue. The destination list is not yet used to navigate the existing service pages.
- `session.ts` revalidates local snapshots, drops review consent, rejects catalogue changes/expiry, and accepts only revision-matching add/set/contact proposals. Undo increments revision, so old in-flight replies remain stale.
- Conversation UI preserves unsent text after failures, supports stop/timeout, keeps typed edits while awaiting replies, and shows that live AI is unavailable. A status fetch does not activate inference. No fake/demo replies are displayed as live AI.
- Review checkbox now records the exact revision rather than a bare boolean. Manual/model/undo changes invalidate it. Reload does not restore consent.
- No API key was read, moved or created. No paid request, mail, booking, Supabase mutation, production merge or promotion in this batch. The API intentionally continues to return `trial_not_activated`; the provider is tested through dependency-injected mock responses, not wired around the budget gate.
- Tests cover same-utterance two-item population, rollback on model failure, one-item correction isolation, invalid history, cancellation, snapshot restoration, stale responses, undo, API authentication/origin/body limits and disabled paid inference.
- Runtime call count is bounded; a durable monetary reservation guard and explicit trial configuration remain prerequisites to live inference. The old sign-studio allowance is not renewed or repurposed.
- Implementation references: installed AI SDK 7 structured-output docs; official OpenAI Structured Outputs guide (https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses), reviewed 2026-10-17. Schema conformance does not establish semantic correctness or manufacturability.


## Original service-form integration batch — 2026-10-17, evening

- Verified remote main `db49f3df8fd19299bd787e653f264fb179047d46` and PR38 head `35e7e6ac7eb489efda45e18f3faa8b82012538bb` before edits. No newer work replaced.
- Private workspace now mounts the ORIGINAL `ServiceForm` component for one selected item at a time, rather than maintaining a second generic form renderer. Product tabs retain independent item values, even for identical services. A valid model change selects its first changed item; manual switching remains available.
- Optional controlled mode receives draft values, routes field changes back through atomic draft validation, and opens review instead of adding to the legacy cart. The ordinary service form still uses its existing local state and cart handler.
- Extracted the existing smart-option resolver into `lib/service-field-options.ts`; catalogue/model schemas and the original form use the same options. Existing explicit catalogue options retain priority.
- Exposed real `__custom` companion fields for select options, with parent-dependent visibility, correct reconstruction order on restore, required-field checks and cleanup when returning to a preset. German summaries show the actual custom value, not the word "custom".
- Fixed custom-quantity recognition for options named `custom`, as used by current services. These companion inputs now use numeric input/minimum 1; assistant validation requires positive integers and never rounds 200 to a preset.
- Added bridge conversions for checkbox arrays and the existing form's comma-separated representation. No cart insertion or submission is permitted through model actions.
- 22 tests pass, including live-catalogue option parity, quantity 200 -> manual correction 333 -> preset cleanup, dependent-field restore order, checkbox round trip and server rendering of the real form in controlled and ordinary modes. These rendering tests are NOT browser/viewport verification.
- Still not implemented: cross-page navigation into public service routes, live budgeted inference, voice, private uploads, server-durable request/consent, idempotent submission and German notification delivery. No main merge, production promotion, paid call or customer communication in this batch.

## Guarded provider connection — 2026-10-17

- API now connects the validated turn to `proposeInquiry` using a server-only budgeted transport. Authentication, origin and body limits remain mandatory. Status performs no reservation. No provider errors or secrets are exposed.
- Inference requires all of: Preview, branch `feature/guided-inquiry`, `INQUIRY_ASSISTANT_TRIAL_ENABLED=true`, server-only `INQUIRY_ASSISTANT_OPENAI_API_KEY`, existing target Supabase credentials, and an enabled unexpired independent database allowance. Production is explicitly blocked.
- Migration `20261017181430_inquiry_assistant_trial_budget.sql` was generated with Supabase CLI and applied only to mmnbqvwjemyxhjzhzlcu. New row is DISABLED, limit/reserved both 0, no expiry. Existing sign-studio budget is untouched. RLS and RPC grants deny anon/authenticated roles.
- Each provider attempt atomically reserves 50 US cents of conservative allowance; at most two attempts per turn, zero automatic retry, no refund after uncertain failure. Atomic conditional UPDATE prevents concurrent overspend. This counter is NOT actual billed cost. Current standard rates reviewed at https://developers.openai.com/api/docs/models/gpt-6-astra: input $10/M, cache write $12.50/M, output $50/M. Actual SDK UTF-8 body capped at 32,000 bytes, output 1,200 tokens, plain text only, no tools/media/continuation/redirect. Conservative input/cache-write plus output bound ~46 cents before small framing overhead; taxes/exchange rates are not represented. Recheck pricing before activation.
- Maximum configurable test allowance $5; expiry must be within 24 hours. No allowance was activated or recycled. For a later explicitly approved trial, configure branch-scoped secret and opt-in, redeploy, then enable only the approved allowance with an expiry; never reset existing reservations to extend a trial silently.
- 27 local tests pass, including the installed AI SDK generating and parsing its real request format through a mocked network, disabled configuration, rejected payloads, two-call cap and failed-call accounting. No paid API call occurred.
- Database transactional assertions accepted two reservations at a temporary 100-cent limit and rejected the third; ROLLBACK restored disabled/zero state. This was a sequential SQL assertion, not a concurrent load test. Confirmed anonymous and authenticated roles cannot call reserve.
- TypeScript and targeted lint passed. Default Turbopack build hit the existing external node_modules symlink restriction; webpack build used as compatible validation.
- Still pending: actual model quality/latency, branch secret configuration and approved spending, authenticated browser QA, voice/uploads, durable final inquiry and German emails. No production merge/promotion or customer communication.
