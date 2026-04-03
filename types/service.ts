export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

export type ServiceFieldOption = {
  value: string;
  label: LocalizedText;
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
};

export type ServiceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: string[];
};

export type Service = {
  id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  intro?: LocalizedText;
  requestGuidance?: LocalizedText[];
  sections?: ServiceSection[];
  fields: ServiceField[];
};