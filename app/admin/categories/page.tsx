import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import CategoryOffice from "./CategoryOffice";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const q=await searchParams;const lang=q.lang==="ar"||q.lang==="en"?q.lang:"de";
 if(!(await isAdminAuthenticated()))redirect(`/admin/login?lang=${lang}`);
 return <CategoryOffice initialLang={lang}/>;
}
