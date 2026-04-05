"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Header from "@/components/Header";
import { services } from "@/data/services";
import {
  clearCart,
  getCart,
  removeCartItem,
  type CartItem,
} from "@/lib/cart";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/languageContext";
import type { Service, ServiceField } from "@/types/service";

type CustomerData = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
};

type ServiceAttachmentLike = {
  id: string;
  title?: Partial<Record<Language, string>>;
  description?: Partial<Record<Language, string>>;
  required?: boolean;
  multiple?: boolean;
};

type LocalizedOption = {
  value: string;
  label: Partial<Record<Language, string>>;
};

type CartFieldItem = {
  id: string;
  label: string;
  value: string;
};

type CartItemWithFields = CartItem & {
  fields?: CartFieldItem[];
};

const cartText = {
  badge: {
    ar: "مرحلة المراجعة والإرسال",
    de: "Prüfung & Versand",
    en: "Review & Submit",
  },
  title: {
    ar: "راجع طلباتك وأرسلها باحتراف",
    de: "Prüfe deine Anfragen und sende sie professionell ab",
    en: "Review your requests and send them professionally",
  },
  subtitle: {
    ar: "راجع الطلبات المضافة، ثم أدخل بيانات العميل مرة واحدة فقط قبل الإرسال النهائي.",
    de: "Prüfe die hinzugefügten Anfragen und gib die Kundendaten nur einmal vor dem finalen Versand ein.",
    en: "Review the added requests, then enter the customer details once before final submission.",
  },
  cartTitle: {
    ar: "الطلبات الحالية",
    de: "Aktuelle Anfragen",
    en: "Current Requests",
  },
  count: {
    ar: "عدد الطلبات",
    de: "Anzahl der Anfragen",
    en: "Number of requests",
  },
  empty: {
    ar: "لا توجد طلبات في السلة حاليًا.",
    de: "Der Warenkorb enthält aktuell keine Anfragen.",
    en: "There are currently no requests in the cart.",
  },
  remove: {
    ar: "حذف",
    de: "Löschen",
    en: "Remove",
  },
  clear: {
    ar: "تفريغ السلة",
    de: "Warenkorb leeren",
    en: "Clear cart",
  },
  sendAll: {
    ar: "إرسال الطلبات عبر واتساب",
    de: "Anfragen per WhatsApp senden",
    en: "Send Requests via WhatsApp",
  },
  sending: {
    ar: "جارٍ التحضير...",
    de: "Wird vorbereitet...",
    en: "Preparing...",
  },
  customerInfo: {
    ar: "بيانات العميل",
    de: "Kundendaten",
    en: "Customer Information",
  },
  fullName: {
    ar: "الاسم الكامل",
    de: "Vollständiger Name",
    en: "Full Name",
  },
  phone: {
    ar: "رقم الهاتف",
    de: "Telefonnummer",
    en: "Phone Number",
  },
  email: {
    ar: "البريد الإلكتروني",
    de: "E-Mail",
    en: "Email",
  },
  street: {
    ar: "الشارع",
    de: "Straße",
    en: "Street",
  },
  houseNumber: {
    ar: "رقم المنزل / الشقة",
    de: "Hausnummer / Wohnung",
    en: "House Number / Apartment",
  },
  postalCode: {
    ar: "الرمز البريدي",
    de: "Postleitzahl",
    en: "Postal Code",
  },
  city: {
    ar: "المدينة",
    de: "Stadt",
    en: "City",
  },
  generalNotes: {
    ar: "ملاحظات عامة",
    de: "Allgemeine Hinweise",
    en: "General Notes",
  },
  optional: {
    ar: "اختياري",
    de: "Optional",
    en: "Optional",
  },
  customerSectionDescription: {
    ar: "أدخل بيانات العميل مرة واحدة فقط ليتم إرفاقها مع جميع الطلبات.",
    de: "Gib die Kundendaten nur einmal ein, damit sie allen Anfragen beigefügt werden.",
    en: "Enter the customer details only once so they are included with all requests.",
  },
  requestsSectionDescription: {
    ar: "راجع الخدمات المضافة واحذف ما لا تحتاجه قبل الإرسال النهائي.",
    de: "Prüfe die hinzugefügten Services und entferne nicht benötigte Einträge vor dem finalen Versand.",
    en: "Review the added services and remove anything you do not need before final submission.",
  },
  requiredCustomerInfo: {
    ar: "يرجى إدخال جميع بيانات العميل المطلوبة بشكل صحيح قبل الإرسال.",
    de: "Bitte gib alle erforderlichen Kundendaten korrekt ein, bevor du sendest.",
    en: "Please enter all required customer details correctly before sending.",
  },
  invalidFullName: {
    ar: "يرجى إدخال اسم كامل حقيقي وواضح.",
    de: "Bitte gib einen echten und vollständigen Namen ein.",
    en: "Please enter a real and clear full name.",
  },
  invalidEmail: {
    ar: "يرجى إدخال بريد إلكتروني صحيح.",
    de: "Bitte gib eine gültige E-Mail-Adresse ein.",
    en: "Please enter a valid email address.",
  },
  invalidPhone: {
    ar: "يرجى إدخال رقم هاتف صحيح.",
    de: "Bitte gib eine gültige Telefonnummer ein.",
    en: "Please enter a valid phone number.",
  },
  invalidStreet: {
    ar: "يرجى إدخال اسم شارع واضح.",
    de: "Bitte gib einen klaren Straßennamen ein.",
    en: "Please enter a clear street name.",
  },
  invalidHouseNumber: {
    ar: "يرجى إدخال رقم منزل أو شقة صحيح.",
    de: "Bitte gib eine gültige Hausnummer oder Wohnungsnummer ein.",
    en: "Please enter a valid house or apartment number.",
  },
  invalidPostalCode: {
    ar: "يرجى إدخال رمز بريدي صحيح.",
    de: "Bitte gib eine gültige Postleitzahl ein.",
    en: "Please enter a valid postal code.",
  },
  invalidCity: {
    ar: "يرجى إدخال اسم مدينة صحيح.",
    de: "Bitte gib einen gültigen Stadtnamen ein.",
    en: "Please enter a valid city name.",
  },
  sentSuccess: {
    ar: "تم فتح واتساب بالطلب الجاهز. يمكنك الآن إرسال الرسالة مباشرة.",
    de: "WhatsApp wurde mit der vorbereiteten Anfrage geöffnet. Du kannst die Nachricht jetzt direkt senden.",
    en: "WhatsApp was opened with the prepared request. You can now send the message directly.",
  },
  sendFailed: {
    ar: "تعذر فتح واتساب. تحقق من المتصفح أو حاول مرة أخرى.",
    de: "WhatsApp konnte nicht geöffnet werden. Prüfe den Browser oder versuche es erneut.",
    en: "Failed to open WhatsApp. Check the browser or try again.",
  },
  modalMessage: {
    ar: "نرجو منك إذا كان لديك أي صور أو مستندات أو مخططات مرتبطة بطلبك أن ترسلها لنا عبر واتساب أو الإيميل التالي.",
    de: "Falls du Bilder, Unterlagen oder Skizzen hast, die mit deiner Anfrage zusammenhängen, sende sie uns bitte per WhatsApp oder an die folgende E-Mail-Adresse.",
    en: "If you have any images, documents, or drawings related to your request, please send them to us via WhatsApp or to the following email address.",
  },
  modalConfirm: {
    ar: "موافق",
    de: "Verstanden",
    en: "Continue",
  },
};

