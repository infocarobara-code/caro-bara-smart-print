import {
  generateCandidates,
  MODES,
  type BookingMode,
} from "@/lib/appointments/policy";
import { snapshot, BookingError } from "@/lib/appointments/store";
import { fail, ok } from "@/lib/appointments/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    if (process.env.BOOKING_WEEKLY_ENABLED !== "true")
      throw new BookingError("BOOKING_NOT_ACTIVE", 503);
    const url = new URL(request.url),
      mode = url.searchParams.get("mode") as BookingMode,
      duration = Number(url.searchParams.get("duration")),
      urgent = url.searchParams.get("urgent") === "true";
    if (!MODES.includes(mode) || !Number.isInteger(duration))
      throw new BookingError("INVALID_INPUT", 400);
    const { policy, busy } = await snapshot();
    if (!policy.durations[mode].includes(duration))
      throw new BookingError("INVALID_INPUT", 400);
    return ok({
      slots: generateCandidates(policy, mode, duration, busy, new Date(), urgent),
      policy,
      timezone: "Europe/Berlin",
    });
  } catch (e) {
    return fail(e);
  }
}
