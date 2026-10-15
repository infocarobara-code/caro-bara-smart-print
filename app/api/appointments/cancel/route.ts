import { after } from "next/server";
import {
  assertOrigin,
  database,
  parseBody,
  rateLimit,
  BookingError,
} from "@/lib/appointments/store";
import { dispatchNotifications } from "@/lib/appointments/notifications";
import { fail, ok } from "@/lib/appointments/http";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const b = await parseBody(request);
    await rateLimit(request, "cancel");
    if (
      typeof b.reference !== "string" ||
      !/^CB-[A-F0-9]{32}$/i.test(b.reference) ||
      typeof b.email !== "string" ||
      b.email.length > 254
    )
      throw new BookingError("INVALID_INPUT", 400);
    const result = await database<string>("rpc/cb_booking_cancel", "POST", {
      p_reference: b.reference.toUpperCase(),
      p_email: b.email.trim().toLowerCase(),
    });
    if (result === "NOT_FOUND") throw new BookingError("CODE_NOT_FOUND", 404);
    after(async () => {
      await dispatchNotifications().catch(() => {});
    });
    return ok({ status: result });
  } catch (e) {
    return fail(e);
  }
}