const requestText = {
  requestHeader: {
    ar: "طلب جديد - Caro Bara",
    de: "Neue Anfrage - Caro Bara",
    en: "New Request - Caro Bara",
  },
  customerData: {
    ar: "بيانات العميل:",
    de: "Kundendaten:",
    en: "Customer:",
  },
  name: {
    ar: "الاسم",
    de: "Name",
    en: "Name",
  },
  phone: {
    ar: "الهاتف",
    de: "Telefon",
    en: "Phone",
  },
  email: {
    ar: "الإيميل",
    de: "E-Mail",
    en: "Email",
  },
  address: {
    ar: "العنوان:",
    de: "Adresse:",
    en: "Address:",
  },
  street: {
    ar: "الشارع",
    de: "Straße",
    en: "Street",
  },
  houseNumber: {
    ar: "رقم المنزل / الشقة",
    de: "Hausnummer / Wohnung",
    en: "House Number / Apartment",
  },
  postalCode: {
    ar: "الرمز البريدي",
    de: "Postleitzahl",
    en: "Postal Code",
  },
  city: {
    ar: "المدينة",
    de: "Stadt",
    en: "City",
  },
  requests: {
    ar: "الطلبات:",
    de: "Anfragen:",
    en: "Requests:",
  },
  generalNotes: {
    ar: "ملاحظات عامة:",
    de: "Allgemeine Hinweise:",
    en: "General Notes:",
  },
  noDetails: {
    ar: "لا توجد تفاصيل",
    de: "Keine Details",
    en: "No details",
  },
  quantity: {
    ar: "الكمية",
    de: "Menge",
    en: "Quantity",
  },
};

