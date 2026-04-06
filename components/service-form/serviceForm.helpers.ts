import type { Service } from "@/types/service";
import type { Language } from "@/lib/i18n";
import type { CartFieldItem } from "@/lib/cart";

export type FormStatus = {
  type: "idle" | "error" | "success";
  message: string;
};

export type LegacyFieldGroupKey =
  | "dimensions"
  | "project"
  | "specifications"
  | "notes";

export type LocalizedOption = {
  value: string;
  label: Partial<Record<Language, string>>;
};

export type ServiceAttachmentLike = {
  id: string;
  title?: Partial<Record<Language, string>>;
  description?: Partial<Record<Language, string>>;
  required?: boolean;
  multiple?: boolean;
};

export const smartSizeOptions: LocalizedOption[] = [
  { value: "a6", label: { ar: "A6", de: "A6", en: "A6" } },
  { value: "a5", label: { ar: "A5", de: "A5", en: "A5" } },
  { value: "a4", label: { ar: "A4", de: "A4", en: "A4" } },
  { value: "a3", label: { ar: "A3", de: "A3", en: "A3" } },
  { value: "85x55mm", label: { ar: "85×55 مم", de: "85×55 mm", en: "85×55 mm" } },
  { value: "dl", label: { ar: "DL", de: "DL", en: "DL" } },
  {
    value: "custom",
    label: { ar: "مقاس مخصص", de: "Individuelles Maß", en: "Custom" },
  },
];

export const smartQuantityOptions: LocalizedOption[] = [
  { value: "50", label: { ar: "50", de: "50", en: "50" } },
  { value: "100", label: { ar: "100", de: "100", en: "100" } },
  { value: "250", label: { ar: "250", de: "250", en: "250" } },
  { value: "500", label: { ar: "500", de: "500", en: "500" } },
  { value: "1000", label: { ar: "1000", de: "1000", en: "1000" } },
  { value: "2000", label: { ar: "2000", de: "2000", en: "2000" } },
  { value: "2500", label: { ar: "2500", de: "2500", en: "2500" } },
  { value: "3000", label: { ar: "3000", de: "3000", en: "3000" } },
  { value: "4000", label: { ar: "4000", de: "4000", en: "4000" } },
  { value: "5000", label: { ar: "5000", de: "5000", en: "5000" } },
  { value: "6000", label: { ar: "6000", de: "6000", en: "6000" } },
  { value: "7000", label: { ar: "7000", de: "7000", en: "7000" } },
  { value: "8000", label: { ar: "8000", de: "8000", en: "8000" } },
  { value: "9000", label: { ar: "9000", de: "9000", en: "9000" } },
  { value: "10000", label: { ar: "10000", de: "10000", en: "10000" } },
  { value: "20000", label: { ar: "20000", de: "20000", en: "20000" } },
  { value: "30000", label: { ar: "30000", de: "30000", en: "30000" } },
  { value: "40000", label: { ar: "40000", de: "40000", en: "40000" } },
  { value: "50000", label: { ar: "50000", de: "50000", en: "50000" } },
  {
    value: "custom-quantity",
    label: {
      ar: "كمية مخصصة",
      de: "Individuelle Menge",
      en: "Custom Quantity",
    },
  },
];

export const smartPaperOptions: LocalizedOption[] = [
  { value: "matte", label: { ar: "مطفي", de: "Matt", en: "Matte" } },
  { value: "glossy", label: { ar: "لامع", de: "Glänzend", en: "Glossy" } },
  { value: "premium", label: { ar: "فاخر", de: "Premium", en: "Premium" } },
  { value: "kraft", label: { ar: "كرافت", de: "Kraft", en: "Kraft" } },
  { value: "offset", label: { ar: "أوفست", de: "Offset", en: "Offset" } },
  {
    value: "not-sure-paper",
    label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
  },
];

