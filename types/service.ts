export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
  [key: string]: string;
};

export type ServiceFieldOption = {
  value: string;
  label: LocalizedText;
  [key: string]: unknown;
};

export type ServiceFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "date";

export type ServiceField = {
  id: string;
  type: ServiceFieldType;
  label: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  options?: ServiceFieldOption[];
  semanticGroup?: string;
  allowsUnknown?: boolean;
  [key: string]: unknown;
};

export type ServiceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: ServiceField[];
  [key: string]: unknown;
};

export type ServiceSEO = {
  slug?: string;
  categorySlug?: string;
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  [key: string]: unknown;
};

export type ServiceAttachmentKind =
  | "design-files"
  | "reference-images"
  | "site-photos"
  | "documents"
  | "measurements"
  | string;

export type ServiceAttachment = {
  id: string;
  kind: ServiceAttachmentKind;
  title: LocalizedText;
  description?: LocalizedText;
  required?: boolean;
  multiple?: boolean;
  [key: string]: unknown;
};

export type Service = {
  id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  intro?: LocalizedText;
  requestGuidance?: LocalizedText[];
  sections?: ServiceSection[];
  attachments?: ServiceAttachment[];
  seo?: ServiceSEO;
  fields?: ServiceField[];
  aiSummaryHint?: string;
  [key: string]: unknown;
};