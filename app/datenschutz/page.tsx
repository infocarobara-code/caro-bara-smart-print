import LegalPage from "@/components/LegalPage";
import {privacySections} from "@/lib/legal/privacy";
export const metadata = {title: "Datenschutzerkl\u00e4rung", alternates: {canonical:"/datenschutz"}};
export default function Page(){return <LegalPage title={"Datenschutzerkl\u00e4rung"} summary="نستخدم بياناتك لمعالجة الاستفسارات والمواعيد وتشغيل الموقع. توضح الأقسام أدناه مزودي الخدمة والتخزين وحقوقك وطرق الاعتراض والتواصل. يمكنك مراسلتنا بالعربية لطلب شرح أي بند." sections={privacySections}/>;}
