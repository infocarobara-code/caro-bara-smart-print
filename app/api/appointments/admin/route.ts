import { after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  assertOrigin,
  database,
  parseBody,
  BookingError,
} from "@/lib/appointments/store";
import { validatePolicy } from "@/lib/appointments/policy";
import { dispatchNotifications } from "@/lib/appointments/notifications";
import { fail, ok } from "@/lib/appointments/http";
export const maxDuration = 60;
export async function GET() {
  try {
    if (!(await isAdminAuthenticated()))
      throw new BookingError("UNAUTHORIZED", 401);
    const [appointments, settings, outbox] = await Promise.all([
      database("cb_appointments?select=*&order=start_at.desc&limit=300"),
      database("cb_booking_settings?select=policy,updated_at"),
      database(
        "cb_booking_outbox?select=id,event,recipient,attempts,last_error,sent_at,appointment_id,created_at&sent_at=is.null&order=created_at.asc&limit=100",
      ),
    ]);
    return ok({ appointments, settings, outbox });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated()))
      throw new BookingError("UNAUTHORIZED", 401);
    assertOrigin(request);
    const b = await parseBody(request);
    if (b.action === "retry") {
      after(async () => {
        await dispatchNotifications().catch(() => {});
      });
      return ok({ queued: true });
    }
    if (b.action === "settings") {
      if (
        !validatePolicy(b.policy) ||
        typeof b.updatedAt !== "string" ||
        !Number.isFinite(Date.parse(b.updatedAt))
      )
        throw new BookingError("INVALID_INPUT", 400);
      const saved = await database<unknown[]>(
        `cb_booking_settings?id=eq.true&updated_at=eq.${encodeURIComponent(b.updatedAt)}`,
        "PATCH",
        { policy: b.policy, updated_at: new Date().toISOString() },
      );
      if (!saved.length) throw new BookingError("STATE_CONFLICT", 409);
      return ok({ saved: true });
    }
    if (
      typeof b.id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(b.id) ||
      !Number.isInteger(b.revision) ||
      !["confirmed", "cancelled", "rejected"].includes(String(b.status))
    )
      throw new BookingError("INVALID_INPUT", 400);
    await database("rpc/cb_booking_transition", "POST", {
      p_id: b.id,
      p_status: b.status,
      p_expected: b.revision,
    });
    after(async () => {
      await dispatchNotifications(b.id as string).catch(() => {});
    });
    return ok({ saved: true });
  } catch (e) {
    return fail(e);
  }
}
