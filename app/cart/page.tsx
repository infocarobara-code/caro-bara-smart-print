"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Header from "@/components/Header";
import { services } from "@/data/services";
import {
  clearCart,
  getCart,
  getCartPublicData,
  removeCartItem,
  type CartItem,
} from "@/lib/cart";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/languageContext";
import type { Service, ServiceField } from "@/types/service";

type CustomerSalutation = "mr" | "ms" | "";

type CustomerData = {
  salutation: CustomerSalutation;
  firstName: string;
  lastName: string;
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

type RenderableEntry = {
  fieldId: string;
  label: string;
  value: string;
};

type SendMode = "internal" | "whatsapp";

type SubmitRequestApiResponse = {
  success?: boolean;
  error?: string;
  requestId?: string;
  receivedAt?: string;
  requestLanguage?: string;
  deliveredTo?: string;
  savedToDatabase?: boolean;
  supabaseRowId?: string;
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
  sendWhatsapp: {
    ar: "إرسال عبر واتساب",
    de: "Per WhatsApp senden",
    en: "Send via WhatsApp",
  },
  sendInternal: {
    ar: "إرسال داخلي",
    de: "Intern senden",
    en: "Send Internally",
  },
  sendingWhatsapp: {
    ar: "جارٍ تحضير واتساب...",
    de: "WhatsApp wird vorbereitet...",
    en: "Preparing WhatsApp...",
  },
  sendingInternal: {
    ar: "جارٍ إرسال الطلب...",
    de: "Anfrage wird gesendet...",
    en: "Sending request...",
  },
  customerInfo: {
    ar: "بيانات العميل",
    de: "Kundendaten",
    en: "Customer Information",
  },
  salutation: {
    ar: "سيدة / سيد",
    de: "Frau / Herr",
    en: "Ms / Mr",
  },
  salutationPlaceholder: {
    ar: "اختر سيدة أو سيد",
    de: "Bitte Frau oder Herr wählen",
    en: "Please choose Ms or Mr",
  },
  salutationMr: {
    ar: "سيد",
    de: "Herr",
    en: "Mr",
  },
  salutationMs: {
    ar: "سيدة",
    de: "Frau",
    en: "Ms",
  },
  firstName: {
    ar: "الاسم الأول",
    de: "Vorname",
    en: "First Name",
  },
  lastName: {
    ar: "اسم العائلة",
    de: "Nachname",
    en: "Last Name",
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
  phoneOptionalHint: {
    ar: "رقم الهاتف اختياري إذا اخترت الإرسال الداخلي",
    de: "Telefon ist optional, wenn du intern sendest",
    en: "Phone is optional if you choose internal sending",
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
    ar: "يرجى إدخال البيانات المطلوبة بشكل صحيح قبل الإرسال.",
    de: "Bitte gib die erforderlichen Daten korrekt ein, bevor du sendest.",
    en: "Please enter the required details correctly before sending.",
  },
  invalidSalutation: {
    ar: "يرجى اختيار سيدة أو سيد.",
    de: "Bitte wähle Frau oder Herr aus.",
    en: "Please choose Ms or Mr.",
  },
  invalidFirstName: {
    ar: "يرجى إدخال اسم أول حقيقي وواضح.",
    de: "Bitte gib einen echten und klaren Vornamen ein.",
    en: "Please enter a real and clear first name.",
  },
  invalidLastName: {
    ar: "يرجى إدخال اسم عائلة حقيقي وواضح.",
    de: "Bitte gib einen echten und klaren Nachnamen ein.",
    en: "Please enter a real and clear last name.",
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
  internalSuccess: {
    ar: "تم إرسال الطلب داخليًا بنجاح.",
    de: "Die Anfrage wurde intern erfolgreich gesendet.",
    en: "The request was sent internally successfully.",
  },
  internalFailed: {
    ar: "تعذر إرسال الطلب داخليًا. حاول مرة أخرى.",
    de: "Die interne Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.",
    en: "Failed to send the internal request. Please try again.",
  },
  fetchFailed: {
    ar: "تعذر الاتصال بالخادم. تحقق من أن مسار الإرسال يعمل ثم حاول مرة أخرى.",
    de: "Verbindung zum Server fehlgeschlagen. Prüfe die Submit-Route und versuche es erneut.",
    en: "Failed to connect to the server. Check the submit route and try again.",
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
    ar: "إذا كان لديك صور أو مستندات أو مخططات مرتبطة بطلبك، يمكنك إرسالها لنا عبر واتساب أو إلى البريد التالي.",
    de: "Falls du Bilder, Unterlagen oder Skizzen zu deiner Anfrage hast, kannst du sie uns per WhatsApp oder an die folgende E-Mail-Adresse senden.",
    en: "If you have images, documents, or drawings related to your request, you can send them to us via WhatsApp or to the following email address.",
  },
  modalConfirm: {
    ar: "فتح واتساب",
    de: "WhatsApp öffnen",
    en: "Open WhatsApp",
  },
  successBoxTitle: {
    ar: "تم استلام طلبك بنجاح",
    de: "Deine Anfrage wurde erfolgreich empfangen",
    en: "Your request was received successfully",
  },
  successBoxDescription: {
    ar: "تم إرسال الطلب إلى فريق Caro Bara Smart Print بنجاح، وتم تفريغ السلة ومسح البيانات المدخلة لهذه العملية.",
    de: "Die Anfrage wurde erfolgreich an das Team von Caro Bara Smart Print gesendet. Warenkorb und Eingabedaten für diesen Vorgang wurden zurückgesetzt.",
    en: "Your request was successfully sent to the Caro Bara Smart Print team. The cart and entered data for this submission were reset.",
  },
  successBoxNextStep: {
    ar: "يمكنك الآن بدء طلب جديد أو الانتظار حتى تتم مراجعة طلبك والتواصل معك.",
    de: "Du kannst jetzt eine neue Anfrage starten oder auf die Prüfung und Rückmeldung warten.",
    en: "You can now start a new request or wait while your submission is reviewed and you are contacted.",
  },
};

const requestText = {
  requestHeader: {
    ar: "طلب جديد - Caro Bara",
    de: "Neue Anfrage - Caro Bara",
    en: "New Request - Caro Bara",
  },
  greeting: {
    ar: "",
    de: "",
    en: "",
  },
  closing: {
    ar: "مع أطيب التحيات، فريق Caro Bara",
    de: "Mit freundlichen Grüßen\nCaro Bara Team",
    en: "Best regards,\nCaro Bara Team",
  },
  customerData: {
    ar: "بيانات العميل:",
    de: "Kundendaten:",
    en: "Customer:",
  },
  salutation: {
    ar: "الصفة",
    de: "Anrede",
    en: "Salutation",
  },
  firstName: {
    ar: "الاسم الأول",
    de: "Vorname",
    en: "First Name",
  },
  lastName: {
    ar: "اسم العائلة",
    de: "Nachname",
    en: "Last Name",
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
};const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
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

function safeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeSpaces(value: unknown) {
  return safeString(value).replace(/\s+/g, " ").trim();
}

function normalizeComparisonText(value: unknown) {
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

function normalizeItemLanguage(
  value: unknown,
  fallback: Language = "de",
  defaultLanguage: Language = "de"
): Language {
  const normalized = normalizeSpaces(value).toLowerCase();

  if (normalized === "ar" || normalized.startsWith("ar-")) return "ar";
  if (normalized === "de" || normalized.startsWith("de-")) return "de";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";

  return fallback || defaultLanguage;
}

function looksLikeRandomText(value: unknown) {
  const clean = normalizeSpaces(value);
  if (!clean) return true;

  const lettersOnly = clean.replace(/[^A-Za-zÀ-ÿ\u0600-\u06FF]/g, "");
  if (lettersOnly.length < 2) return true;

  const uniqueChars = new Set(lettersOnly.toLowerCase().split("")).size;
  if (lettersOnly.length >= 4 && uniqueChars <= 2) return true;

  return false;
}

function shouldIgnoreDisplayValue(value: unknown) {
  return ignoredDisplayValues.has(normalizeSpaces(value).toLowerCase());
}

function getLocalizedSalutation(
  salutation: CustomerSalutation,
  lang: Language
) {
  if (salutation === "mr") return cartText.salutationMr[lang];
  if (salutation === "ms") return cartText.salutationMs[lang];
  return "";
}

function buildFullName(firstName: unknown, lastName: unknown) {
  return normalizeSpaces(
    `${normalizeSpaces(firstName)} ${normalizeSpaces(lastName)}`
  );
}

function normalizeCustomerData(
  data: Partial<CustomerData> | null | undefined
): CustomerData {
  const firstName = normalizeSpaces(data?.firstName);
  const lastName = normalizeSpaces(data?.lastName);
  const fullName = buildFullName(firstName, lastName);
  const rawSalutation = normalizeSpaces(data?.salutation);
  const salutation: CustomerSalutation =
    rawSalutation === "mr" || rawSalutation === "ms" ? rawSalutation : "";

  return {
    salutation,
    firstName,
    lastName,
    fullName,
    email: normalizeSpaces(data?.email),
    phone: normalizeSpaces(data?.phone),
    street: normalizeSpaces(data?.street),
    houseNumber: normalizeSpaces(data?.houseNumber),
    postalCode: normalizeSpaces(data?.postalCode),
    city: normalizeSpaces(data?.city),
  };
}

function buildGreetingLine(data: CustomerData, lang: Language) {
  const normalized = normalizeCustomerData(data);

  if (lang === "ar") {
    if (normalized.salutation === "mr") {
      return normalizeSpaces(`السيد العزيز ${normalized.fullName}`);
    }

    if (normalized.salutation === "ms") {
      return normalizeSpaces(`السيدة العزيزة ${normalized.fullName}`);
    }

    return normalizeSpaces(`عزيزي/عزيزتي ${normalized.fullName}`);
  }

  if (lang === "de") {
    if (normalized.salutation === "mr") {
      return normalizeSpaces(`Sehr geehrter Herr ${normalized.lastName},`);
    }

    if (normalized.salutation === "ms") {
      return normalizeSpaces(`Sehr geehrte Frau ${normalized.lastName},`);
    }

    return normalizeSpaces(`Guten Tag ${normalized.fullName},`);
  }

  if (normalized.salutation === "mr") {
    return normalizeSpaces(`Dear Mr. ${normalized.lastName},`);
  }

  if (normalized.salutation === "ms") {
    return normalizeSpaces(`Dear Ms. ${normalized.lastName},`);
  }

  return normalizeSpaces(`Dear ${normalized.fullName},`);
}

function validateCustomerData(
  data: CustomerData,
  lang: Language,
  mode: SendMode
): string {
  const normalized = normalizeCustomerData(data);
  const fullName = normalized.fullName;
  const firstName = normalized.firstName;
  const lastName = normalized.lastName;
  const email = normalized.email;
  const phone = normalized.phone.replace(/[^\d+]/g, "");
  const street = normalized.street;
  const houseNumber = normalized.houseNumber;
  const postalCode = normalized.postalCode;
  const city = normalized.city;

  if (
    !normalized.salutation ||
    !firstName ||
    !lastName ||
    !email ||
    !street ||
    !houseNumber ||
    !postalCode ||
    !city
  ) {
    return cartText.requiredCustomerInfo[lang];
  }

  if (normalized.salutation !== "mr" && normalized.salutation !== "ms") {
    return cartText.invalidSalutation[lang];
  }

  if (
    firstName.length < 2 ||
    !/[A-Za-zÀ-ÿ\u0600-\u06FF]/.test(firstName) ||
    looksLikeRandomText(firstName)
  ) {
    return cartText.invalidFirstName[lang];
  }

  if (
    lastName.length < 2 ||
    !/[A-Za-zÀ-ÿ\u0600-\u06FF]/.test(lastName) ||
    looksLikeRandomText(lastName)
  ) {
    return cartText.invalidLastName[lang];
  }

  if (
    !fullName.includes(" ") ||
    fullName.length < 5 ||
    looksLikeRandomText(fullName)
  ) {
    return cartText.invalidFullName[lang];
  }

  if (!emailRegex.test(email)) {
    return cartText.invalidEmail[lang];
  }

  if (phone) {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return cartText.invalidPhone[lang];
    }
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
  const rawAttachments = (service as unknown as { attachments?: unknown })
    .attachments;

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

function getSafeQuantity(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number(String(value ?? "").trim());

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(numericValue));
}

function isolateText(value: unknown) {
  const clean = normalizeSpaces(value);
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

function isQuantityLikeEntry(entry: RenderableEntry) {
  const normalizedId = normalizeComparisonText(entry.fieldId);
  const normalizedLabel = normalizeComparisonText(entry.label);

  return (
    normalizedId.includes("quantity") ||
    normalizedId.includes("qty") ||
    normalizedId.includes("amount") ||
    normalizedLabel.includes("quantity") ||
    normalizedLabel.includes("menge") ||
    normalizedLabel.includes("qty") ||
    normalizedLabel.includes("كمية")
  );
}

function dedupeRenderableEntries(
  entries: RenderableEntry[],
  itemQuantity: number
): RenderableEntry[] {
  const uniqueEntries: RenderableEntry[] = [];
  const exactSeen = new Set<string>();
  const labelValueSeen = new Set<string>();
  const semanticSeen = new Set<string>();
  let quantityAlreadyRepresented = false;

  entries.forEach((entry) => {
    const fieldId = normalizeSpaces(entry.fieldId);
    const label = normalizeSpaces(entry.label);
    const value = normalizeSpaces(entry.value);

    if (!fieldId || !label || !value || shouldIgnoreDisplayValue(value)) {
      return;
    }

    const normalizedFieldId = normalizeComparisonText(fieldId);
    const normalizedLabel = normalizeComparisonText(label);
    const normalizedValue = normalizeComparisonText(value);

    const exactKey = `${normalizedFieldId}||${normalizedLabel}||${normalizedValue}`;
    if (exactSeen.has(exactKey)) return;

    const labelValueKey = `${normalizedLabel}||${normalizedValue}`;
    if (labelValueSeen.has(labelValueKey)) return;

    const semanticKey = `${normalizedFieldId}||${normalizedLabel}`;
    const isQuantityEntry = isQuantityLikeEntry(entry);

    if (isQuantityEntry) {
      const numericValue = Number(normalizedValue.replace(/[^\d]/g, ""));
      if (
        Number.isFinite(numericValue) &&
        numericValue > 0 &&
        numericValue === itemQuantity
      ) {
        if (quantityAlreadyRepresented) return;
        quantityAlreadyRepresented = true;
      }
    }

    if (semanticSeen.has(semanticKey) && !isQuantityEntry) {
      const existingIndex = uniqueEntries.findIndex(
        (existing) =>
          normalizeComparisonText(existing.fieldId) === normalizedFieldId &&
          normalizeComparisonText(existing.label) === normalizedLabel
      );

      if (existingIndex >= 0) {
        const existingEntry = uniqueEntries[existingIndex];
        const existingValue = normalizeSpaces(existingEntry.value);

        if (value.length > existingValue.length) {
          uniqueEntries[existingIndex] = entry;
        }
        return;
      }
    }

    exactSeen.add(exactKey);
    labelValueSeen.add(labelValueKey);
    semanticSeen.add(semanticKey);
    uniqueEntries.push(entry);
  });

  return uniqueEntries;
}function splitMultiValue(value: string) {
  return value
    .split(",")
    .map((part) => normalizeSpaces(part))
    .filter(Boolean);
}

function normalizeOptionLabelValue(value: string) {
  return normalizeComparisonText(value)
    .replace(/[×x]/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchingOptionLabel(
  options: Array<{
    value: string;
    label: Partial<Record<Language, string>>;
  }>,
  rawValue: string,
  preferredLang: Language
) {
  const cleanRaw = normalizeSpaces(rawValue);
  if (!cleanRaw) return "";

  const normalizedRaw = normalizeOptionLabelValue(cleanRaw);

  const directByValue = options.find(
    (option) => normalizeOptionLabelValue(option.value) === normalizedRaw
  );
  if (directByValue) {
    return (
      directByValue.label[preferredLang] ||
      directByValue.label.en ||
      directByValue.label.de ||
      directByValue.label.ar ||
      cleanRaw
    );
  }

  const directByLabel = options.find((option) => {
    const labels = [
      option.label.ar || "",
      option.label.de || "",
      option.label.en || "",
    ].map((entry) => normalizeOptionLabelValue(entry));

    return labels.includes(normalizedRaw);
  });

  if (directByLabel) {
    return (
      directByLabel.label[preferredLang] ||
      directByLabel.label.en ||
      directByLabel.label.de ||
      directByLabel.label.ar ||
      cleanRaw
    );
  }

  const looseByValue = options.find((option) => {
    const normalizedOptionValue = normalizeOptionLabelValue(option.value);
    return (
      normalizedOptionValue.includes(normalizedRaw) ||
      normalizedRaw.includes(normalizedOptionValue)
    );
  });

  if (looseByValue) {
    return (
      looseByValue.label[preferredLang] ||
      looseByValue.label.en ||
      looseByValue.label.de ||
      looseByValue.label.ar ||
      cleanRaw
    );
  }

  const looseByLabel = options.find((option) => {
    const labels = [
      option.label.ar || "",
      option.label.de || "",
      option.label.en || "",
    ].map((entry) => normalizeOptionLabelValue(entry));

    return labels.some(
      (normalizedLabel) =>
        normalizedLabel.includes(normalizedRaw) ||
        normalizedRaw.includes(normalizedLabel)
    );
  });

  if (looseByLabel) {
    return (
      looseByLabel.label[preferredLang] ||
      looseByLabel.label.en ||
      looseByLabel.label.de ||
      looseByLabel.label.ar ||
      cleanRaw
    );
  }

  return cleanRaw;
}

function getReadableApiError(error: unknown, lang: Language) {
  const raw = normalizeSpaces(error);

  if (!raw) {
    return cartText.internalFailed[lang];
  }

  const lower = raw.toLowerCase();

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("load failed")
  ) {
    return lang === "ar"
      ? "تعذر الاتصال بالخادم. تحقق من أن مسار API يعمل وأن الموقع أعيد بناؤه بعد التعديلات."
      : lang === "de"
        ? "Verbindung zum Server fehlgeschlagen. Prüfe, ob der API-Pfad funktioniert und die Website nach den Änderungen neu gebaut wurde."
        : "Could not connect to the server. Check that the API route is working and the site was rebuilt after the changes.";
  }

  if (lower.includes("supabase insert failed")) {
    return lang === "ar"
      ? "فشل حفظ الطلب في قاعدة البيانات. يوجد عدم تطابق بين الحقول المرسلة وبنية جدول requests في Supabase."
      : lang === "de"
        ? "Die Anfrage konnte nicht in der Datenbank gespeichert werden. Es gibt eine Abweichung zwischen den gesendeten Feldern und der Struktur der Tabelle requests in Supabase."
        : "Saving the request to the database failed. There is a mismatch between the submitted fields and the requests table structure in Supabase.";
  }

  return raw;
}

export default function CartPage() {
  const { language, dir } = useLanguage();
  const lang: Language =
    language === "ar" || language === "en" || language === "de"
      ? language
      : "de";
  const isArabic = lang === "ar";

  const emptyCustomerData: CustomerData = {
    salutation: "",
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
  };

  const [items, setItems] = useState<CartItemWithFields[]>([]);
  const [customerData, setCustomerData] =
    useState<CustomerData>(emptyCustomerData);
  const [generalNotes, setGeneralNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState(false);
  const [isSendingInternal, setIsSendingInternal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const safeCustomerData = useMemo(
    () => normalizeCustomerData(customerData),
    [customerData]
  );

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
      window.removeEventListener(
        "cart-updated",
        handleCartUpdated as EventListener
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const servicesMap = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]));
  }, []);

  const totalRequestsCount = useMemo(() => items.length, [items]);

  const getLocalizedText = (
    value: Partial<Record<Language, string>> | undefined,
    preferredLang: Language,
    fallback = ""
  ) => {
    if (!value) return fallback;
    return value[preferredLang] || fallback;
  };

  const getBestLocalizedText = (
    value: Partial<Record<Language, string>> | undefined,
    preferredLang: Language,
    fallback = ""
  ) => {
    if (!value) return fallback;
    return value[preferredLang] || value.en || value.de || value.ar || fallback;
  };

  const getServiceTitle = (
    item: CartItemWithFields,
    preferredLang: Language
  ) => {
    const itemTitle = normalizeSpaces(item.serviceTitle);
    if (itemTitle) {
      return itemTitle;
    }

    const service = servicesMap.get(item.serviceId);

    return (
      getLocalizedText(service?.title, preferredLang, "") ||
      getBestLocalizedText(service?.title, preferredLang, "") ||
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

    const label = getBestLocalizedText(field.label, preferredLang, field.id);
    const existingOptions = field.options || [];

    if (existingOptions.length > 0) return existingOptions;
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

  const getFallbackFieldLabel = (
    item: CartItemWithFields,
    fieldId: string,
    preferredLang: Language
  ) => {
    const field = getField(item, fieldId);

    if (field?.label) {
      return (
        field.label[preferredLang] ||
        field.label.en ||
        field.label.de ||
        field.label.ar ||
        formatFallbackFieldLabel(fieldId)
      );
    }

    const attachment = getAttachment(item, fieldId);

    if (attachment?.title) {
      return (
        attachment.title[preferredLang] ||
        attachment.title.en ||
        attachment.title.de ||
        attachment.title.ar ||
        formatFallbackFieldLabel(fieldId)
      );
    }

    return formatFallbackFieldLabel(fieldId);
  };

  const getFallbackFieldValue = (
    item: CartItemWithFields,
    fieldId: string,
    rawValue: string,
    preferredLang: Language
  ) => {
    const normalizedValue = normalizeSpaces(rawValue);
    const options = getEnhancedFieldOptions(item, fieldId, preferredLang);

    if (!options.length) return normalizedValue;

    const field = getField(item, fieldId);

    if (field?.type === "checkbox") {
      return splitMultiValue(normalizedValue)
        .map((singleValue) =>
          findMatchingOptionLabel(options, singleValue, preferredLang)
        )
        .filter(Boolean)
        .join(", ");
    }

    return findMatchingOptionLabel(options, normalizedValue, preferredLang);
  };

  const getRenderableEntries = (
    item: CartItemWithFields,
    preferredLang: Language
  ): RenderableEntry[] => {
    const fieldEntriesById = new Map<string, RenderableEntry>();

    if (Array.isArray(item.fields)) {
      item.fields.forEach((entry) => {
        const fieldId = normalizeSpaces(entry.id);
        const label = normalizeSpaces(entry.label);
        const value = normalizeSpaces(entry.value);

        if (
          !fieldId ||
          !label ||
          !value ||
          shouldIgnoreDisplayValue(value) ||
          shouldIgnoreDisplayValue(label)
        ) {
          return;
        }

        fieldEntriesById.set(normalizeComparisonText(fieldId), {
          fieldId,
          label,
          value,
        });
      });
    }

    const mergedEntries: RenderableEntry[] = [...fieldEntriesById.values()];
    const publicData = getCartPublicData(item);

    Object.entries(publicData || {}).forEach(([fieldId, rawValue]) => {
      const normalizedFieldId = normalizeComparisonText(fieldId);

      if (fieldEntriesById.has(normalizedFieldId)) return;

      const cleanValue = normalizeSpaces(rawValue);
      if (!cleanValue || shouldIgnoreDisplayValue(cleanValue)) return;

      const label = getFallbackFieldLabel(item, fieldId, preferredLang);
      const value = getFallbackFieldValue(
        item,
        fieldId,
        cleanValue,
        preferredLang
      );

      if (!label || shouldIgnoreDisplayValue(label) || !value) return;

      mergedEntries.push({
        fieldId,
        label,
        value,
      });
    });

    return dedupeRenderableEntries(
      mergedEntries,
      getSafeQuantity(item.quantity)
    );
  };

  const buildCustomerBlock = () => {
    const normalizedCustomer = normalizeCustomerData(safeCustomerData);
    const phoneValue = normalizedCustomer.phone;
    const phoneLine =
      phoneValue.length > 0
        ? `
${buildLine(requestText.phone[lang], phoneValue)}`
        : "";

    return lang === "ar"
      ? `${requestText.customerData.ar}
${buildLine(
  requestText.salutation.ar,
  getLocalizedSalutation(normalizedCustomer.salutation, lang)
)}
${buildLine(requestText.firstName.ar, normalizedCustomer.firstName)}
${buildLine(requestText.lastName.ar, normalizedCustomer.lastName)}
${buildLine(requestText.name.ar, normalizedCustomer.fullName)}${phoneLine}
${buildLine(requestText.email.ar, normalizedCustomer.email)}

${requestText.address.ar}
${buildLine(requestText.street.ar, normalizedCustomer.street)}
${buildLine(requestText.houseNumber.ar, normalizedCustomer.houseNumber)}
${buildLine(requestText.postalCode.ar, normalizedCustomer.postalCode)}
${buildLine(requestText.city.ar, normalizedCustomer.city)}`
      : lang === "de"
        ? `${requestText.customerData.de}
${buildLine(
  requestText.salutation.de,
  getLocalizedSalutation(normalizedCustomer.salutation, lang)
)}
${buildLine(requestText.firstName.de, normalizedCustomer.firstName)}
${buildLine(requestText.lastName.de, normalizedCustomer.lastName)}
${buildLine(requestText.name.de, normalizedCustomer.fullName)}${phoneLine}
${buildLine(requestText.email.de, normalizedCustomer.email)}

${requestText.address.de}
${buildLine(requestText.street.de, normalizedCustomer.street)}
${buildLine(requestText.houseNumber.de, normalizedCustomer.houseNumber)}
${buildLine(requestText.postalCode.de, normalizedCustomer.postalCode)}
${buildLine(requestText.city.de, normalizedCustomer.city)}`
        : `${requestText.customerData.en}
${buildLine(
  requestText.salutation.en,
  getLocalizedSalutation(normalizedCustomer.salutation, lang)
)}
${buildLine(requestText.firstName.en, normalizedCustomer.firstName)}
${buildLine(requestText.lastName.en, normalizedCustomer.lastName)}
${buildLine(requestText.name.en, normalizedCustomer.fullName)}${phoneLine}
${buildLine(requestText.email.en, normalizedCustomer.email)}

${requestText.address.en}
${buildLine(requestText.street.en, normalizedCustomer.street)}
${buildLine(requestText.houseNumber.en, normalizedCustomer.houseNumber)}
${buildLine(requestText.postalCode.en, normalizedCustomer.postalCode)}
${buildLine(requestText.city.en, normalizedCustomer.city)}`;
  };

  const buildRequestLines = () => {
    return items
      .map((item, index) => {
        const itemLang = normalizeItemLanguage(
          item.requestLanguage,
          lang,
          lang
        );
        const renderableEntries = getRenderableEntries(item, itemLang);
        const detailLines: string[] = [];

        const quantity = getSafeQuantity(item.quantity);
        const hasQuantityField = renderableEntries.some((entry) =>
          isQuantityLikeEntry(entry)
        );

        if (!hasQuantityField) {
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

        return `${index + 1}) ${isolateText(getServiceTitle(item, itemLang))}
${details}`;
      })
      .join("\n\n");
  };

  const buildMessage = () => {
    const customerBlock = buildCustomerBlock();
    const requestLines = buildRequestLines();
    const greetingLine = buildGreetingLine(safeCustomerData, lang);
    const closingLine = requestText.closing[lang];

    return lang === "ar"
      ? `${greetingLine}

${requestText.requestHeader.ar}

${customerBlock}

${requestText.requests.ar}
${requestLines}

${requestText.generalNotes.ar}
${isolateText(normalizeSpaces(generalNotes) || "-")}

${closingLine}`
      : lang === "de"
        ? `${greetingLine}

${requestText.requestHeader.de}

${customerBlock}

${requestText.requests.de}
${requestLines}

${requestText.generalNotes.de}
${isolateText(normalizeSpaces(generalNotes) || "-")}

${closingLine}`
        : `${greetingLine}

${requestText.requestHeader.en}

${customerBlock}

${requestText.requests.en}
${requestLines}

${requestText.generalNotes.en}
${isolateText(normalizeSpaces(generalNotes) || "-")}

${closingLine}`;
  };

  const buildSubmissionPayload = () => {
    const normalizedCustomer = normalizeCustomerData(safeCustomerData);
    const message = buildMessage();

    return {
      fullName: normalizedCustomer.fullName,
      email: normalizedCustomer.email,
      phone: normalizedCustomer.phone,
      whatsapp: "",
      companyName: "",
      street: normalizedCustomer.street,
      houseNumber: normalizedCustomer.houseNumber,
      postalCode: normalizedCustomer.postalCode,
      city: normalizedCustomer.city,
      address: normalizeSpaces(
        `${normalizedCustomer.street} ${normalizedCustomer.houseNumber}, ${normalizedCustomer.postalCode} ${normalizedCustomer.city}`
      ),
      language: lang,
      sourcePath:
        typeof window !== "undefined" ? window.location.pathname : "/cart",
      subject: `${requestText.requestHeader[lang]} - ${normalizedCustomer.fullName}`,
      message,
      serviceId: items.length === 1 ? items[0]?.serviceId || "" : "multi-request",
      serviceName:
        items.length === 1
          ? getServiceTitle(
              items[0],
              normalizeItemLanguage(items[0]?.requestLanguage, lang, lang)
            )
          : `Cart Request (${items.length})`,
      items: items.map((item, index) => {
        const itemLang = normalizeItemLanguage(item.requestLanguage, lang, lang);

        return {
          id: item.id,
          index: index + 1,
          quantity: getSafeQuantity(item.quantity),
          serviceId: item.serviceId,
          serviceTitle: getServiceTitle(item, itemLang),
          requestLanguage: itemLang,
          fields: getRenderableEntries(item, itemLang),
          publicData: getCartPublicData(item),
          rawFields: item.fields || [],
        };
      }),
      formData: {
        customerData: {
          ...normalizedCustomer,
        },
        generalNotes: normalizeSpaces(generalNotes),
        itemsCount: items.length,
      },
    };
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
    setCustomerData(emptyCustomerData);
    setGeneralNotes("");
  };

  const handleCustomerChange = (key: keyof CustomerData, value: string) => {
    const normalizedValue = normalizeSpaces(value);

    setCustomerData((prev) => {
      const normalizedPrev = normalizeCustomerData(prev);

      const nextData: CustomerData = {
        ...normalizedPrev,
        [key]: normalizedValue,
      };

      if (key === "salutation") {
        nextData.salutation = value === "mr" || value === "ms" ? value : "";
      }

      return normalizeCustomerData(nextData);
    });

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleGeneralNotesChange = (value: string) => {
    setGeneralNotes(safeString(value));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const validateBeforeSend = (mode: SendMode) => {
    if (items.length === 0) {
      setErrorMessage(cartText.empty[lang]);
      setSuccessMessage("");
      return false;
    }

    const validationError = validateCustomerData(safeCustomerData, lang, mode);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage("");
      return false;
    }

    return true;
  };

  const handleWhatsAppClick = () => {
    if (!validateBeforeSend("whatsapp")) return;
    setShowSendModal(true);
  };

  const handleInternalSend = async () => {
    if (!validateBeforeSend("internal")) return;

    try {
      setIsSendingInternal(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = buildSubmissionPayload();

      const response = await fetch("/api/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let responseData: { success?: boolean; error?: string } | null = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok || responseData?.success === false) {
        throw new Error(getReadableApiError(responseData?.error, lang));
      }

      clearCart();
      refreshCart();
      setCustomerData(emptyCustomerData);
      setGeneralNotes("");
      setShowSendModal(false);
      setErrorMessage("");
      setSuccessMessage(cartText.internalSuccess[lang]);
    } catch (error) {
      setErrorMessage(
        getReadableApiError(
          error instanceof Error ? error.message : "",
          lang
        )
      );
      setSuccessMessage("");
    } finally {
      setIsSendingInternal(false);
    }
  };

  const handleConfirmedSend = async () => {
    if (!validateBeforeSend("whatsapp")) {
      setShowSendModal(false);
      return;
    }

    try {
      setIsSendingWhatsapp(true);
      setErrorMessage("");
      setSuccessMessage("");
      setShowSendModal(false);

      const phoneNumber = "4917621105086";
      const message = buildMessage();
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      const opened = openWhatsAppUrl(whatsappUrl);

      if (!opened) {
        throw new Error(
          lang === "ar"
            ? "تعذر فتح واتساب. تحقق من المتصفح أو حاول مرة أخرى."
            : lang === "de"
              ? "WhatsApp konnte nicht geöffnet werden. Prüfe den Browser oder versuche es erneut."
              : "Failed to open WhatsApp. Check the browser or try again."
        );
      }

      setSuccessMessage(cartText.sentSuccess[lang]);
      setErrorMessage("");
    } catch {
      setErrorMessage(cartText.sendFailed[lang]);
      setSuccessMessage("");
    } finally {
      setIsSendingWhatsapp(false);
    }
  };

  const isBusy = isSendingWhatsapp || isSendingInternal;
  const showLargeSuccessBox = Boolean(successMessage && !errorMessage);

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

    select: {
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
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
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

    hintText: {
      marginTop: "8px",
      fontSize: "12px",
      color: "#7b6654",
      lineHeight: 1.6,
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

    actionRow: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "10px",
    },

    inlineMessageBox: {
      padding: "12px 14px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: 1.7,
      fontWeight: 700,
    },

    successBox: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "22px",
      padding: "18px 18px 16px",
      border: "1px solid #b7ddbf",
      background: "linear-gradient(135deg, #f5fcf6 0%, #ebf8ee 100%)",
      boxShadow: "0 10px 24px rgba(39, 97, 53, 0.08)",
    },

    successGlow: {
      position: "absolute",
      top: "-40px",
      insetInlineEnd: "-30px",
      width: "120px",
      height: "120px",
      borderRadius: "999px",
      background: "rgba(114, 184, 126, 0.14)",
      pointerEvents: "none",
    },

    successHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "12px",
    },

    successIconWrap: {
      width: "48px",
      height: "48px",
      minWidth: "48px",
      borderRadius: "999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#2f7a3d",
      color: "#ffffff",
      fontSize: "24px",
      fontWeight: 800,
      boxShadow: "0 8px 18px rgba(47, 122, 61, 0.18)",
    },

    successTitleWrap: {
      minWidth: 0,
      flex: 1,
    },

    successTitle: {
      margin: 0,
      fontSize: "18px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#1f4e28",
    },

    successBody: {
      fontSize: "13px",
      lineHeight: 1.8,
      color: "#2f5f39",
      margin: 0,
    },

    successMetaBox: {
      marginTop: "12px",
      borderRadius: "16px",
      padding: "12px 14px",
      border: "1px solid #cbe8d1",
      background: "rgba(255,255,255,0.72)",
    },

    successMetaText: {
      margin: 0,
      color: "#315b3a",
      fontSize: "12px",
      lineHeight: 1.75,
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
      gap: "10px",
      justifyContent: isArabic ? "flex-start" : "flex-end",
      flexWrap: "wrap",
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

    modalCancelButton: {
      minWidth: "130px",
      minHeight: "46px",
      padding: "10px 18px",
      background: "#f2e7da",
      color: "#2f2419",
      border: "1px solid #e0cfbd",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
    },
  };

  return (
    <div dir={dir || "ltr"} style={styles.page}>
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
                const itemLang = normalizeItemLanguage(
                  item.requestLanguage,
                  lang,
                  lang
                );
                const itemIsArabic = itemLang === "ar";
                const previewEntries = getRenderableEntries(item, itemLang).slice(
                  0,
                  12
                );
                const quantity = getSafeQuantity(item.quantity);
                const hasQuantityField = previewEntries.some((entry) =>
                  isQuantityLikeEntry(entry)
                );

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

                    <div style={styles.previewList}>
                      {!hasQuantityField && (
                        <div
                          style={{
                            ...styles.previewRow,
                            textAlign: itemIsArabic ? "right" : "left",
                          }}
                        >
                          <span style={{ fontWeight: 700 }}>
                            {requestText.quantity[itemLang]}:
                          </span>{" "}
                          {quantity}
                        </div>
                      )}

                      {previewEntries.map((entry, entryIndex) => (
                        <div
                          key={`${entry.fieldId}-${entryIndex}`}
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
                  </div>
                );
              })}
            </div>

            <div style={styles.actionsWrap}>
              {errorMessage && (
                <div
                  style={{
                    ...styles.inlineMessageBox,
                    border: "1px solid #efc4bf",
                    background: "#fff2f1",
                    color: "#8b2f25",
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {showLargeSuccessBox && (
                <div
                  style={{
                    ...styles.successBox,
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  <div style={styles.successGlow} />

                  <div
                    style={{
                      ...styles.successHeader,
                      flexDirection: isArabic ? "row-reverse" : "row",
                    }}
                  >
                    <div style={styles.successIconWrap}>✓</div>

                    <div style={styles.successTitleWrap}>
                      <h3 style={styles.successTitle}>
                        {cartText.successBoxTitle[lang]}
                      </h3>
                    </div>
                  </div>

                  <p style={styles.successBody}>
                    {cartText.successBoxDescription[lang]}
                  </p>

                  <div style={styles.successMetaBox}>
                    <p style={styles.successMetaText}>{successMessage}</p>
                    <p
                      style={{
                        ...styles.successMetaText,
                        marginTop: "6px",
                      }}
                    >
                      {cartText.successBoxNextStep[lang]}
                    </p>
                  </div>
                </div>
              )}

              <div style={styles.actionRow}>
                <button
                  type="button"
                  onClick={handleInternalSend}
                  disabled={isBusy || items.length === 0}
                  style={{
                    ...styles.primaryButton,
                    opacity: isBusy || items.length === 0 ? 0.6 : 1,
                    cursor:
                      isBusy || items.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {isSendingInternal
                    ? cartText.sendingInternal[lang]
                    : cartText.sendInternal[lang]}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  disabled={isBusy || items.length === 0}
                  style={{
                    ...styles.secondaryButton,
                    opacity: isBusy || items.length === 0 ? 0.6 : 1,
                    cursor:
                      isBusy || items.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {isSendingWhatsapp
                    ? cartText.sendingWhatsapp[lang]
                    : cartText.sendWhatsapp[lang]}
                </button>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={items.length === 0 || isBusy}
                style={{
                  ...styles.secondaryButton,
                  opacity: items.length === 0 || isBusy ? 0.6 : 1,
                  cursor:
                    items.length === 0 || isBusy ? "not-allowed" : "pointer",
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
              <select
                name="salutation"
                autoComplete="honorific-prefix"
                value={safeCustomerData.salutation || ""}
                onChange={(e) =>
                  handleCustomerChange(
                    "salutation",
                    (e.target.value || "") as CustomerSalutation
                  )
                }
                style={{
                  ...styles.select,
                  gridColumn: "1 / -1",
                }}
              >
                <option value="">{cartText.salutationPlaceholder[lang]}</option>
                <option value="mr">{cartText.salutationMr[lang]}</option>
                <option value="ms">{cartText.salutationMs[lang]}</option>
              </select>

              <input
                type="text"
                name="given-name"
                autoComplete="given-name"
                placeholder={cartText.firstName[lang]}
                value={safeCustomerData.firstName || ""}
                onChange={(e) => handleCustomerChange("firstName", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="family-name"
                autoComplete="family-name"
                placeholder={cartText.lastName[lang]}
                value={safeCustomerData.lastName || ""}
                onChange={(e) => handleCustomerChange("lastName", e.target.value)}
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={safeCustomerData.email || ""}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                style={styles.input}
              />

              <input
                type="tel"
                name="tel"
                autoComplete="tel"
                placeholder={`${cartText.phone[lang]} — ${cartText.optional[lang]}`}
                value={safeCustomerData.phone || ""}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="address-line1"
                autoComplete="address-line1"
                placeholder={cartText.street[lang]}
                value={safeCustomerData.street || ""}
                onChange={(e) => handleCustomerChange("street", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                name="address-line2"
                autoComplete="address-line2"
                placeholder={cartText.houseNumber[lang]}
                value={safeCustomerData.houseNumber || ""}
                onChange={(e) =>
                  handleCustomerChange("houseNumber", e.target.value)
                }
                style={styles.input}
              />

              <input
                type="text"
                name="postal-code"
                autoComplete="postal-code"
                placeholder={cartText.postalCode[lang]}
                value={safeCustomerData.postalCode || ""}
                onChange={(e) =>
                  handleCustomerChange("postalCode", e.target.value)
                }
                style={styles.input}
              />

              <input
                type="text"
                name="address-level2"
                autoComplete="address-level2"
                placeholder={cartText.city[lang]}
                value={safeCustomerData.city || ""}
                onChange={(e) => handleCustomerChange("city", e.target.value)}
                style={styles.input}
              />

              <textarea
                name="generalNotes"
                autoComplete="off"
                placeholder={`${cartText.generalNotes[lang]} — ${cartText.optional[lang]}`}
                value={generalNotes || ""}
                onChange={(e) => handleGeneralNotesChange(e.target.value)}
                style={{
                  ...styles.textarea,
                  gridColumn: "1 / -1",
                }}
              />
            </div>

            <div
              style={{
                ...styles.hintText,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.phoneOptionalHint[lang]}
            </div>
          </section>
        </div>
      </div>

      {showSendModal && (
        <div style={styles.modalOverlay}>
          <div dir={dir || "ltr"} style={styles.modalBox}>
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
                onClick={() => setShowSendModal(false)}
                style={styles.modalCancelButton}
              >
                {cartText.clear[lang]}
              </button>

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