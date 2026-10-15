import { NextResponse } from "next/server";
import { BookingError } from "./store";
export function fail(error: unknown) {
  const safe =
    error instanceof BookingError
      ? error
      : new BookingError("BOOKING_UNAVAILABLE");
  return NextResponse.json(
    { success: false, error: safe.code },
    { status: safe.status, headers: { "Cache-Control": "no-store" } },
  );
}
export function ok(body: object) {
  return NextResponse.json(
    { success: true, ...body },
    { headers: { "Cache-Control": "no-store" } },
  );
}
