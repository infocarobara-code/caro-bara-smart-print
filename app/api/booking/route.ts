import { NextResponse } from "next/server";
import { Resend } from "resend";

type AppointmentType = "consultation" | "design" | "visit" | "installation";
type AppointmentMode = "at_store" | "we_come_free" | "phone_call";
type AppointmentStatus = "new" | "confirmed" | "done" | "cancelled";

type BookingRequestBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  type?: AppointmentType;
  mode?: AppointmentMode;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  language?: "ar" | "de" | "en" | string;
};

type AppointmentInsertRow = {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: AppointmentType;
  mode: AppointmentMode;
  street: string | null;
  houseNumber: string | null;
  postalCode: string | null;
  city: string | null;
  notes: string | null;
  status: AppointmentStatus;
};

type AppointmentSelectRow = AppointmentInsertRow & {
  id: string;
  created_at?: string;
};

const APPOINTMENT_TYPES: AppointmentType[] = [
  "consultation",
  "design",
  "visit",
  "installation",
];

const APPOINTMENT_MODES: AppointmentMode[] = [
  "at_store",
  "we_come_free",
  "phone_call",
];

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidAppointmentType(value: string): value is AppointmentType {
  return APPOINTMENT_TYPES.includes(value as AppointmentType);
}

function isValidAppointmentMode(value: string): value is AppointmentMode {
  return APPOINTMENT_MODES.includes(value as AppointmentMode);
}

function getTypeLabel(type: AppointmentType): string {
  switch (type) {
    case "consultation":
      return "Consultation";
    case "design":
      return "Design";
    case "visit":
      return "Site Visit";
    case "installation":
      return "Installation";
  }
}

function getModeLabel(mode: AppointmentMode): string {
  switch (mode) {
    case "at_store":
      return "Customer visits Caro Bara";
    case "we_come_free":
      return "Caro Bara visits customer (free)";
    case "phone_call":
      return "Phone call";
  }
}

function buildAddressLine(body: BookingRequestBody): string {
  const parts = [
    normalizeText(body.street),
    normalizeText(body.houseNumber),
    normalizeText(body.postalCode),
    normalizeText(body.city),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "—";
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value);
}

async function supabaseRestFetch<T>(params: {
  url: string;
  serviceRoleKey: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
}) {
  const response = await fetch(params.url, {
    method: params.method || "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: params.serviceRoleKey,
      Authorization: `Bearer ${params.serviceRoleKey}`,
      ...(params.prefer ? { Prefer: params.prefer } : {}),
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase request failed: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingRequestBody;

    const fullName = normalizeText(body.fullName);
    const email = normalizeText(body.email).toLowerCase();
    const phone = normalizeText(body.phone);
    const date = normalizeText(body.date);
    const time = normalizeText(body.time);
    const typeRaw = normalizeText(body.type);
    const modeRaw = normalizeText(body.mode);
    const street = normalizeText(body.street);
    const houseNumber = normalizeText(body.houseNumber);
    const postalCode = normalizeText(body.postalCode);
    const city = normalizeText(body.city);
    const notes = normalizeText(body.notes);
    const privacyAccepted = body.privacyAccepted === true;
    const marketingAccepted = body.marketingAccepted === true;

    if (
      !fullName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !typeRaw ||
      !modeRaw ||
      !privacyAccepted
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required booking fields or privacy consent not accepted.",
        },
        { status: 400 }
      );
    }

    if (!isValidAppointmentType(typeRaw)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment type.",
        },
        { status: 400 }
      );
    }

    if (!isValidAppointmentMode(modeRaw)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment mode.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment date format.",
        },
        { status: 400 }
      );
    }

    if (!isValidTime(time)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid appointment time format.",
        },
        { status: 400 }
      );
    }

    if (
      modeRaw === "we_come_free" &&
      (!street || !houseNumber || !postalCode || !city)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Address is required for free on-site visits.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const conflictUrl =
      `${supabaseUrl}/rest/v1/appointments` +
      `?select=id` +
      `&date=eq.${encodeURIComponent(date)}` +
      `&time=eq.${encodeURIComponent(time)}` +
      `&status=neq.cancelled` +
      `&limit=1`;

    const conflictRows = await supabaseRestFetch<Array<{ id: string }>>({
      url: conflictUrl,
      serviceRoleKey: supabaseServiceRoleKey,
    });

    if ((conflictRows ?? []).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This appointment time is already booked.",
        },
        { status: 409 }
      );
    }

    const appointmentRow: AppointmentInsertRow = {
      fullName,
      email,
      phone,
      date,
      time,
      type: typeRaw,
      mode: modeRaw,
      street: street || null,
      houseNumber: houseNumber || null,
      postalCode: postalCode || null,
      city: city || null,
      notes: notes || null,
      status: "new",
    };

    const insertUrl = `${supabaseUrl}/rest/v1/appointments`;

    const insertedAppointment = await supabaseRestFetch<AppointmentSelectRow[]>({
      url: insertUrl,
      serviceRoleKey: supabaseServiceRoleKey,
      method: "POST",
      body: [appointmentRow],
      prefer: "return=representation",
    });

    const inserted = insertedAppointment?.[0];

    if (!inserted) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save appointment.",
        },
        { status: 500 }
      );
    }

    const addressLine = buildAddressLine(body);

    const emailResult = await resend.emails.send({
      from: "Caro Bara <onboarding@resend.dev>",
      to: ["info@carobara.com"],
      replyTo: email,
      subject: `New Booking Request | ${fullName} | ${date} ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
          <h2 style="margin-bottom: 16px;">New Booking Request</h2>

          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Appointment Type:</strong> ${getTypeLabel(typeRaw)}</p>
          <p><strong>Appointment Mode:</strong> ${getModeLabel(modeRaw)}</p>
          <p><strong>Address:</strong> ${addressLine}</p>
          <p><strong>Notes:</strong> ${notes || "—"}</p>

          <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p><strong>Privacy Accepted:</strong> ${privacyAccepted ? "Yes" : "No"}</p>
          <p><strong>Marketing Accepted:</strong> ${marketingAccepted ? "Yes" : "No"}</p>
          <p><strong>Status:</strong> new</p>
          <p><strong>Source:</strong> booking</p>
        </div>
      `,
    });

    if ((emailResult as { error?: { message?: string } }).error) {
      return NextResponse.json(
        {
          success: false,
          error:
            (emailResult as { error?: { message?: string } }).error?.message ||
            "Appointment saved but email sending failed.",
          appointmentId: inserted.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        appointment: inserted,
        message: "Booking request submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}