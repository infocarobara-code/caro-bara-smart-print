"use client";
import Link from "next/link";
import {useLanguage} from "@/lib/languageContext";
const text = {
 ar: "إرسال هذا النموذج استفسار غير ملزم ولا ينشئ التزامًا بالدفع. نراجع التفاصيل ونرسل عرضًا منفصلًا، ولا تبدأ الخدمة المدفوعة بمجرد الإرسال. تأكيد الاستلام ليس قبولًا لعقد. نستخدم بياناتك لمعالجة الاستفسار؛ إرسال واتساب ينقل بيانات الرسالة إلى خدمة خارجية تختارها.",
 de: "Das Absenden ist eine unverbindliche Anfrage ohne Zahlungspflicht. Nach Prüfung erhalten Sie ein separates Angebot. Die Eingangsbestätigung ist keine Vertragsannahme. Ihre Daten dienen der Anfragebearbeitung. WhatsApp übermittelt den Nachrichtentext an einen von Ihnen gewählten externen Dienst.",
 en: "Submitting this form is a non-binding inquiry with no payment obligation. We review your details and send a separate offer. A receipt confirmation is not contract acceptance. Your data is used to process the inquiry. Choosing WhatsApp passes the message to an external service.",
};
export default function LegalRequestNotice(){const {language,dir}=useLanguage(); return <aside dir={dir} style={{padding:16,border:"1px solid #b8d5dc",borderRadius:12,background:"#f3fafb",color:"#24343a",fontSize:14,lineHeight:1.8,margin:"18px 0"}}>
 <p style={{margin:"0 0 8px"}}>{text[language]}</p><Link href="/datenschutz">{language==="ar"?"الخصوصية":language==="de"?"Datenschutz":"Privacy"}</Link>{" · "}<Link href="/agb">{language==="ar"?"الشروط":language==="de"?"AGB":"Terms"}</Link>{" · "}<Link href="/widerruf">{language==="ar"?"حق التراجع":language==="de"?"Widerruf":"Withdrawal"}</Link>
 </aside>;}
