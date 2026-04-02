export type Lang = "ar" | "de" | "en";
export type Language = Lang;

export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

export type FieldOption = {
  value: string;
  label: LocalizedText;
};

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "tel"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export type ServiceField = {
  id: string;
  type: FieldType;
  label: LocalizedText;
  placeholder?: Partial<LocalizedText>;
  required?: boolean;
  options?: FieldOption[];
};

export type Service = {
  id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  fields: ServiceField[];
};

export type FormValue = string | string[] | number | boolean | null | undefined;

export type FormDataMap = Record<string, FormValue>;