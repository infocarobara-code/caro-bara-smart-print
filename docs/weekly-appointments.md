# Weekly appointments: implementation and activation

Scope: infocarobara-code/caro-bara-smart-print only. Baseline main 4a0fbaf.
Production activation is controlled by BOOKING_WEEKLY_ENABLED and a verified
Vercel promotion; see the deployment evidence at the end of this register. It does not replace an unavailable database
with invented availability or memory-only bookings.

## Owner requirements implemented in code

- Europe/Berlin calendar; future available days only, rolling 60-day horizon.
- Customer visits: Tuesday/Wednesday 11:00–18:00, Friday 15:00–19:00.
  Durations 60/90/120 minutes; default 120. Thirty-minute travel buffer around
  visits, adjustable in the office. Start choices every 30 minutes.
- Shop: existing administration's published hours, Mon–Fri 09:00–18:00,
  Saturday 09:00–15:00. Homepage currently has inconsistent Saturday hours;
  confirm the real hours before activation. Shop durations 30/60 minutes.
- Phone: 24-hour request availability, 15/30-minute appointments. It remains
  subject to owner approval, not a guarantee of immediate or overnight service.
- Requests reserve shared staff time while pending. Approving makes them
  confirmed; rejecting/cancelling releases time. Existing booked/blocked legacy
  slots and active legacy appointments remain conflicts. Existing data is kept.
- Optional express surcharge EUR 20 total. Price computed in the database,
  never trusted from the browser. No online payment is claimed or collected;
  payment is by agreement. There is no guarantee of out-of-hours availability.
- German transactional email and PDF for both request receipt and confirmation.
  Original customer-written content stays unchanged. Calendar file only with
  confirmation/cancellation; stable UID and sequence, UTC instants, Berlin
  display, actual visit address, company phone/email/address and 24-hour alarm.
  Import works without a Google/Apple/Outlook account integration. This is a
  calendar attachment, not two-way synchronization of personal calendars.
- Cancellation requires unpredictable appointment code + matching email.
  At least 24 hours before: release time atomically. Within 24 hours: record a
  late cancellation for owner review and retain the reservation. No automated
  penalty or invented restriction of statutory rights.
- DE/AR/EN customer and office interfaces. Language changes preserve form,
  selection and step. Only onsite visits require a customer address.
- Durable notification outbox written in the appointment transaction. Provider
  acceptance is distinguished from final mailbox delivery. Exact email payloads
  are stored for idempotent retries. Five attempts within 23 hours, then human
  review. Earlier unsent events block later events for the same recipient to
  prevent a stale confirmation following a cancellation.

## Architecture and authorization

Single authoritative policy: cb_booking_settings.policy. TypeScript defaults
are seed/UI defaults, not a fallback database. API refuses to offer availability
if policy/conflict data cannot be read. cb_appointments is the new system of
record; it is not copied into legacy appointments. A clear link in existing
administration opens /admin/appointments. Legacy records remain in their office.

The additive migration is db/migrations/20261015_weekly_appointments.sql.
All new tables use RLS; anon/authenticated have no access. Privileged functions
are service-role-only. Admin reads and mutations authenticate on the server.
Mutations check same origin, bounded input and field validation. Database locks
serialize reservations and state transitions; revision checks prevent stale
admin overwrites. Client idempotency survives network retries in the open form.
Settings have an optimistic updated_at lease. IP identifiers for rate limiting
are hashed with the existing secret and old limiter rows are cleaned up.

## Activation checklist (requires actual access)

1. Connect Supabase and verify the project matches the SUPABASE_URL configured
   in this Vercel project. Investigate the existing HTTP 500 transport failure;
   do not infer its cause from `fetch failed`.
2. Back up schema, inspect legacy date/time formats, then apply the additive
   migration to this database only. Test service-role and anonymous access.
3. Verify sender/recipient environment variables and domain delivery settings:
   RESEND_API_KEY, RESEND_FROM_EMAIL, REQUEST_RECEIVER_EMAIL (optional; otherwise
   confirmed legal email info@carobara.de), existing ADMIN_SESSION_SECRET.
