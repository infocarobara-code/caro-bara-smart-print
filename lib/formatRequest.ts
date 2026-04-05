import type { Language } from "@/lib/i18n";

export function formatRequestForWhatsApp(
  data: Record<string, string>,
  lang: Language
) {
  const labels: Record<string, Record<Language, string>> = {
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
  };

  const valueMap: Record<string, Record<string, string>> = {
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
    "cool-white": {
      ar: "أبيض بارد",
      de: "Kaltweiß",
      en: "Cool White",
    },
  };

  let message = "🧾 *طلب جديد:*\n\n";

  Object.entries(data).forEach(([key, value]) => {
    const label = labels[key]?.[lang] || key;

    const translatedValue =
      valueMap[value]?.[lang] ||
      value;

    message += `• *${label}:* ${translatedValue}\n`;
  });

  return message;
}