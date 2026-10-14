import LegalPage from "@/components/LegalPage";
import {termsSections} from "@/lib/legal/terms";
export const metadata = {title: "Allgemeine Gesch\u00e4ftsbedingungen", alternates: {canonical:"/agb"}};
export default function Page(){return <LegalPage title={"Allgemeine Gesch\u00e4ftsbedingungen"} summary="إرسال الطلب استفسار غير ملزم، ثم يصلك عرض مستقل للموافقة الصريحة. حقوق الضمان والتراجع القانونية تبقى محفوظة بحسب نوع العقد. النص الألماني أدناه يبيّن شروط التعامل." sections={termsSections}/>;}
