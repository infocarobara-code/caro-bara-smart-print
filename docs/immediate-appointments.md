# Optional immediate appointments at a flexible time

## Problem and scope
The previous EUR20 priority checkbox did not provide a different schedule. The owner explicitly requested EUR80, a separate optional item, and flexible requested times every weekday. This is a distinct opt-in service, not an automatically selected surcharge or a guaranteed immediate dispatch.

## Implementation
- Independent labelled fieldset before the date picker in AR/DE/EN; neutral styling, no preselection. Regular bookings remain available without the fee.
- Selecting it reloads free future slots across all seven weekdays. Duration limits, Berlin timezone/DST, lead time, closed dates, travel buffers and collisions still apply. All requests need owner confirmation.
- Availability API and server request validation use the same urgent selection. The atomic database function checks it again, retaining locks/idempotency/outbox behavior.
- New price EUR80, controlled by the stored policy; historical EUR20 records and message snapshots are preserved. Administration and German confirmation/PDF derive the displayed price from each appointment, never from a hardcoded current fee.
- No payment is collected by this implementation; payment remains by agreement.

## Release gate
The migration changes the policy price and the application validates that price. Deploy and migrate in a coordinated release window; do not apply it against the still-active legacy application. Confirm the selected production deployment and alias before enabling booking traffic. Existing Vercel authorization/promotion is unresolved; preparing a branch/preview is not public publication.

## Verification
Local tests cover all weekdays, ordinary scheduling, collision/closure protection, database rejection of a Sunday ordinary request and acceptance of its optional flexible counterpart, new EUR80 pricing, historical EUR20 compatibility, and German receipt amount. No live booking, email, payment or customer transition is used for QA.
