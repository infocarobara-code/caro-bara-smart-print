import type { ServiceField } from "@/types/service";

export const emailField: ServiceField = {
  id: "email",
  type: "email",
  label: {
    ar: "البريد الإلكتروني",
    de: "E-Mail-Adresse",
    en: "Email Address",
  },
  placeholder: {
    ar: "example@email.com",
    de: "beispiel@email.com",
    en: "example@email.com",
  },
  required: true,
  semanticGroup: "contact",
};

export const referenceFileField: ServiceField = {
  id: "referenceFile",
  type: "file",
  label: {
    ar: "ملف أو صورة مرجعية",
    de: "Referenzdatei oder Bild",
    en: "Reference File or Image",
  },
  description: {
    ar: "يمكنك رفع صورة أو ملف يساعدنا على فهم الطلب بشكل أدق",
    de: "Du kannst ein Bild oder eine Datei hochladen, die uns hilft, die Anfrage besser zu verstehen",
    en: "You can upload an image or file to help us better understand your request",
  },
  required: false,
  multiple: false,
  semanticGroup: "attachments",
};

export const sitePhotoField: ServiceField = {
  id: "sitePhoto",
  type: "file",
  label: {
    ar: "صورة للموقع أو الواجهة",
    de: "Foto vom Standort oder der Fassade",
    en: "Site or Facade Photo",
  },
  description: {
    ar: "صورة للموقع تساعدنا على فهم ظروف التنفيذ بشكل أفضل",
    de: "Ein Foto vom Standort hilft uns, die Ausführung besser einzuschätzen",
    en: "A site photo helps us better understand execution conditions",
  },
  required: false,
  multiple: false,
  semanticGroup: "attachments",
};