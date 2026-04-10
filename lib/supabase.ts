import type { CreateRequestInput } from "@/types/request";

export async function saveRequest(_input: CreateRequestInput) {
  console.warn(
    "saveRequest was called, but Supabase is currently disabled in this build."
  );

  return null;
}