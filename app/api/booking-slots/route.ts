import { NextResponse } from "next/server";

type SlotStatus = "available" | "booked" | "blocked";

type RawBookingSlotRow = {
  id?: string | null;
  booking_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string | null;
  note?: string | null;
  created_at?: string | null;
};

type BookingSlot = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: SlotStatus;
  note: string;
  created_at?: string;
};

type CreateBookingSlotBody = {
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  status?: SlotStatus | string;
  note?: string;
};

type UpdateBookingSlotBody = {
  id?: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  status?: SlotStatus | string;
  note?: string;
};

type DeleteBookingSlotBody = {
  id?: string;
};

const BOOKING_SLOTS_TABLE = "booking_slots";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTime(value: unknown): string {
  const raw = normalizeText(value);

  if (!raw) {
    return "";
  }

  if (/^\d{2}:\d{2}$/.test(raw)) {
    return raw;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
    return raw.slice(0, 5);
  }

  return raw;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value);
}

function isValidStatus(value: string): value is SlotStatus {
  return value === "available" || value === "booked" || value === "blocked";
}

function compareTimes(a: string, b: string): number {
  return a.localeCompare(b);
}

function isFutureOrToday(dateString: string): boolean {
  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return date >= normalizedToday;
}

function normalizeBookingSlot(row: RawBookingSlotRow): BookingSlot | null {
  const id = normalizeText(row.id);
  const bookingDate = normalizeText(row.booking_date);
  const startTime = normalizeTime(row.start_time);
  const endTime = normalizeTime(row.end_time);
  const note = normalizeText(row.note);
  const createdAt = normalizeText(row.created_at);
  const statusRaw = normalizeText(row.status);

  if (
    !id ||
    !bookingDate ||
    !startTime ||
    !endTime ||
    !isValidDate(bookingDate) ||
    !isValidTime(startTime) ||
    !isValidTime(endTime)
  ) {
    return null;
  }

  const status: SlotStatus = isValidStatus(statusRaw) ? statusRaw : "available";

  return {
    id,
    booking_date: bookingDate,
    start_time: startTime,
    end_time: endTime,
    status,
    note,
    created_at: createdAt || undefined,
  };
}

