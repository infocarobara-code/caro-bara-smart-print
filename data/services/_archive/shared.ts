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
  required: false,
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
  required: false,
  semanticGroup: "attachments",
};