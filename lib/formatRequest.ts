import type { Language } from "@/lib/i18n";

const messageText = {
  requestTitle: {
    ar: "🧾 *طلب جديد:*",
    de: "🧾 *Neue Anfrage:*",
    en: "🧾 *New Request:*",
  },
  attachmentLabel: {
    ar: "الملف المرفق",
    de: "Dateianhang",
    en: "Attached File",
  },
  attachmentsLabel: {
    ar: "الملفات المرفقة",
    de: "Dateianhänge",
    en: "Attached Files",
  },
  linkLabel: {
    ar: "رابط",
    de: "Link",
    en: "Link",
  },
  notProvided: {
    ar: "غير محدد",
    de: "Nicht angegeben",
    en: "Not specified",
  },
};

const labels: Record<string, Partial<Record<Language, string>>> = {
  width: {
    ar: "العرض",
    de: "Breite",
    en: "Width",
  },
  height: {
    ar: "الارتفاع",
    de: "Höhe",
    en: "Height",
  },
  length: {
    ar: "الطول",
    de: "Länge",
    en: "Length",
  },
  size: {
    ar: "المقاس",
    de: "Größe",
    en: "Size",
  },
  quantity: {
    ar: "الكمية",
    de: "Menge",
    en: "Quantity",
  },
  qty: {
    ar: "الكمية",
    de: "Menge",
    en: "Quantity",
  },
  material: {
    ar: "نوع المادة",
    de: "Material",
    en: "Material",
  },
  lightColor: {
    ar: "لون الإضاءة",
    de: "Lichtfarbe",
    en: "Light Color",
  },
  powerAccess: {
    ar: "توفر الكهرباء",
    de: "Stromanschluss",
    en: "Power Access",
  },
  timeline: {
    ar: "المدة",
    de: "Zeitplan",
    en: "Timeline",
  },
  notes: {
    ar: "ملاحظات",
    de: "Hinweise",
    en: "Notes",
  },
  designReady: {
    ar: "التصميم جاهز",
    de: "Design vorhanden",
    en: "Design Ready",
  },
  fileUpload: {
    ar: "ملف التصميم",
    de: "Designdatei",
    en: "Design File",
  },
};

const valueMap: Record<string, Partial<Record<Language, string>>> = {
  yes: {
    ar: "نعم",
    de: "Ja",
    en: "Yes",
  },
  no: {
    ar: "لا",
    de: "Nein",
    en: "No",
  },
  urgent: {
    ar: "مستعجل",
    de: "Dringend",
    en: "Urgent",
  },
  normal: {
    ar: "عادي",
    de: "Normal",
    en: "Normal",
  },
  "cool-white": {
    ar: "أبيض بارد",
    de: "Kaltweiß",
    en: "Cool White",
  },
  "warm-white": {
    ar: "أبيض دافئ",
    de: "Warmweiß",
    en: "Warm White",
  },
  white: {
    ar: "أبيض",
    de: "Weiß",
    en: "White",
  },
  black: {
    ar: "أسود",
    de: "Schwarz",
    en: "Black",
  },
  matte: {
    ar: "مطفي",
    de: "Matt",
    en: "Matte",
  },
  glossy: {
    ar: "لامع",
    de: "Glänzend",
    en: "Glossy",
  },
  premium: {
    ar: "فاخر",
    de: "Premium",
    en: "Premium",
  },
  kraft: {
    ar: "كرافت",
    de: "Kraft",
    en: "Kraft",
  },
  offset: {
    ar: "أوفست",
    de: "Offset",
    en: "Offset",
  },
  uv: {
    ar: "UV",
    de: "UV",
    en: "UV",
  },
  folding: {
    ar: "طي",
    de: "Falzen",
    en: "Folding",
  },
  cutting: {
    ar: "قص",
    de: "Schneiden",
    en: "Cutting",
  },
  none: {
    ar: "بدون",
    de: "Keine",
    en: "None",
  },
};