const smartSizeOptions: LocalizedOption[] = [
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

const smartQuantityOptions: LocalizedOption[] = [
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

const smartPaperOptions: LocalizedOption[] = [
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

const smartFinishingOptions: LocalizedOption[] = [
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const streetRegex = /[A-Za-zÀ-ÿ\u0600-\u06FF]/;
const cityRegex = /^[A-Za-zÀ-ÿ\u0600-\u06FF\s\-'.]{2,}$/;
const houseNumberRegex = /^[A-Za-z0-9\s\-\/]{1,12}$/;
const postalCodeRegex = /^[A-Za-z0-9\-\s]{3,10}$/;

const ignoredDisplayValues = new Set([
  "",
  "not-sure",
  "not sure",
  "unknown",
  "none",
  "n/a",
  "na",
  "-",
  "غير متأكد",
  "غير محدد",
  "غير معروف",
  "nicht sicher",
  "unbekannt",
  "keine",
]);

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function looksLikeRandomText(value: string) {
  const clean = normalizeSpaces(value);
  if (!clean) return true;

  const lettersOnly = clean.replace(/[^A-Za-zÀ-ÿ\u0600-\u06FF]/g, "");
  if (lettersOnly.length < 2) return true;

  const uniqueChars = new Set(lettersOnly.toLowerCase().split("")).size;
  if (lettersOnly.length >= 4 && uniqueChars <= 2) return true;

  return false;
}

function shouldIgnoreDisplayValue(value: string) {
  return ignoredDisplayValues.has(normalizeSpaces(value).toLowerCase());
}

function validateCustomerData(data: CustomerData, lang: Language): string {
  const fullName = normalizeSpaces(data.fullName);
  const email = normalizeSpaces(data.email);
  const phone = data.phone.replace(/[^\d+]/g, "");
  const street = normalizeSpaces(data.street);
  const houseNumber = normalizeSpaces(data.houseNumber);
  const postalCode = normalizeSpaces(data.postalCode);
  const city = normalizeSpaces(data.city);

  if (
    !fullName ||
    !email ||
    !phone ||
    !street ||
    !houseNumber ||
    !postalCode ||
    !city
  ) {
    return cartText.requiredCustomerInfo[lang];
  }

  if (
    fullName.length < 5 ||
    !fullName.includes(" ") ||
    looksLikeRandomText(fullName)
  ) {
    return cartText.invalidFullName[lang];
  }

  if (!emailRegex.test(email)) {
    return cartText.invalidEmail[lang];
  }

  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return cartText.invalidPhone[lang];
  }

  if (
    street.length < 3 ||
    !streetRegex.test(street) ||
    looksLikeRandomText(street)
  ) {
    return cartText.invalidStreet[lang];
  }

  if (!houseNumberRegex.test(houseNumber)) {
    return cartText.invalidHouseNumber[lang];
  }

  if (!postalCodeRegex.test(postalCode)) {
    return cartText.invalidPostalCode[lang];
  }

  if (city.length < 2 || !cityRegex.test(city) || looksLikeRandomText(city)) {
    return cartText.invalidCity[lang];
  }

  return "";
}function getAllServiceFields(service?: Service): ServiceField[] {
  if (!service) return [];

  const flatSectionFields =
    service.sections?.flatMap((section) => section.fields || []) || [];
  const rootFields = service.fields || [];

  const map = new Map<string, ServiceField>();

  [...rootFields, ...flatSectionFields].forEach((field) => {
    if (!field?.id) return;
    if (!map.has(field.id)) {
      map.set(field.id, field);
    }
  });

  return Array.from(map.values());
}

function getServiceAttachments(service?: Service): ServiceAttachmentLike[] {
  if (!service) return [];
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

function formatFallbackFieldLabel(fieldId: string) {
  return fieldId
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function normalizeItemLanguage(value: unknown, fallback: Language): Language {
  return value === "ar" || value === "de" || value === "en" ? value : fallback;
}

function getSafeQuantity(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number(String(value ?? "").trim());

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 1;
  }
  return Math.max(1, Math.floor(numericValue));
}

function isolateText(value: string) {
  const clean = normalizeSpaces(String(value ?? ""));
  if (!clean) return "";
  return `\u2068${clean}\u2069`;
}

function buildLine(label: string, value: string) {
  return `• ${label}: ${isolateText(value)}`;
}

function openWhatsAppUrl(url: string) {
  if (typeof window === "undefined") return false;

  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup && !popup.closed) {
    return true;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  return true;
}

function normalizeId(value: string) {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function isSmartSizeField(field: ServiceField, label: string) {
  const fieldId = normalizeId(field.id);
  const normalizedLabel = normalizeId(label);

  return (
    field.type === "select" &&
    (field.semanticGroup === "dimensions" ||
      fieldId.includes("size") ||
      fieldId.includes("format") ||
      fieldId.includes("dimension") ||
      fieldId.includes("measure") ||
      normalizedLabel.includes("size") ||
      normalizedLabel.includes("format") ||
      normalizedLabel.includes("maß") ||
      normalizedLabel.includes("masse") ||
      normalizedLabel.includes("مقاس"))
  );
}

function isSmartQuantityField(field: ServiceField, label: string) {
  const fieldId = normalizeId(field.id);
  const normalizedLabel = normalizeId(label);

  return (
    field.type === "select" &&
    (fieldId.includes("quantity") ||
      fieldId.includes("qty") ||
      fieldId.includes("amount") ||
      normalizedLabel.includes("quantity") ||
      normalizedLabel.includes("menge") ||
      normalizedLabel.includes("كمية"))
  );
}

function isSmartPaperField(field: ServiceField, label: string) {
  const fieldId = normalizeId(field.id);
  const normalizedLabel = normalizeId(label);

  return (
    field.type === "select" &&
    (field.semanticGroup === "materials" ||
      fieldId.includes("paper") ||
      fieldId.includes("stock") ||
      normalizedLabel.includes("paper") ||
      normalizedLabel.includes("papier") ||
      normalizedLabel.includes("ورق"))
  );
}

function isSmartFinishingField(field: ServiceField, label: string) {
  const fieldId = normalizeId(field.id);
  const normalizedLabel = normalizeId(label);

  return (
    field.type === "select" &&
    (fieldId.includes("finish") ||
      fieldId.includes("finishing") ||
      fieldId.includes("lamination") ||
      fieldId.includes("postpress") ||
      normalizedLabel.includes("finish") ||
      normalizedLabel.includes("veredel") ||
      normalizedLabel.includes("تشطيب"))
  );
}

function mergeSmartOptions(
  fieldOptions: ServiceField["options"],
  smartOptions: LocalizedOption[]
) {
  const existing = fieldOptions || [];
  const seen = new Set<string>();
  const result: Array<{
    value: string;
    label: Partial<Record<Language, string>>;
  }> = [];

  [...existing, ...smartOptions].forEach((option) => {
    if (!option?.value || seen.has(option.value)) return;
    seen.add(option.value);
    result.push({
      value: option.value,
      label: option.label,
    });
  });

  return result;
}

export default function CartPage() {
  const { language, dir } = useLanguage();
  const lang = language as Language;
  const isArabic = lang === "ar";

  const [items, setItems] = useState<CartItemWithFields[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
  });
  const [generalNotes, setGeneralNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const refreshCart = () => {
    try {
      const cart = getCart() as CartItemWithFields[];
      setItems(Array.isArray(cart) ? cart : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    refreshCart();

    const handleFocus = () => refreshCart();
    const handleStorage = (event?: StorageEvent) => {
      if (!event?.key || event.key.toLowerCase().includes("cart")) {
        refreshCart();
      }
    };
    const handleCartUpdated = () => refreshCart();
    const handlePageShow = () => refreshCart();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshCart();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("cart-updated", handleCartUpdated as EventListener);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("cart-updated", handleCartUpdated as EventListener);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const servicesMap = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]));
  }, []);

  const totalRequestsCount = useMemo(() => {
    return items.reduce((total, item) => total + getSafeQuantity(item.quantity), 0);
  }, [items]);

  const getLocalizedText = (
    value: Partial<Record<Language, string>> | undefined,
    preferredLang: Language,
    fallback = ""
  ) => {
    if (!value) return fallback;
    return value[preferredLang] || value.en || value.de || value.ar || fallback;
  };

  const getServiceTitle = (item: CartItemWithFields, preferredLang: Language) => {
    const service = servicesMap.get(item.serviceId);

    return (
      getLocalizedText(service?.title, preferredLang, "") ||
      item.serviceTitle ||
      item.serviceId
    );
  };

  const getField = (
    item: CartItemWithFields,
    fieldId: string
  ): ServiceField | undefined => {
    const service = servicesMap.get(item.serviceId);
    const allFields = getAllServiceFields(service);
    return allFields.find((field) => field.id === fieldId);
  };

  const getAttachment = (item: CartItemWithFields, fieldId: string) => {
    const service = servicesMap.get(item.serviceId);
    const attachments = getServiceAttachments(service);
    return attachments.find((entry) => entry.id === fieldId);
  };

  const getEnhancedFieldOptions = (
    item: CartItemWithFields,
    fieldId: string,
    preferredLang: Language
  ) => {
    const field = getField(item, fieldId);
    if (!field) return [];

    const label = getLocalizedText(field.label, preferredLang, field.id);
    const existingOptions = field.options || [];

    if (existingOptions.length > 0) {
      return existingOptions;
    }

    if (isSmartSizeField(field, label)) {
      return mergeSmartOptions(existingOptions, smartSizeOptions);
    }

    if (isSmartQuantityField(field, label)) {
      return mergeSmartOptions(existingOptions, smartQuantityOptions);
    }

    if (isSmartPaperField(field, label)) {
      return mergeSmartOptions(existingOptions, smartPaperOptions);
    }

    if (isSmartFinishingField(field, label)) {
      return mergeSmartOptions(existingOptions, smartFinishingOptions);
    }

    return existingOptions;
  };

  const getFieldLabel = (
    item: CartItemWithFields,
    fieldId: string,
    preferredLang: Language
  ) => {
    const field = getField(item, fieldId);

    if (field?.label) {
      return getLocalizedText(
        field.label,
        preferredLang,
        formatFallbackFieldLabel(fieldId)
      );
    }

    const attachment = getAttachment(item, fieldId);

    if (attachment?.title) {
      return getLocalizedText(
        attachment.title,
        preferredLang,
        formatFallbackFieldLabel(fieldId)
      );
    }

    return formatFallbackFieldLabel(fieldId);
  };

  const getOptionLabel = (
    item: CartItemWithFields,
    fieldId: string,
    optionValue: string,
    preferredLang: Language
  ) => {
    const options = getEnhancedFieldOptions(item, fieldId, preferredLang);
    const option = options.find((opt) => opt.value === optionValue);

    return getLocalizedText(option?.label, preferredLang, optionValue);
  };

  const getFieldValue = (
    item: CartItemWithFields,
    fieldId: string,
    rawValue: string,
    preferredLang: Language
  ) => {
    const normalizedValue = normalizeSpaces(rawValue);
    const options = getEnhancedFieldOptions(item, fieldId, preferredLang);

    if (!options.length) {
      return normalizedValue;
    }

    const optionValueSet = new Set(options.map((option) => option.value));
    const field = getField(item, fieldId);

    if (field?.type === "checkbox") {
      return normalizedValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) =>
          optionValueSet.has(value)
            ? getOptionLabel(item, fieldId, value, preferredLang)
            : value
        )
        .join(", ");
    }

    return optionValueSet.has(normalizedValue)
      ? getOptionLabel(item, fieldId, normalizedValue, preferredLang)
      : normalizedValue;
  };  const getRenderableEntries = (item: CartItemWithFields, preferredLang: Language) => {
    if (Array.isArray(item.fields) && item.fields.length > 0) {
      return item.fields
        .map((entry) => {
          const label = normalizeSpaces(String(entry.label ?? ""));
          const value = normalizeSpaces(String(entry.value ?? ""));
          const fieldId = normalizeSpaces(String(entry.id ?? ""));

          if (!label || !value || shouldIgnoreDisplayValue(value)) {
            return null;
          }

          return {
            fieldId: fieldId || label,
            label,
            value,
          };
        })
        .filter(
          (
            entry
          ): entry is {
            fieldId: string;
            label: string;
            value: string;
          } => entry !== null
        );
    }

    return Object.entries(item.data)
      .map(([fieldId, rawValue]) => {
        const cleanValue = normalizeSpaces(String(rawValue));
        if (!cleanValue || shouldIgnoreDisplayValue(cleanValue)) {
          return null;
        }

        const label = getFieldLabel(item, fieldId, preferredLang);
        const value = getFieldValue(item, fieldId, cleanValue, preferredLang);

        if (!label || !value || shouldIgnoreDisplayValue(value)) {
          return null;
        }

        return {
          fieldId,
          label,
          value,
        };
      })
      .filter(
        (
          entry
        ): entry is {
          fieldId: string;
          label: string;
          value: string;
        } => entry !== null
      );
  };

  const handleRemove = (itemId: string) => {
    removeCartItem(itemId);
    refreshCart();
  };

  const handleClear = () => {
    clearCart();
    refreshCart();
    setSuccessMessage("");
    setErrorMessage("");
    setShowSendModal(false);
  };

  const handleCustomerChange = (key: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const validateBeforeSend = () => {
    if (items.length === 0) {
      setErrorMessage(cartText.empty[lang]);
      setSuccessMessage("");
      return false;
    }

    const validationError = validateCustomerData(customerData, lang);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return false;
    }

    return true;
  };

  const handleSendClick = () => {
    if (!validateBeforeSend()) return;
    setShowSendModal(true);
  };

  const handleConfirmedSend = async () => {
    if (!validateBeforeSend()) {
      setShowSendModal(false);
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");
      setSuccessMessage("");
      setShowSendModal(false);

      const phoneNumber = "4917621105086";

      const customerBlock =
        lang === "ar"
          ? `${requestText.customerData.ar}
${buildLine(requestText.name.ar, normalizeSpaces(customerData.fullName))}
${buildLine(requestText.phone.ar, normalizeSpaces(customerData.phone))}
${buildLine(requestText.email.ar, normalizeSpaces(customerData.email))}

${requestText.address.ar}
${buildLine(requestText.street.ar, normalizeSpaces(customerData.street))}
${buildLine(
  requestText.houseNumber.ar,
  normalizeSpaces(customerData.houseNumber)
)}
${buildLine(
  requestText.postalCode.ar,
  normalizeSpaces(customerData.postalCode)
)}
${buildLine(requestText.city.ar, normalizeSpaces(customerData.city))}`
          : lang === "de"
            ? `${requestText.customerData.de}
${buildLine(requestText.name.de, normalizeSpaces(customerData.fullName))}
${buildLine(requestText.phone.de, normalizeSpaces(customerData.phone))}
${buildLine(requestText.email.de, normalizeSpaces(customerData.email))}

${requestText.address.de}
${buildLine(requestText.street.de, normalizeSpaces(customerData.street))}
${buildLine(
  requestText.houseNumber.de,
  normalizeSpaces(customerData.houseNumber)
)}
${buildLine(
  requestText.postalCode.de,
  normalizeSpaces(customerData.postalCode)
)}
${buildLine(requestText.city.de, normalizeSpaces(customerData.city))}`
            : `${requestText.customerData.en}
${buildLine(requestText.name.en, normalizeSpaces(customerData.fullName))}
${buildLine(requestText.phone.en, normalizeSpaces(customerData.phone))}
${buildLine(requestText.email.en, normalizeSpaces(customerData.email))}

${requestText.address.en}
${buildLine(requestText.street.en, normalizeSpaces(customerData.street))}
${buildLine(
  requestText.houseNumber.en,
  normalizeSpaces(customerData.houseNumber)
)}
${buildLine(
  requestText.postalCode.en,
  normalizeSpaces(customerData.postalCode)
)}
${buildLine(requestText.city.en, normalizeSpaces(customerData.city))}`;

      const requestLines = items
        .map((item, index) => {
          const itemLang = normalizeItemLanguage(item.requestLanguage, lang);
          const renderableEntries = getRenderableEntries(item, itemLang);
          const detailLines: string[] = [];

          const quantity = getSafeQuantity(item.quantity);
          if (quantity > 1) {
            detailLines.push(
              buildLine(requestText.quantity[itemLang], String(quantity))
            );
          }

          renderableEntries.forEach((entry) => {
            detailLines.push(buildLine(entry.label, entry.value));
          });

          const details =
            detailLines.length > 0
              ? detailLines.join("\n")
              : `• ${requestText.noDetails[itemLang]}`;

          return `${index + 1}) ${isolateText(
            getServiceTitle(item, itemLang)
          )}
${details}`;
        })
        .join("\n\n");

      const message =
        lang === "ar"
          ? `${requestText.requestHeader.ar}

${customerBlock}

${requestText.requests.ar}
${requestLines}

${requestText.generalNotes.ar}
${isolateText(normalizeSpaces(generalNotes) || "-")}`
          : lang === "de"
            ? `${requestText.requestHeader.de}

${customerBlock}

${requestText.requests.de}
${requestLines}

${requestText.generalNotes.de}
${isolateText(normalizeSpaces(generalNotes) || "-")}`
            : `${requestText.requestHeader.en}

${customerBlock}

${requestText.requests.en}
${requestLines}

${requestText.generalNotes.en}
${isolateText(normalizeSpaces(generalNotes) || "-")}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      const opened = openWhatsAppUrl(whatsappUrl);

      if (!opened) {
        throw new Error("WhatsApp open blocked");
      }

      setSuccessMessage(cartText.sentSuccess[lang]);
      setErrorMessage("");
    } catch {
      setErrorMessage(cartText.sendFailed[lang]);
      setSuccessMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1180px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d3bf",
      borderRadius: "22px",
      padding: "22px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
      textAlign: "center",
    },

    badge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
      letterSpacing: "0.2px",
    },

    title: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 38px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
    },

    subtitle: {
      margin: "0 auto",
      maxWidth: "760px",
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
    },

    layoutGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "14px",
      alignItems: "start",
    },

    panel: {
      background: "rgba(255,255,255,0.88)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
      minWidth: 0,
    },

    panelTitle: {
      fontSize: "18px",
      margin: "0 0 8px",
      color: "#35281d",
      fontWeight: 800,
      lineHeight: 1.3,
    },

    panelDescription: {
      margin: "0 0 12px",
      color: "#6d5b49",
      lineHeight: 1.7,
      fontSize: "13px",
    },

    countText: {
      fontSize: "12px",
      color: "#7b6654",
      marginBottom: "12px",
      fontWeight: 700,
    },

    customerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "10px",
    },

    input: {
      width: "100%",
      minHeight: "44px",
      padding: "10px 12px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      minHeight: "100px",
      padding: "12px",
      border: "1px solid #dbc9b5",
      borderRadius: "14px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.7,
    },

    emptyBox: {
      border: "1px dashed #d9c4ab",
      borderRadius: "14px",
      padding: "14px",
      color: "#6f5b48",
      background: "#fffaf4",
      fontSize: "13px",
      lineHeight: 1.7,
    },

    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    itemCard: {
      border: "1px solid #e8dacc",
      borderRadius: "14px",
      padding: "12px",
      background: "#fffdf9",
    },

    itemHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      alignItems: "flex-start",
      marginBottom: "8px",
    },

    itemTitle: {
      fontWeight: 800,
      lineHeight: 1.55,
      color: "#2f2419",
      fontSize: "14px",
      minWidth: 0,
      flex: 1,
    },

    removeButton: {
      border: "none",
      background: "transparent",
      color: "#b63a31",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
      padding: 0,
    },

    previewList: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },

    previewRow: {
      fontSize: "12px",
      color: "#4f4032",
      lineHeight: 1.6,
      wordBreak: "break-word",
    },

    actionsWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "14px",
    },

    inlineMessageBox: {
      padding: "12px 14px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: 1.7,
      fontWeight: 700,
    },

    primaryButton: {
      width: "100%",
      minHeight: "46px",
      padding: "12px 14px",
      background: "#1f1711",
      color: "#ffffff",
      border: "1px solid #241a12",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
    },

    secondaryButton: {
      width: "100%",
      minHeight: "46px",
      padding: "12px 14px",
      background: "#f2e7da",
      color: "#2f2419",
      border: "1px solid #e0cfbd",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
    },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(31, 23, 17, 0.38)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "18px",
      zIndex: 3000,
    },

    modalBox: {
      width: "100%",
      maxWidth: "560px",
      background: "#fffaf4",
      border: "1px solid #e7dacb",
      borderRadius: "22px",
      padding: "22px 20px",
      boxShadow: "0 20px 50px rgba(45, 33, 22, 0.14)",
    },

    modalText: {
      margin: 0,
      fontSize: "15px",
      lineHeight: 1.9,
      color: "#5b4b3c",
    },

    modalInfoList: {
      display: "grid",
      gap: "10px",
      marginTop: "16px",
    },

    modalInfoItem: {
      padding: "12px 14px",
      borderRadius: "14px",
      border: "1px solid #e3d4c2",
      background: "#f8f1e8",
      color: "#4f4032",
      fontSize: "14px",
      lineHeight: 1.7,
      wordBreak: "break-word",
    },

    modalActions: {
      marginTop: "18px",
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
    },

    modalConfirmButton: {
      minWidth: "130px",
      minHeight: "46px",
      padding: "10px 18px",
      background: "#1f1711",
      color: "#ffffff",
      border: "1px solid #241a12",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    },
  };

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackHome />

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>{cartText.badge[lang]}</div>
          <h1 style={styles.title}>{cartText.title[lang]}</h1>
          <p style={styles.subtitle}>{cartText.subtitle[lang]}</p>
        </section>

        <div style={styles.layoutGrid}>
          <section style={styles.panel}>
            <h2
              style={{
                ...styles.panelTitle,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.cartTitle[lang]}
            </h2>

            <p
              style={{
                ...styles.panelDescription,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.requestsSectionDescription[lang]}
            </p>

            <div
              style={{
                ...styles.countText,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.count[lang]}: {totalRequestsCount}
            </div>

            <div style={styles.itemsList}>
              {items.length === 0 && (
                <div
                  style={{
                    ...styles.emptyBox,
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {cartText.empty[lang]}
                </div>
              )}

              {items.map((item, index) => {
                const itemLang = normalizeItemLanguage(item.requestLanguage, lang);
                const itemIsArabic = itemLang === "ar";
                const previewEntries = getRenderableEntries(item, itemLang).slice(0, 12);

                return (
                  <div
                    key={item.id || `${item.serviceId}-${index}`}
                    style={styles.itemCard}
                    dir={itemIsArabic ? "rtl" : "ltr"}
                  >
                    <div style={styles.itemHeader}>
                      <div
                        style={{
                          ...styles.itemTitle,
                          textAlign: itemIsArabic ? "right" : "left",
                        }}
                      >
                        {getServiceTitle(item, itemLang)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        style={styles.removeButton}
                      >
                        {cartText.remove[lang]}
                      </button>
                    </div>

                    {previewEntries.length > 0 && (
                      <div style={styles.previewList}>
                        {previewEntries.map((entry) => (
                          <div
                            key={entry.fieldId}
                            style={{
                              ...styles.previewRow,
                              textAlign: itemIsArabic ? "right" : "left",
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              {entry.label}:
                            </span>{" "}
                            {entry.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.actionsWrap}>
              {(errorMessage || successMessage) && (
                <div
                  style={{
                    ...styles.inlineMessageBox,
                    border: errorMessage
                      ? "1px solid #efc4bf"
                      : "1px solid #b9dcc1",
                    background: errorMessage ? "#fff2f1" : "#edf8f0",
                    color: errorMessage ? "#8b2f25" : "#245a30",
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {errorMessage || successMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendClick}
                disabled={isSending || items.length === 0}
                style={{
                  ...styles.primaryButton,
                  opacity: isSending || items.length === 0 ? 0.6 : 1,
                  cursor:
                    isSending || items.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {isSending ? cartText.sending[lang] : cartText.sendAll[lang]}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={items.length === 0}
                style={{
                  ...styles.secondaryButton,
                  opacity: items.length === 0 ? 0.6 : 1,
                  cursor: items.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {cartText.clear[lang]}
              </button>
            </div>
          </section>

          <section style={styles.panel}>
            <h2
              style={{
                ...styles.panelTitle,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.customerInfo[lang]}
            </h2>

            <p
              style={{
                ...styles.panelDescription,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.customerSectionDescription[lang]}
            </p>

            <div style={styles.customerGrid}>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder={cartText.fullName[lang]}
                value={customerData.fullName}
                onChange={(e) => handleCustomerChange("fullName", e.target.value)}
                style={{
                  ...styles.input,
                  gridColumn: "1 / -1",
                }}
              />

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={customerData.email}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                style={styles.input}
              />

              <input
                type="tel"
                name="tel"
                autoComplete="tel"
                placeholder={cartText.phone[lang]}
                value={customerData.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="address-line1"
                autoComplete="address-line1"
                placeholder={cartText.street[lang]}
                value={customerData.street}
                onChange={(e) => handleCustomerChange("street", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="address-line2"
                autoComplete="address-line2"
                placeholder={cartText.houseNumber[lang]}
                value={customerData.houseNumber}
                onChange={(e) => handleCustomerChange("houseNumber", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="postal-code"
                autoComplete="postal-code"
                placeholder={cartText.postalCode[lang]}
                value={customerData.postalCode}
                onChange={(e) => handleCustomerChange("postalCode", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="address-level2"
                autoComplete="address-level2"
                placeholder={cartText.city[lang]}
                value={customerData.city}
                onChange={(e) => handleCustomerChange("city", e.target.value)}
                style={styles.input}
              />

              <textarea
                name="generalNotes"
                autoComplete="off"
                placeholder={`${cartText.generalNotes[lang]} — ${cartText.optional[lang]}`}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                style={{
                  ...styles.textarea,
                  gridColumn: "1 / -1",
                }}
              />
            </div>
          </section>
        </div>
      </div>

      {showSendModal && (
        <div style={styles.modalOverlay}>
          <div dir={dir} style={styles.modalBox}>
            <p
              style={{
                ...styles.modalText,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.modalMessage[lang]}
            </p>

            <div style={styles.modalInfoList}>
              <div
                style={{
                  ...styles.modalInfoItem,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                WhatsApp: +49 176 21105086
              </div>

              <div
                style={{
                  ...styles.modalInfoItem,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                data@carobara.com
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={handleConfirmedSend}
                style={styles.modalConfirmButton}
              >
                {cartText.modalConfirm[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}