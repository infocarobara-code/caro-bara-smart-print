import type { RequestLanguage } from "./cart";

export type SignFamily = "panel" | "lightbox" | "blade";
export type SignFont = "sans" | "serif" | "cairo";
export type SignDesign = {
  family?: SignFamily; depthCm?: number; font?: SignFont; logoScale?: number; logoX?: number; logoY?: number;
  widthCm: number; heightCm: number; name: string; subtitle: string;
  background: string; foreground: string; textScale: number;
  lighting: "none" | "face" | "halo";
};
export const defaultSign: SignDesign = {
  widthCm: 240, heightCm: 60, name: "MOKA", subtitle: "KAFFEE & FRÜHSTÜCK",
  background: "#153f35", foreground: "#fff3d9", textScale: 78, lighting: "face", family: "lightbox", depthCm: 12, font: "sans", logoScale: 100, logoX: 0, logoY: 50,
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
  if (!validDesign(d) || !validConstruction(d)) throw new Error("Invalid sign design");
  const t = inquiryCopy[language];
  const notes = [t.heading, `${t.name}: ${d.name.trim()}`, d.subtitle.trim() && `${t.subtitle}: ${d.subtitle.trim()}`,
    `${t.colors}: ${d.background} / ${d.foreground}`, `${t.size}: ${d.textScale}%`, `${t.lighting}: ${t[d.lighting]}`,
    `${language === "ar" ? "البناء" : language === "de" ? "Konstruktion" : "Construction"}: ${construction(d).family}; ${construction(d).depthCm} cm; ${construction(d).font}; Logo ${construction(d).logoScale}%; X ${construction(d).logoX}%; Y ${construction(d).logoY}%`,
    (language === "ar" ? "المواد والتثبيت وتوزيع LED غير معتمدة بعد؛ مراجعة الورشة مطلوبة." : language === "de" ? "Material, Befestigung und LED-Auslegung noch nicht freigegeben; Werkstattprüfung erforderlich." : "Materials, mounting and LED layout are not approved; workshop review required."), hasLogo && t.logo, t.limit].filter(Boolean).join("\n");
  return { serviceId: "signage", serviceTitle: t.service, requestLanguage: language, quantity: 1,
    fields: [{ id: "width", label: t.width, value: String(d.widthCm) }, { id: "height", label: t.height, value: String(d.heightCm) }, { id: "notes", label: t.notes, value: notes }],
    canonicalData: { width: String(d.widthCm), height: String(d.heightCm) }, data: { _origin: "sign-studio", _designVersion: "3", _design: JSON.stringify({ ...d, ...construction(d) }) } };
}

// These are supported editor configurations, NOT approved manufacturing limits.
export const familyOptions = ["panel", "lightbox", "blade"] as const;
export const fontOptions = ["sans", "serif", "cairo"] as const;
export const fontFamilies = { sans: "Arial, sans-serif", serif: "Georgia, serif", cairo: "CaroStudioCairo, Arial, sans-serif" };
export function construction(d: SignDesign) {
  return { family: d.family ?? "lightbox", depthCm: d.depthCm ?? 12, font: d.font ?? "sans", logoScale: d.logoScale ?? 100, logoX: d.logoX ?? 0, logoY: d.logoY ?? 50 };
}
export function changeFamily(d: SignDesign, family: SignFamily): SignDesign {
  if (construction(d).family === family) return d;
  return { ...d, family, depthCm: family === "panel" ? .3 : 12, lighting: family === "panel" ? "none" : "face" };
}
export function validConstruction(d: SignDesign) {
  const c = construction(d);
  return familyOptions.includes(c.family) && fontOptions.includes(c.font) && Number.isFinite(c.depthCm) &&
    c.depthCm >= (c.family === "panel" ? .2 : 4) && c.depthCm <= (c.family === "panel" ? 2 : 30) &&
    Number.isFinite(c.logoScale) && c.logoScale >= 40 && c.logoScale <= 140 &&
    [c.logoX, c.logoY].every(value => Number.isFinite(value) && value >= 0 && value <= 100) &&
    (c.family !== "panel" || d.lighting === "none") && d.lighting !== "halo";
}
export function projectSignPoint(x: number, y: number, z: number, yaw: number, pitch: number) {
  const a = yaw * Math.PI / 180, b = pitch * Math.PI / 180;
  return { x: x * Math.cos(a) + z * Math.sin(a), y: y * Math.cos(b) + x * Math.sin(a) * Math.sin(b) - z * Math.cos(a) * Math.sin(b) };
}

