export type LocaleText = {
  ar: string;
  de: string;
  en: string;
};

export type FieldOption = {
  value: string;
  label: LocaleText;
};

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "file";

export type ServiceField = {
  id: string;
  type: FieldType;
  label: LocaleText;
  placeholder?: LocaleText;
  required?: boolean;
  options?: FieldOption[];
};

export type ServiceCategory =
  | "signage"
  | "printing"
  | "packaging-labeling"
  | "textile-promotional"
  | "branding-design"
  | "fabrication-decor"
  | "marketing";

export type Service = {
  id: string;
  category: ServiceCategory;
  title: LocaleText;
  description: LocaleText;
  fields: ServiceField[];
};