export const smartFinishingOptions: LocalizedOption[] = [
  {
    value: "matte-lamination",
    label: {
      ar: "تغليف مطفي",
      de: "Mattlaminierung",
      en: "Matte Lamination",
    },
  },
  {
    value: "glossy-lamination",
    label: {
      ar: "تغليف لامع",
      de: "Glanzlaminierung",
      en: "Glossy Lamination",
    },
  },
  { value: "uv", label: { ar: "UV", de: "UV", en: "UV" } },
  { value: "folding", label: { ar: "طي", de: "Falzen", en: "Folding" } },
  { value: "cutting", label: { ar: "قص", de: "Schneiden", en: "Cutting" } },
  {
    value: "rounded-corners",
    label: {
      ar: "زوايا دائرية",
      de: "Abgerundete Ecken",
      en: "Rounded Corners",
    },
  },
  { value: "none", label: { ar: "بدون", de: "Keine", en: "None" } },
  {
    value: "not-sure-finishing",
    label: { ar: "غير متأكد", de: "Nicht sicher", en: "Not sure" },
  },
];

export function getServiceAttachments(service: Service): ServiceAttachmentLike[] {
  const rawAttachments = (service as unknown as { attachments?: unknown }).attachments;

  if (!Array.isArray(rawAttachments)) return [];

  return rawAttachments.filter((entry): entry is ServiceAttachmentLike => {
    return Boolean(
      entry &&
        typeof entry === "object" &&
        "id" in entry &&
        typeof (entry as { id?: unknown }).id === "string"
    );
  });
}

export function normalizeSpaces(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeComparisonText(value: unknown): string {
  return normalizeSpaces(value)
    .toLowerCase()
    .replace(/[\u2066-\u2069]/g, "")
    .replace(/[\u200e\u200f]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[():،؛,.]+/g, "")
    .trim();
}

export function normalizeQuantity(value: unknown): number {
  const stringValue = String(value ?? "").trim();
  const numericValue = Number(stringValue.replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(numericValue));
}

export function inferQuantityFromValue(value: string): number | null {
  const clean = normalizeSpaces(value);
  if (!clean) return null;

  const numericValue = Number(clean.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  return Math.max(1, Math.floor(numericValue));
}

export function inferQuantityFromData(data: Record<string, string>): number {
  const entries = Object.entries(data);

  const highPriorityKeys = [
    "quantity",
    "qty",
    "menge",
    "anzahl",
    "count",
    "stuckzahl",
    "stückzahl",
    "pieces",
    "units",
    "auflage",
    "amount",
    "كميه",
    "كمية",
  ];

  for (const [key, value] of entries) {
    const normalizedKey = normalizeComparisonText(key).replace(/[\s_-]+/g, "");

    if (highPriorityKeys.some((candidate) => normalizedKey.includes(candidate))) {
      const inferred = inferQuantityFromValue(value);
      if (inferred !== null) {
        return inferred;
      }
    }
  }

  return 1;
}

export function splitSelectedValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isQuantityLikeKey(value: string): boolean {
  const normalized = normalizeComparisonText(value).replace(/[\s_-]+/g, "");

  return (
    normalized.includes("quantity") ||
    normalized.includes("qty") ||
    normalized.includes("amount") ||
    normalized.includes("menge") ||
    normalized.includes("anzahl") ||
    normalized.includes("auflage") ||
    normalized.includes("count") ||
    normalized.includes("pieces") ||
    normalized.includes("units") ||
    normalized.includes("كميه") ||
    normalized.includes("كمية")
  );
}

export function dedupeCartFieldItems(fields: CartFieldItem[]): CartFieldItem[] {
  const uniqueById = new Map<string, CartFieldItem>();
  const exactSeen = new Set<string>();

  fields.forEach((field) => {
    const id = normalizeSpaces(field.id);
    const label = normalizeSpaces(field.label);
    const value = normalizeSpaces(field.value);

    if (!id || !label || !value) return;
    if (isQuantityLikeKey(id) || isQuantityLikeKey(label)) return;

    const normalizedId = normalizeComparisonText(id);
    const normalizedLabel = normalizeComparisonText(label);
    const normalizedValue = normalizeComparisonText(value);

    const exactKey = `${normalizedId}||${normalizedLabel}||${normalizedValue}`;
    if (exactSeen.has(exactKey)) return;
    exactSeen.add(exactKey);

    const existing = uniqueById.get(normalizedId);

    if (!existing) {
      uniqueById.set(normalizedId, { id, label, value });
      return;
    }

    const currentScore = existing.label.length + existing.value.length;
    const nextScore = label.length + value.length;

    if (nextScore > currentScore) {
      uniqueById.set(normalizedId, { id, label, value });
    }
  });

  return Array.from(uniqueById.values());
}