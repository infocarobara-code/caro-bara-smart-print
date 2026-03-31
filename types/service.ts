export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

export type ServiceFieldOption = {
  value: string;
  label: LocalizedText;
};

export type ServiceField = {
  id: string;
  type: string;
  label: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  options?: ServiceFieldOption[];
};

export type Service = {
  id: string;
  category?: string;
  title: LocalizedText;
  description: LocalizedText;
  fields: ServiceField[];
};