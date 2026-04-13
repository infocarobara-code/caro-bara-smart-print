import { NextResponse } from "next/server";

type AvailableDayRow = {
  id?: string | null;
  date?: string | null;
  note?: string | null;
};

type AvailableDayResponse = {
  id: string;
  date: string;
  note: string;
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
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

function normalizeAvailableDay(
  row: AvailableDayRow
): AvailableDayResponse | null {
  const id = normalizeText(row.id);
  const date = normalizeText(row.date);
  const note = normalizeText(row.note);

  if (!id || !date || !isValidDate(date) || !isFutureOrToday(date)) {
    return null;
  }

  return {
    id,
    date,
    note,
  };
}

async function supabaseRestFetch<T>(params: {
  url: string;
  serviceRoleKey: string;
}) {
  const response = await fetch(params.url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: params.serviceRoleKey,
      Authorization: `Bearer ${params.serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Supabase request failed: ${response.status} ${errorText || "Unknown error"}`
    );
  }

  return (await response.json()) as T;
}

export async function GET() {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
          days: [],
        },
        { status: 500 }
      );
    }

    const rows = await supabaseRestFetch<AvailableDayRow[]>({
      url:
        `${supabaseUrl}/rest/v1/booking_available_days` +
        `?select=id,date,note` +
        `&order=date.asc`,
      serviceRoleKey: supabaseServiceRoleKey,
    });

    const days = rows
      .map(normalizeAvailableDay)
      .filter((item): item is AvailableDayResponse => Boolean(item));

    return NextResponse.json(
      {
        success: true,
        days,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
        days: [],
      },
      { status: 500 }
    );
  }
}