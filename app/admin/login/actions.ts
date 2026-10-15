"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminCredentials,
  createAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData): Promise<void> {
  const rawLang = formData.get("lang");
  const lang = rawLang === "ar" || rawLang === "en" ? rawLang : "de";
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const isValid = await verifyAdminCredentials(username, password);

  if (!isValid) {
    redirect(`/admin/login?lang=${lang}&error=invalid_credentials`);
  }

  await createAdminSession(username);

  redirect(`/admin/appointments?lang=${lang}`);
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();

  redirect("/admin/login");
}