import LegacyBooking from "./LegacyBooking";
import WeeklyBooking from "./WeeklyBooking";
export default function BookingPage() {
  return process.env.BOOKING_WEEKLY_ENABLED === "true" ? (
    <WeeklyBooking />
  ) : (
    <LegacyBooking />
  );
}