function normalizeSpaces(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeKey(value: unknown): string {
  return normalizeSpaces(value).replace(/[\s_-]+/g, "").toLowerCase();
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function isFileLikeValue(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) return false;
  if (isUrl(trimmed)) return false;

  return /\.[a-z0-9]{2,8}$/i.test(trimmed);
}

function splitMultiValue(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLocalizedMessageText(
  value: Record<Language, string>,
  lang: Language
): string {
  return value[lang];
}

function getLocalizedLabel(key: string, lang: Language): string {
  const direct = labels[key]?.[lang];
  if (direct) return direct;

  const normalized = normalizeKey(key);
  const matchedEntry = Object.entries(labels).find(
    ([entryKey]) => normalizeKey(entryKey) === normalized
  );

  if (matchedEntry?.[1]?.[lang]) {
    return matchedEntry[1][lang] as string;
  }

  return key;
}

function getLocalizedValue(value: string, lang: Language): string {
  const trimmed = normalizeSpaces(value);
  if (!trimmed) return getLocalizedMessageText(messageText.notProvided, lang);

  const direct = valueMap[trimmed]?.[lang];
  if (direct) return direct;

  const normalized = normalizeKey(trimmed);
  const matchedEntry = Object.entries(valueMap).find(
    ([entryKey]) => normalizeKey(entryKey) === normalized
  );

  if (matchedEntry?.[1]?.[lang]) {
    return matchedEntry[1][lang] as string;
  }

  return trimmed;
}

function formatSingleValue(key: string, value: string, lang: Language): string {
  const cleanValue = normalizeSpaces(value);

  if (!cleanValue) {
    return getLocalizedMessageText(messageText.notProvided, lang);
  }

  if (isUrl(cleanValue)) {
    return cleanValue;
  }

  if (isFileLikeValue(cleanValue)) {
    return cleanValue;
  }

  if (cleanValue.includes(",")) {
    return splitMultiValue(cleanValue)
      .map((item) => {
        if (isUrl(item) || isFileLikeValue(item)) return item;
        return getLocalizedValue(item, lang);
      })
      .join(", ");
  }

  return getLocalizedValue(cleanValue, lang);
}

function getSpecialLabelForValue(key: string, value: string, lang: Language): string {
  const cleanKey = normalizeKey(key);
  const values = splitMultiValue(value);

  const allLinks = values.length > 0 && values.every((item) => isUrl(item));
  const allFiles =
    values.length > 0 && values.every((item) => isFileLikeValue(item) || isUrl(item));

  if (cleanKey.includes("file") || cleanKey.includes("upload") || cleanKey.includes("attachment")) {
    if (values.length > 1) {
      return getLocalizedMessageText(messageText.attachmentsLabel, lang);
    }

    return getLocalizedMessageText(messageText.attachmentLabel, lang);
  }

  if (allLinks) {
    return getLocalizedMessageText(messageText.linkLabel, lang);
  }

  if (allFiles) {
    return values.length > 1
      ? getLocalizedMessageText(messageText.attachmentsLabel, lang)
      : getLocalizedMessageText(messageText.attachmentLabel, lang);
  }

  return getLocalizedLabel(key, lang);
}

export function formatRequestForWhatsApp(
  data: Record<string, string>,
  lang: Language
) {
  const lines: string[] = [getLocalizedMessageText(messageText.requestTitle, lang), ""];

  Object.entries(data).forEach(([key, value]) => {
    const cleanKey = normalizeSpaces(key);
    const cleanValue = normalizeSpaces(value);

    if (!cleanKey || !cleanValue) return;

    const label = getSpecialLabelForValue(cleanKey, cleanValue, lang);
    const translatedValue = formatSingleValue(cleanKey, cleanValue, lang);

    lines.push(`• *${label}:* ${translatedValue}`);
  });

  return lines.join("\n");
}