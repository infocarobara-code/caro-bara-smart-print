import { createHash, randomBytes } from "node:crypto";
import {
  DEFAULT_POLICY,
  generateCandidates,
  validatePolicy,
  type BookingMode,
  type BookingPolicy,
  type BusyPeriod,
} from "./policy";
export type Appointment = {
  id: string;
  reference: string;
  idempotency_key: string;
  payload_hash: string;
  mode: BookingMode;
  start_at: string;
  end_at: string;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
  full_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  language: "ar" | "de" | "en";
  urgent: boolean;
  price_cents: number;
  revision: number;
  created_at: string;
  updated_at: string;
  cancellation_requested_at: string | null;
};
export class BookingError extends Error {
  constructor(
    public code: string,
    public status = 503,
  ) {
    super(code);
  }
}
export async function database<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new BookingError("BOOKING_UNAVAILABLE");
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const text = typeof data?.message === "string" ? data.message : "";
      if (/SLOT_UNAVAILABLE/.test(text))
        throw new BookingError("SLOT_UNAVAILABLE", 409);
      if (/STATE_CONFLICT|IDEMPOTENCY_CONFLICT/.test(text))
        throw new BookingError("STATE_CONFLICT", 409);
      console.error("Appointment storage unavailable", {
        status: response.status,
        code: data?.code,
      });
      throw new BookingError("BOOKING_UNAVAILABLE");
    }
    return (await response.json()) as T;
  } catch (e) {
    if (e instanceof BookingError) throw e;
    console.error("Appointment storage transport failed", {
      category: e instanceof Error ? e.name : "unknown",
    });
    throw new BookingError("BOOKING_UNAVAILABLE");
  }
}
export async function snapshot() {
  const [settings, busy] = await Promise.all([
    database<{ policy: BookingPolicy }[]>(
      "cb_booking_settings?id=eq.true&select=policy",
    ),
    database<BusyPeriod[]>("rpc/cb_booking_busy", "POST", {}),
  ]);
  if (
    !validatePolicy(settings[0]?.policy) ||
    !Array.isArray(busy) ||
    busy.some(
      (b) =>
        !Number.isFinite(Date.parse(b.reserved_start)) ||
        !Number.isFinite(Date.parse(b.reserved_end)),
    )
  )
    throw new BookingError("BOOKING_UNAVAILABLE");
  return { policy: settings[0].policy, busy };
}
export async function rateLimit(request: Request, suffix: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new BookingError("BOOKING_UNAVAILABLE");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256")
    .update(`${secret}:${suffix}:${ip}`)
    .digest("hex");
  if (
    !(await database<boolean>("rpc/cb_booking_limit", "POST", { p_key: key }))
  )
    throw new BookingError("TOO_MANY_REQUESTS", 429);
}
export function assertOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new BookingError("FORBIDDEN", 403);
}
export async function parseBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new BookingError("INVALID_INPUT", 400);
  const text = await request.text();
  if (text.length > 12000) throw new BookingError("INVALID_INPUT", 413);
  try {
    const value = JSON.parse(text);
    if (!value || Array.isArray(value) || typeof value !== "object")
      throw new Error();
    return value;
  } catch {
    throw new BookingError("INVALID_INPUT", 400);
  }
}
function field(value: unknown, max: number) {
  if (typeof value !== "string" || value.length > max || value.includes("\0"))
    throw new BookingError("INVALID_INPUT", 400);
  return value.trim();
}
export function validateInput(body: Record<string, unknown>) {
  const mode = field(body.mode, 30) as BookingMode;
  if (
    !(mode in DEFAULT_POLICY.durations) ||
    !["we_come_free", "phone_call", "at_store"].includes(mode)
  )
    throw new BookingError("INVALID_INPUT", 400);
  const full_name = field(body.fullName, 160),
    email = field(body.email, 254).toLowerCase(),
    phone = field(body.phone, 50);
  const address = field(body.address ?? "", 500),
    notes = field(body.notes ?? "", 2000);
  const start_at = field(body.start, 30),
    idempotency_key = field(body.idempotencyKey, 36);
  const language = field(body.language, 2) as Appointment["language"];
  if (
    !full_name ||
    !phone ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !["ar", "de", "en"].includes(language) ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00.000Z$/.test(start_at) ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      idempotency_key,
    ) ||
    !Number.isInteger(body.duration) ||
    typeof body.urgent !== "boolean" ||
    body.privacyAccepted !== true ||
    body.policyAccepted !== true ||
    (mode === "we_come_free" && !address)
  )
    throw new BookingError("INVALID_INPUT", 400);
  return {
    mode,
    full_name,
    email,
    phone,
    address,
    notes,
    start_at,
    idempotency_key,
    language,
    urgent: body.urgent,
    duration: body.duration as number,
  };
}
export async function createAppointment(body: Record<string, unknown>) {
  const input = validateInput(body);
  const { duration, ...data } = input;
  const payload_hash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
  // A retry after a network loss must recover its saved receipt before availability is checked.
  const existing = await database<Appointment[]>(
    `cb_appointments?idempotency_key=eq.${input.idempotency_key}&select=*`,
  );
  if (existing[0]) {
    if (existing[0].payload_hash !== payload_hash)
      throw new BookingError("STATE_CONFLICT", 409);
    return existing[0];
  }
  const { policy, busy } = await snapshot();
  const candidate = generateCandidates(policy, data.mode, duration, busy).find(
    (c) => c.start === data.start_at,
  );
  if (!candidate) throw new BookingError("SLOT_UNAVAILABLE", 409);
  return database<Appointment>("rpc/cb_booking_create", "POST", {
    p_data: {
      ...data,
      end_at: candidate.end,
      reference: `CB-${randomBytes(16).toString("hex").toUpperCase()}`,
      payload_hash,
    },
  });
}