4. Verify the Supabase pg_cron job carobara-booking-outbox (every five minutes).
   The database calls the fixed app endpoint with a one-use, two-minute ticket
   carrying no customer data. The service-only consume RPC rejects replay. No
   permanent secret is transmitted. Immediate dispatch uses Next after(); the
   office also has a retry action. GET supports an optional CRON_SECRET path,
   but that path is not needed for the installed database job.
   Do not claim guaranteed final email delivery; add verified provider webhooks
   for mailbox-delivery/bounce tracking if required.
5. Review actual shop opening hours and the provisional 30-minute travel buffer.
6. Set BOOKING_WEEKLY_ENABLED=true in the intended environment and rebuild.
   The public /booking switches to the new component only with that flag. New
   availability and request endpoints fail closed without it. Legacy POST
   /api/booking returns 410 when enabled, preventing a bypass of new conflicts.
7. Test in a controlled environment: DE/AR/EN, 390px phone, DST weekends, two
   simultaneous requests, duplicate retry, approve/reject, email/PDF/ICS,
   cancel just before/at/after 24 hours, notification failure/retry, admin gates,
   policy changes reflected in the public UI. No real customer test messages.
8. Promote the verified Vercel build and inspect the actual public domain.
   Rollback flag off + redeploy returns the existing flow without deleting data.

## Validation evidence

Automated tests cover recurrence/window bounds, timezone and DST changes,
conflicts/buffers, legal price, German documents, ICS byte folding, input
validation, admin denial before DB access, and PostgreSQL migration replay,
private tables/RPCs, idempotency, reservation conflicts, state revisions,
24-hour cancellation behavior, durable event ordering, leases and rate limits.
Tests use PGlite (dev dependency) and synthetic local records only.

Public /booking/weekly is a noindex review route; it shares the same gated APIs.
The original preparation used local synthetic data. After Supabase was connected,
the matching carobara-requests project was restored from INACTIVE, the additive
migration and legacy guards were applied, and its existing two appointment rows
were preserved. New tables and legacy client-data tables are service-only with
RLS. The queue wakeup migration installs a no-cost database cron. No real
customer test email, payment or paid plan change has been performed.

## Sources reviewed

- Calendly official Help: availability, busy-time checks, buffers and notices.
  https://calendly.com/help/scheduling-faq
  https://calendly.com/help/how-to-use-buffers
- Google Calendar official invitation guidance: ICS can support calendar users
  without writing directly into their calendar; users control adding events.
  https://developers.google.com/workspace/calendar/api/concepts/inviting-attendees-to-events
- Resend official idempotency guidance: provider keys expire after 24 hours;
  retry exact payloads, and retain durable local queue history.
  https://resend.com/changelog/idempotency-keys
- German BGB §309(5): no automatic flat cancellation damages were introduced.
  https://www.gesetze-im-internet.de/bgb/__309.html

## Connection and database evidence (15 October 2026)

- Vercel SUPABASE_URL exactly matched mmnbqvwjemyxhjzhzlcu.supabase.co.
- Supabase INACTIVE -> restore -> ACTIVE_HEALTHY. Existing days endpoint
  changed from HTTP 500 to HTTP 200 after restore.
- Legacy appointment labels included Arabic digits and AM/PM suffixes.
  A helper normalizes these for conflict reads without rewriting old data.
- Security advisors now show only informational no-policy notices for the
  intended service-only tables, with no critical public-table exposure.
- New schema validation and rollback-only checks do not create real bookings.

The production SQL rollback-only acceptance transaction passed: create pending
request, fixed EUR 20 fee, confirm, cancel and one-use wakeup consumption/replay
rejection. It committed no appointment or notification rows. Cron schedule was
queried and confirmed active at five-minute intervals. Existing two legacy
appointment records remain. A one-page German PDF containing Arabic original
customer text was rendered and visually inspected locally.
