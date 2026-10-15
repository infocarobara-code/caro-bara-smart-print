export type BookingMode = "we_come_free" | "at_store" | "phone_call";
export type Window = { days: number[]; start: number; end: number };
export type BookingPolicy = {
  version: number;
  horizonDays: number;
  leadMinutes: number;
  urgentPriceCents: number;
  cancellationHours: number;
  visitBufferMinutes: number;
  weekly: Record<BookingMode, Window[]>;
  durations: Record<BookingMode, number[]>;
  closedDates: string[];
};
export const DEFAULT_POLICY: BookingPolicy = {
  version: 1,
  horizonDays: 60,
  leadMinutes: 60,
  urgentPriceCents: 2000,
  cancellationHours: 24,
  visitBufferMinutes: 30,
  weekly: {
    we_come_free: [
      { days: [2, 3], start: 660, end: 1080 },
      { days: [5], start: 900, end: 1140 },
    ],
    at_store: [
      { days: [1, 2, 3, 4, 5], start: 540, end: 1080 },
      { days: [6], start: 540, end: 900 },
    ],
    phone_call: [{ days: [0, 1, 2, 3, 4, 5, 6], start: 0, end: 1440 }],
  },
  durations: {
    we_come_free: [60, 90, 120],
    at_store: [30, 60],
    phone_call: [15, 30],
  },
  closedDates: [],
};
export const MODES: BookingMode[] = ["we_come_free", "at_store", "phone_call"];
export type BusyPeriod = { reserved_start: string; reserved_end: string };
export type Candidate = {
  start: string;
  end: string;
  date: string;
  time: string;
};
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
export function berlinParts(instant: Date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}
export function validatePolicy(value: unknown): value is BookingPolicy {
  if (!value || typeof value !== "object") return false;
  const p = value as BookingPolicy;
  return (
    Number.isInteger(p.version) &&
    p.version > 0 &&
    Number.isInteger(p.horizonDays) &&
    p.horizonDays >= 1 &&
    p.horizonDays <= 90 &&
    Number.isInteger(p.leadMinutes) &&
    p.leadMinutes >= 0 &&
    p.leadMinutes <= 10080 &&
    p.urgentPriceCents === 2000 &&
    p.cancellationHours === 24 &&
    Number.isInteger(p.visitBufferMinutes) &&
    p.visitBufferMinutes >= 0 &&
    p.visitBufferMinutes <= 120 &&
    Array.isArray(p.closedDates) &&
    p.closedDates.length <= 365 &&
    p.closedDates.every(
      (d) =>
        /^\d{4}-\d{2}-\d{2}$/.test(d) &&
        !Number.isNaN(Date.parse(d)) &&
        new Date(d).toISOString().slice(0, 10) === d,
    ) &&
    MODES.every(
      (mode) =>
        Array.isArray(p.weekly?.[mode]) &&
        p.weekly[mode].length <= 14 &&
        p.weekly[mode].every(
          (w) =>
            Array.isArray(w.days) &&
            w.days.length > 0 &&
            w.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6) &&
            Number.isInteger(w.start) &&
            Number.isInteger(w.end) &&
            w.start >= 0 &&
            w.end <= 1440 &&
            w.start < w.end,
        ) &&
        Array.isArray(p.durations?.[mode]) &&
        p.durations[mode].length > 0 &&
        p.durations[mode].length <= 8 &&
        p.durations[mode].every(
          (d) => Number.isInteger(d) && d >= 15 && d <= 120 && d % 15 === 0,
        ),
    )
  );
}
export function generateCandidates(
  policy: BookingPolicy,
  mode: BookingMode,
  duration: number,
  busy: BusyPeriod[],
  now = new Date(),
): Candidate[] {
  if (
    !validatePolicy(policy) ||
    !MODES.includes(mode) ||
    !policy.durations[mode].includes(duration)
  )
    return [];
  const firstDate = berlinParts(now).date;
  const lastDate = new Date(`${firstDate}T12:00:00Z`);
  lastDate.setUTCDate(lastDate.getUTCDate() + policy.horizonDays);
  const cutoff = lastDate.toISOString().slice(0, 10);
  const buffer =
    mode === "we_come_free" ? policy.visitBufferMinutes * 60000 : 0;
  const candidates: Candidate[] = [];
  const first =
    Math.ceil((now.getTime() + policy.leadMinutes * 60000) / 1800000) * 1800000;
  const last = lastDate.getTime() + 86400000;
  for (let t = first; t < last; t += 1800000) {
    const start = new Date(t),
      end = new Date(t + duration * 60000);
    const local = berlinParts(start),
      finish = berlinParts(end);
    if (
      local.date < firstDate ||
      local.date >= cutoff ||
      policy.closedDates.includes(local.date)
    )
      continue;
    const day = new Date(`${local.date}T12:00:00Z`).getUTCDay();
    const endMinute =
      finish.date === local.date
        ? finish.minutes
        : finish.time === "00:00"
          ? 1440
          : -1;
    // Reject meetings crossing a clock change, including repeated autumn times.
    if (endMinute - local.minutes !== duration) continue;
    if (
      !policy.weekly[mode].some(
        (w) =>
          w.days.includes(day) &&
          local.minutes >= w.start &&
          endMinute <= w.end,
      )
    )
      continue;
    if (
      busy.some(
        (b) =>
          t - buffer < Date.parse(b.reserved_end) &&
          end.getTime() + buffer > Date.parse(b.reserved_start),
      )
    )
      continue;
    candidates.push({
      start: start.toISOString(),
      end: end.toISOString(),
      date: local.date,
      time: local.time,
    });
  }
  return candidates;
}
