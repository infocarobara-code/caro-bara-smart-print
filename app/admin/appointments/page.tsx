import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AppointmentOffice from "./AppointmentOffice";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <AppointmentOffice />;
}
