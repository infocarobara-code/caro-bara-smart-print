"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminCredentials,
  createAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

// تسجيل الدخول
export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const isValid = await verifyAdminCredentials(username, password);

  if (!isValid) {
    return {
      error: "Invalid username or password",
    };
  }

  await createAdminSession(username);

  redirect("/admin/requests");
}

// تسجيل الخروج
export async function logoutAction() {
  await clearAdminSession();

  redirect("/admin/login");
}