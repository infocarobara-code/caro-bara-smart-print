# Administration workspace — 2026-10-15

## Evidence and priorities

| Priority | Problem | Evidence | Change / verification |
| --- | --- | --- | --- |
| P0 | A write followed by a failed refresh displayed success | AppointmentOffice ignored load's caught error | load returns a result; success notice requires a successful refresh. Regression exercises actual component actions. |
| P0 | Refresh discarded an unsaved weekly schedule | load always replaced policy and revision | Preserve draft plus its original optimistic revision; explicit discard reloads the saved schedule. Regression edits then refreshes. |
| P1 | Current appointments were separate from the administration entry | Login redirected to legacy requests; old scheduler differed from cb_booking_settings | /admin and login lead to authenticated current appointments; shared navigation; weekly-enabled legacy scheduling links redirect to current office; explicit archive remains accessible. |
| P1 | Selected request status did not constrain displayed groups | All three groups rendered regardless of office | Status navigation now filters the actual request group. Existing request/customer records and actions retained. |
| P1 | Email acceptance implied delivery; no accepted history | Admin query selected only sent_at=null | Queue plus accepted provider history, unsent first, max100. Safe status labels explicitly distinguish provider acceptance from inbox receipt. No webhook or bounce sync is claimed. |
| P1 | Past requests could be confirmed in UI | Confirm button shown for every pending row; server rejects past starts | Past rows hidden by default, available through history; past confirmation disabled. Regression covers all three languages. |
| P2 | Customer-sized styling, verbose cards and unrelated footer | AppointmentOffice imported weekly customer CSS; login English only | Dedicated responsive administration styles, compact shared navigation, appointment detail disclosure, separate daily/email/schedule views, translated labelled login. Public footer remains on public pages. |

## Shared rules

- Daily work first; settings and historical systems are separate destinations. Do not invent statistics or show customer handoffs as received inquiries.
- Persist canonical identifiers; translate interface labels in Arabic/German/English. Preserve customer notes and addresses verbatim. Display appointment times in Europe/Berlin, including the end time.
- Saving, queuing, provider acceptance and receiving-server delivery are separate states. No success notice may stand in for another state. Do not expose raw provider errors or private snapshots.
- Refresh must preserve an unsaved draft and its concurrency revision. Conflicts require reviewing current saved data; never silently overwrite another administrator.
- Server authentication, origin checks, server-only database credentials, policy validation and revision locks remain mandatory. New navigation does not grant access.
- Appointment confirmation/cancellation are real business actions: no production test bookings, emails or transitions for visual QA.

## Scope / remaining work

This batch does not implement a catalogue CMS, new admin roles, bounce webhooks or a replacement for historical request/customer tables. The legacy archive retains its existing actions; it is not a new read-only database. Customer-table mobile ergonomics and the remaining long request editor need a separate focused batch. The dashboard exposes at most300 appointments and100 prioritized emails and does not claim exhaustive reporting. Live authenticated UI inspection requires an admin session; unit fixtures do not prove production sign-in.
