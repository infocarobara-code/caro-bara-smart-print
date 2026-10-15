import { after } from "next/server";
import {
  BookingError,
  assertOrigin,
  createAppointment,
  parseBody,
  rateLimit,
} from "@/lib/appointments/store";
import { dispatchNotifications } from "@/lib/appointments/notifications";
import { fail, ok } from "@/lib/appointments/http";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    if (process.env.BOOKING_WEEKLY_ENABLED !== "true")
      throw new BookingError("BOOKING_NOT_ACTIVE", 503);
    assertOrigin(request);
    const body = await parseBody(request);
    await rateLimit(request, "create");
    const a = await createAppointment(body);
    after(async () => {
      await dispatchNotifications(a.id).catch(() => {});
    });
    return ok({
      reference: a.reference,
      status: a.status,
      notificationStatus: "queued",
      start: a.start_at,
      end: a.end_at,
    });
  } catch (e) {
    return fail(e);
  }
}