// Logo coordinates are percentages of the available travel, excluding margins.
// Reserve a non-overlapping text column on whichever side has more space.
export function artworkLayout(d: SignDesign, hasLogo: boolean) {
  const c = construction(d), w = d.widthCm, h = d.heightCm;
  const margin = w * .05, gap = w * .035;
  const size = hasLogo ? Math.min(h * .62, w * .2) * c.logoScale / 100 : 0;
  const travelX = Math.max(0, w - margin * 2 - size);
  const travelY = Math.max(0, h * .9 - size);
  const x = margin + travelX * c.logoX / 100;
  const y = h * .05 + travelY * c.logoY / 100;
  const left = Math.max(0, x - gap - margin), right = Math.max(0, w - margin - x - size - gap);
  const textWidth = hasLogo ? Math.max(left, right) : w * .86;
  const textCenter = hasLogo ? (right >= left ? x + size + gap + right / 2 : margin + left / 2) : w / 2;
  return { size, x, y, travelX, travelY, textWidth, textCenter };
}
export function clampLogoPosition(x: number, y: number) {
  const clamp = (value: number) => Math.round(Math.max(0, Math.min(100, Number.isFinite(value) ? value : 50)) * 10) / 10;
  return { logoX: clamp(x), logoY: clamp(y) };
}
export type StudioDocument = { design: SignDesign; width: string; height: string; logo: string };
export type StudioHistory = { past: StudioDocument[]; present: StudioDocument; future: StudioDocument[]; transaction: { origin: StudioDocument; future: StudioDocument[] } | null };
export type StudioEdit = { design?: Partial<SignDesign>; width?: string; height?: string; logo?: string };
export type StudioAction = { type: "edit"; patch: StudioEdit } | { type: "begin" | "end" | "cancel" | "undo" | "redo" };
export function initialStudioHistory(): StudioHistory {
  return { past: [], present: { design: { ...defaultSign }, width: "240", height: "60", logo: "" }, future: [], transaction: null };
}
function sameDocument(a: StudioDocument, b: StudioDocument) {
  return a.logo === b.logo && a.width === b.width && a.height === b.height && JSON.stringify(a.design) === JSON.stringify(b.design);
}
export function studioHistoryReducer(state: StudioHistory, action: StudioAction): StudioHistory {
  const push = (past: StudioDocument[], entry: StudioDocument) => [...past, entry].slice(-40);
  if (action.type === "begin") return state.transaction ? state : { ...state, transaction: { origin: state.present, future: state.future } };
  if (action.type === "cancel") return state.transaction ? { ...state, present: state.transaction.origin, future: state.transaction.future, transaction: null } : state;
  if (action.type === "end") return state.transaction ? { ...state, past: sameDocument(state.transaction.origin,state.present) ? state.past : push(state.past,state.transaction.origin), transaction: null } : state;
  if (action.type === "edit") {
    const present = { ...state.present, ...action.patch, design: { ...state.present.design, ...action.patch.design } };
    if (sameDocument(present,state.present)) return state;
    return { ...state, present, future: [], past: state.transaction ? state.past : push(state.past,state.present) };
  }
  const settled = studioHistoryReducer(state,{type:"end"});
  if (action.type === "undo") {
    const previous = settled.past.at(-1);
    return previous ? { past: settled.past.slice(0,-1), present: previous, future: [settled.present,...settled.future].slice(0,40), transaction: null } : settled;
  }
  const next = settled.future[0];
  return next ? { past: push(settled.past,settled.present), present: next, future: settled.future.slice(1), transaction: null } : settled;
}
