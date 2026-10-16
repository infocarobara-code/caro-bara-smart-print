import type { RequestLanguage } from "./cart";

export type SignDesign = {
  widthCm: number; heightCm: number; name: string; subtitle: string;
  background: string; foreground: string; textScale: number;
  lighting: "none" | "face" | "halo";
};
export const defaultSign: SignDesign = {
  widthCm: 240, heightCm: 60, name: "MOKA", subtitle: "KAFFEE & FRÜHSTÜCK",
  background: "#153f35", foreground: "#fff3d9", textScale: 78, lighting: "halo",
};
export const palettes = [
  { background: "#153f35", foreground: "#fff3d9" },
  { background: "#20242c", foreground: "#ffffff" },
  { background: "#f2e7d6", foreground: "#342a24" },
  { background: "#073c53", foreground: "#d8f4ff" },
] as const;
export function parseDimension(value: string, min: number, max: number) {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}
export function validDesign(d: SignDesign) {
  return Number.isFinite(d.widthCm) && d.widthCm >= 80 && d.widthCm <= 480 &&
    Number.isFinite(d.heightCm) && d.heightCm >= 20 && d.heightCm <= 120 &&
    d.name.trim().length > 0 && d.name.length <= 48 && d.subtitle.length <= 80 &&
    Number.isFinite(d.textScale) && d.textScale >= 25 && d.textScale <= 100 &&
    /^#[\da-f]{6}$/i.test(d.background) && /^#[\da-f]{6}$/i.test(d.foreground) &&
    ["none", "face", "halo"].includes(d.lighting);
}
function luminance(hex: string) {
  const c = hex.slice(1).match(/../g)!.map(v => {
    const n = parseInt(v, 16) / 255;
    return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
  });
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
}
export function colorContrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
// SVG coordinates represent centimetres on the sign plane. A 240x60 rectangle
// is always4:1, independent of viewport, language, or viewing scale.
export function signGeometry(d: SignDesign) {
  return { x: (600 - d.widthCm) / 2, y: 76 - d.heightCm / 2, width: d.widthCm, height: d.heightCm };
}
// Conservative initial fit. The browser then measures actual shaped SVG text
// (including Arabic) and reduces size to fit, without squeezing glyphs.
export function initialTextSize(d: SignDesign, logo = false) {
  const width = d.widthCm * (logo ? .66 : .86);
  const units = [...d.name].reduce((n, c) => n + (/\s/.test(c) ? .35 : /[ilI1.,]/.test(c) ? .3 : /[MW@]/.test(c) ? .95 : .65), 0);
  return Math.min(d.heightCm * (d.subtitle ? .5 : .64), width / Math.max(1, units)) * d.textScale / 100;
}
export function improveDesign(d: SignDesign): SignDesign {
  const white = colorContrast(d.background, "#ffffff"), black = colorContrast(d.background, "#171717");
  return { ...d, textScale: Math.max(d.textScale, 94), foreground: colorContrast(d.background, d.foreground) < 4.5 ? (white > black ? "#ffffff" : "#171717") : d.foreground };
}
const inquiryCopy = {
  de: { service: "Schilder & Lichtwerbung", width: "Breite (cm)", height: "Höhe (cm)", notes: "Hinweise", heading: "Entwurf aus dem Schild-Studio", name: "Haupttext", subtitle: "Zusatztext", colors: "Farben Hintergrund / Text", size: "Textgröße", lighting: "Gewünschte Lichtwirkung", none: "Ohne Licht", face: "Frontleuchtend", halo: "Hinterleuchtet", limit: "Unverbindliche Visualisierung. Maße sind Kundeneingaben, kein Aufmaß. Material, Konstruktion und Montage bitte prüfen. Kein Preis oder Produktionsauftrag.", logo: "Eigenes Logo lokal verwendet. Vorschau bitte separat anhängen; Bild wird nicht automatisch übertragen." },
  ar: { service: "اللوحات والإعلانات المضيئة", width: "العرض (سم)", height: "الارتفاع (سم)", notes: "ملاحظات", heading: "تصور من استوديو الآرمات", name: "النص الرئيسي", subtitle: "النص الإضافي", colors: "لون الخلفية / النص", size: "حجم النص", lighting: "تأثير الإضاءة المطلوب", none: "دون إضاءة", face: "إضاءة أمامية", halo: "إضاءة خلفية", limit: "تصور غير ملزم. المقاسات مدخلة من العميل وليست قياسًا ميدانيًا. يرجى مراجعة الخامة والبناء والتركيب. ليس سعرًا أو أمر تصنيع.", logo: "استُخدم شعار محلي. يرجى إرفاق المعاينة منفصلة؛ لا تُنقل الصورة تلقائيًا." },
  en: { service: "Signs & illuminated advertising", width: "Width (cm)", height: "Height (cm)", notes: "Notes", heading: "Concept from Sign Studio", name: "Main text", subtitle: "Secondary text", colors: "Background / text colors", size: "Text size", lighting: "Requested lighting effect", none: "Unlit", face: "Face-lit", halo: "Halo-lit", limit: "Non-binding visualization. Dimensions are customer inputs, not a site survey. Please review materials, construction and installation. No price or production order.", logo: "A local logo was used. Please attach the preview separately; the image is not transferred automatically." },
} as const;
export function signInquiry(d: SignDesign, language: RequestLanguage, hasLogo = false) {
  if (!validDesign(d)) throw new Error("Invalid sign design");
  const t = inquiryCopy[language];
  const notes = [t.heading, `${t.name}: ${d.name.trim()}`, d.subtitle.trim() && `${t.subtitle}: ${d.subtitle.trim()}`,
    `${t.colors}: ${d.background} / ${d.foreground}`, `${t.size}: ${d.textScale}%`, `${t.lighting}: ${t[d.lighting]}`,
    hasLogo && t.logo, t.limit].filter(Boolean).join("\n");
  return { serviceId: "signage", serviceTitle: t.service, requestLanguage: language, quantity: 1,
    fields: [{ id: "width", label: t.width, value: String(d.widthCm) }, { id: "height", label: t.height, value: String(d.heightCm) }, { id: "notes", label: t.notes, value: notes }],
    canonicalData: { width: String(d.widthCm), height: String(d.heightCm) }, data: { _origin: "sign-studio" } };
}
