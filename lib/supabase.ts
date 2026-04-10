import { createClient } from "@supabase/supabase-js";
import type { CreateRequestInput, RequestRecord } from "@/types/request";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function saveRequest(input: CreateRequestInput) {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return null;
    }

    const now = new Date().toISOString();

    const record: Omit<RequestRecord, "id"> = {
      status: "new",
      channel: input.channel || "internal_web",
      customer: input.customer,
      service: input.service || {},
      subject: input.subject,
      message: input.message,
      items: input.items || [],
      formData: input.formData || {},
      notes: input.notes || "",
      meta: input.meta,
      createdAt: now,
      updatedAt: now,
    };

    const { data, error } = await supabase
      .from("requests")
      .insert([
        {
          status: record.status,
          channel: record.channel,
          customer: record.customer,
          service: record.service,
          subject: record.subject,
          message: record.message,
          items: record.items,
          form_data: record.formData,
          notes: record.notes,
          meta: record.meta,
          created_at: record.createdAt,
          updated_at: record.updatedAt,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Save request error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected save error:", err);
    return null;
  }
}