async function supabaseRestFetch<T>(params: {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
}) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${params.path}`, {
    method: params.method || "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
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

async function ensureNoOverlap(params: {
  booking_date: string;
  start_time: string;
  end_time: string;
  excludeId?: string;
}) {
  const rows = await supabaseRestFetch<RawBookingSlotRow[]>({
    path:
      `${BOOKING_SLOTS_TABLE}?select=id,booking_date,start_time,end_time,status` +
      `&booking_date=eq.${encodeURIComponent(params.booking_date)}` +
      `&order=start_time.asc`,
  });

  const normalizedRows = rows
    .map(normalizeBookingSlot)
    .filter((item): item is BookingSlot => Boolean(item));

  const conflicts = normalizedRows.filter((row) => {
    if (params.excludeId && row.id === params.excludeId) {
      return false;
    }

    return (
      compareTimes(params.start_time, row.end_time) < 0 &&
      compareTimes(params.end_time, row.start_time) > 0
    );
  });

  if (conflicts.length > 0) {
    throw new Error("This time slot overlaps with an existing slot on the same day.");
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bookingDate = normalizeText(url.searchParams.get("booking_date"));
    const includePast = url.searchParams.get("include_past") === "true";

    const filters: string[] = ["select=*", "order=booking_date.asc,start_time.asc"];

    if (bookingDate) {
      if (!isValidDate(bookingDate)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid booking_date format.",
            slots: [],
          },
          { status: 400 }
        );
      }

      filters.push(`booking_date=eq.${encodeURIComponent(bookingDate)}`);
    }

    const rows = await supabaseRestFetch<RawBookingSlotRow[]>({
      path: `${BOOKING_SLOTS_TABLE}?${filters.join("&")}`,
    });

    let slots = rows
      .map(normalizeBookingSlot)
      .filter((item): item is BookingSlot => Boolean(item));

    if (!includePast) {
      slots = slots.filter((slot) => isFutureOrToday(slot.booking_date));
    }

    return NextResponse.json(
      {
        success: true,
        slots,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
        slots: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBookingSlotBody;

    const bookingDate = normalizeText(body.booking_date);
    const startTime = normalizeTime(body.start_time);
    const endTime = normalizeTime(body.end_time);
    const note = normalizeText(body.note);
    const statusRaw = normalizeText(body.status) || "available";

    if (!bookingDate || !startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          error: "booking_date, start_time, and end_time are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(bookingDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking_date format.",
        },
        { status: 400 }
      );
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid time format. Use HH:MM.",
        },
        { status: 400 }
      );
    }

    if (compareTimes(startTime, endTime) >= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "end_time must be later than start_time.",
        },
        { status: 400 }
      );
    }

    if (!isValidStatus(statusRaw)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid slot status.",
        },
        { status: 400 }
      );
    }

    await ensureNoOverlap({
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
    });

    const insertedRows = await supabaseRestFetch<RawBookingSlotRow[]>({
      path: BOOKING_SLOTS_TABLE,
      method: "POST",
      body: [
        {
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          status: statusRaw,
          note: note || null,
        },
      ],
      prefer: "return=representation",
    });

    const slot = normalizeBookingSlot(insertedRows?.[0]);

    if (!slot) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create booking slot.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        slot,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateBookingSlotBody;

    const id = normalizeText(body.id);
    const bookingDate = normalizeText(body.booking_date);
    const startTime = normalizeTime(body.start_time);
    const endTime = normalizeTime(body.end_time);
    const note = normalizeText(body.note);
    const statusRaw = normalizeText(body.status);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Slot id is required.",
        },
        { status: 400 }
      );
    }

    const existingRows = await supabaseRestFetch<RawBookingSlotRow[]>({
      path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(id)}&select=*`,
    });

    const existing = normalizeBookingSlot(existingRows?.[0]);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking slot not found.",
        },
        { status: 404 }
      );
    }

    const nextBookingDate = bookingDate || existing.booking_date;
    const nextStartTime = startTime || existing.start_time;
    const nextEndTime = endTime || existing.end_time;
    const nextStatus: SlotStatus = isValidStatus(statusRaw)
      ? statusRaw
      : existing.status;

    if (!isValidDate(nextBookingDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking_date format.",
        },
        { status: 400 }
      );
    }

    if (!isValidTime(nextStartTime) || !isValidTime(nextEndTime)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid time format. Use HH:MM.",
        },
        { status: 400 }
      );
    }

    if (compareTimes(nextStartTime, nextEndTime) >= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "end_time must be later than start_time.",
        },
        { status: 400 }
      );
    }

    await ensureNoOverlap({
      booking_date: nextBookingDate,
      start_time: nextStartTime,
      end_time: nextEndTime,
      excludeId: id,
    });

    const updatedRows = await supabaseRestFetch<RawBookingSlotRow[]>({
      path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(id)}`,
      method: "PATCH",
      body: {
        booking_date: nextBookingDate,
        start_time: nextStartTime,
        end_time: nextEndTime,
        status: nextStatus,
        note: typeof body.note === "string" ? note : existing.note || null,
      },
      prefer: "return=representation",
    });

    const slot = normalizeBookingSlot(updatedRows?.[0]);

    if (!slot) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update booking slot.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        slot,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as DeleteBookingSlotBody;
    const id = normalizeText(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Slot id is required.",
        },
        { status: 400 }
      );
    }

    await supabaseRestFetch<null>({
      path: `${BOOKING_SLOTS_TABLE}?id=eq.${encodeURIComponent(id)}`,
      method: "DELETE",
      prefer: "return=minimal",
    });

    return NextResponse.json(
      {
        success: true,
        deletedId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}