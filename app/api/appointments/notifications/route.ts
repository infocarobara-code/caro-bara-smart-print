import { timingSafeEqual } from "node:crypto";
import { dispatchNotifications } from "@/lib/appointments/notifications";
import { fail, ok } from "@/lib/appointments/http";
import { BookingError } from "@/lib/appointments/store";
export const maxDuration = 60;
// Connect an authorized scheduler only after its cadence and account limits are verified.
export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET,
      actual = request.headers.get("authorization") || "",
      expected = `Bearer ${secret}`;
    if (
      !secret ||
      Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
    )
      throw new BookingError("UNAUTHORIZED", 401);
    return ok(await dispatchNotifications());
  } catch (e) {
    return fail(e);
  }
}

// Database cron mints a one-use, two-minute ticket; it cannot read or alter bookings.
export async function POST(request: Request) {
  try {
    const { parseBody, database } = await import("@/lib/appointments/store");
    const body = await parseBody(request);
    if (
      typeof body.ticket !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(body.ticket)
    )
      throw new BookingError("UNAUTHORIZED", 401);
    if (
      !(await database<boolean>("rpc/cb_booking_consume_wakeup", "POST", {
        p_ticket: body.ticket,
      }))
    )
      throw new BookingError("UNAUTHORIZED", 401);
    const { after } = await import("next/server");
    after(async () => {
      await dispatchNotifications().catch(() => {});
    });
    return ok({ accepted: true });
  } catch (e) {
    return fail(e);
  }
}
