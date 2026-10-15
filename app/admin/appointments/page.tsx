import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import AppointmentOffice from "./AppointmentOffice";
export const dynamic = "force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const query=await searchParams;
  const initialLang=query.lang === "ar" || query.lang === "en" ? query.lang : "de";
  if (!(await isAdminAuthenticated())) redirect(`/admin/login?lang=${initialLang}`);
  return <AppointmentOffice initialLang={initialLang} />;
}
