export type LanguageCode = "ar" | "de" | "en";

export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
  [key: string]: string;
};

export type SearchAliasSet = {
  ar?: string[];
  de?: string[];
  en?: string[];
  universal?: string[];
};

export type ServiceFieldOption = {
  value: string;
  label: LocalizedText;

  // 🔥 إضافات تدعم البحث الذكي
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  intentTags?: string[];

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

  // 🔥 دعم الذكاء والتحليل
  helpText?: LocalizedText;
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  examplePhrases?: LocalizedText[];
  semanticGroup?: string;
  intentRole?: string;
  allowsUnknown?: boolean;

  [key: string]: unknown;
};

export type ServiceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: ServiceField[];

  // 🔥 دعم البحث
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;

  [key: string]: unknown;
};

export type ServiceSEO = {
  slug?: string;
  categorySlug?: string;
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;

  // 🔥 دعم SEO الداخلي
  keywords?: SearchAliasSet;
  internalLinkTerms?: SearchAliasSet;

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

  // 🔥 دعم البحث
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;

  [key: string]: unknown;
};

export type ServiceSearchProfile = {
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  naturalQueries?: LocalizedText[];
  searchableTextBoost?: number;
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

  // 🔥 دعم محرك البحث الذكي
  searchProfile?: ServiceSearchProfile;
  intent?: string;
  useCases?: string[];

  aiSummaryHint?: string;

  [key: string]: unknown;
};