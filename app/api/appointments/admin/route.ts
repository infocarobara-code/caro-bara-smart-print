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
    const now = encodeURIComponent(new Date().toISOString());
    // Separate bounded sets: a long archive must never push upcoming work out of view.
    const fields = "id,reference,mode,start_at,end_at,status,full_name,email,phone,address,notes,language,urgent,price_cents,revision,created_at,updated_at,cancellation_requested_at";
    const [upcoming, unresolved, archive, settings, outbox] = await Promise.all([
      database< {id:string}[] >(`cb_appointments?select=${fields}&end_at=gte.${now}&status=in.(pending,confirmed)&order=start_at.asc,id.asc&limit=301`),
      database< {id:string}[] >(`cb_appointments?select=${fields}&end_at=lt.${now}&or=(status.eq.pending,and(status.eq.confirmed,cancellation_requested_at.not.is.null))&order=start_at.asc,id.asc&limit=101`),
      database< {id:string}[] >(`cb_appointments?select=${fields}&or=(status.in.(cancelled,rejected),and(status.eq.confirmed,end_at.lt.${now},cancellation_requested_at.is.null))&order=updated_at.desc,id.asc&limit=101`),
      database("cb_booking_settings?select=policy,updated_at"),
      database(
        "cb_booking_outbox?select=id,revision,event,recipient,attempts,last_error,sent_at,appointment_id,created_at,reference:snapshot->>reference&order=sent_at.desc.nullsfirst,created_at.desc&limit=100",
      ),
    ]);
    return ok({ appointments:[...upcoming.slice(0,300),...unresolved.slice(0,100),...archive.slice(0,100)], settings, outbox,
      limits:{upcoming:upcoming.length>300,unresolved:unresolved.length>100,archive:archive.length>100} });
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
      if (typeof b.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id)) throw new BookingError("INVALID_INPUT",400);
      const since=encodeURIComponent(new Date(Date.now()-23*60*60*1000).toISOString());
      const eligible=await database<unknown[]>(`cb_booking_outbox?appointment_id=eq.${b.id}&sent_at=is.null&attempts=lt.5&created_at=gt.${since}&select=id&limit=1`);
      if (!eligible.length) throw new BookingError("STATE_CONFLICT",409);
      after(async () => {
        await dispatchNotifications(b.id as string).catch(() => {});
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
