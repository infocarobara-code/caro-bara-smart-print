# Administration operations design

## Sources and boundaries

- Current appointments: cb_appointments; weekly availability: cb_booking_settings.policy; notification state: cb_booking_outbox. Existing RPCs alone perform booking transitions and concurrency checks. No browser-side database writes.
- Requests: existing requests source; customers: existing customers source. An email/WhatsApp handoff is never inserted as a received request.
- Public catalogue remains code-managed in this batch. Do not present imaginary CMS actions, invoices, payment receipts or delivery metrics.

## Daily workflow

1. Open appointments: upcoming pending requests first, chronological order. Distinguish confirmed, late cancellation review, past undecided requests and history.
2. Show actionable summary counts from the loaded snapshot; disclose query bounds. Never describe bounded counts as totals for the entire business.
3. Each appointment shows time range, mode, customer, status and one relevant primary action. Keep original address/notes/reference in expandable details. Pending holds remain in force until an explicit server transition.
4. Email review identifies appointment, event and recipient. Show safe failure guidance and retry only eligible work for that appointment. Provider acceptance is not inbox receipt; bounces need provider review until a webhook is implemented.
5. Weekly schedule is separate. Draft changes survive refresh and language switching, retain the concurrency revision, and require explicit discard to replace them.
6. Requests show a single status; details and editing expand on demand. Customer records become responsive cards; bulk deletion is an explicit secondary operation with confirmation.

## Batch acceptance

- Three-language parity, Berlin dates/DST, real source counts, no false empty state on malformed data.
- Upcoming appointment reads cannot be displaced by a large historical archive; limited queries report truncation.
- Double-click guards act synchronously, not only after React rerenders; session/origin/revision checks stay server-side.
- Existing unit/security tests plus targeted model and component tests, types/lint/build. No production test bookings or emails.
- Release only the exact tested Git tree. A successful deployment build does not prove alias promotion or authenticated mobile UI verification.

## Next modules, without duplicate sources of truth

| Module | Current source | Required next change |
| --- | --- | --- |
| Services / categories / translations / ordering | Existing repository catalogue | Design one validated versioned catalogue schema and a staged editor; block publish when any AR/DE/EN required translation is missing. Do not create a disconnected editor that public pages ignore. |
| Images | Existing site assets | Add server-authorized uploads, MIME/size validation and replacement references after catalogue identifiers are stable. |
| Contact details | Existing legal/company configuration and booking routing | Inventory legal versus operational fields before changing; never overwrite verified legal identity with editable marketing data. |
| Received inquiries | Existing internal historical requests; current external handoffs | Keep historical requests visible; do not invent inbox intake from link clicks. Implement a genuine inbound mailbox/webhook only as a separate validated module. |
| Mail delivery | Outbox/provider acceptance | Provider bounce/delivery webhook with authenticated signatures and idempotency before claiming delivery inside administration. |
| Large archive | Bounded current work and100 older pending/late-cancellation review rows and100 historical/inactive rows | Add cursor pagination/export before calling this a complete reporting system. Truncation is visible now. |

No payment provider, new subscription, expanded permission, deletion or production test message is part of this batch.
