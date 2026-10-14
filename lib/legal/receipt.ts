import type {Language} from "@/lib/i18n";
const text = {
 ar: {notice:"تأكيد استلام استفسار غير ملزم؛ ليس قبولًا لعقد أو فاتورة.",legal:"بيانات المشغّل",privacy:"الخصوصية",terms:"الشروط",withdrawal:"حق التراجع"},
 de: {notice:"Unverbindliche Eingangsbestätigung – keine Auftragsannahme und keine Rechnung.",legal:"Impressum",privacy:"Datenschutz",terms:"AGB",withdrawal:"Widerruf"},
 en: {notice:"Non-binding inquiry receipt, not contract acceptance or an invoice.",legal:"Legal notice",privacy:"Privacy",terms:"Terms",withdrawal:"Withdrawal"},
} as const;
export function legalReceiptHtml(language:Language):string {
 const t=text[language];
 return `<div lang="${language}" dir="${language==="ar"?"rtl":"ltr"}" style="padding:14px;font:14px/1.7 Arial;background:#eef8fa;color:#22343a;">${t.notice}<br/>
 ${language==="ar"?"محمد رفعت اليوسف":"Mohammad Refat Alyoussef"} · Caro Bara Werbeagentur<br/>
 <bdi>Fanningerstraße 20 · 10365 Berlin</bdi><br/>
 <a href="https://caro-bara-smart-print.vercel.app/impressum">${t.legal}</a> ·
 <a href="https://caro-bara-smart-print.vercel.app/datenschutz">${t.privacy}</a> ·
 <a href="https://caro-bara-smart-print.vercel.app/agb">${t.terms}</a> ·
 <a href="https://caro-bara-smart-print.vercel.app/widerruf">${t.withdrawal}</a></div>`;
}
