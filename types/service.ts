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
  [key: string]: string[] | undefined;
};

export type ServiceIntent =
  | "open-request"
  | "design"
  | "printing"
  | "fabrication"
  | "installation"
  | "measurement"
  | "branding"
  | "packaging"
  | "textile"
  | "signage"
  | "vehicle"
  | "display"
  | "marketing"
  | "maintenance"
  | string;

export type ServiceUseCase =
  | "indoor"
  | "outdoor"
  | "shop"
  | "restaurant"
  | "office"
  | "event"
  | "vehicle"
  | "packaging"
  | "branding"
  | "promotion"
  | string;

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

export type ServiceFieldSemanticGroup =
  | "contact"
  | "project"
  | "dimensions"
  | "materials"
  | "production"
  | "design"
  | "installation"
  | "delivery"
  | "attachments"
  | "notes"
  | "seo"
  | "intent"
  | "location"
  | "usage"
  | string;

export type ServiceFieldIntentRole =
  | "core-intent"
  | "secondary-intent"
  | "size-signal"
  | "quantity-signal"
  | "material-signal"
  | "design-signal"
  | "installation-signal"
  | "context-signal"
  | string;

export type ServiceFieldOption = {
  value: string;
  label: LocalizedText;
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  intentTags?: string[];
  [key: string]: unknown;
};

export type ServiceFieldValidation = {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  [key: string]: unknown;
};

export type ServiceField = {
  id: string;
  type: ServiceFieldType;
  label: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  options?: ServiceFieldOption[];
  semanticGroup?: ServiceFieldSemanticGroup;
  intentRole?: ServiceFieldIntentRole;
  allowsUnknown?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  aiImportance?: number;
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  helpText?: LocalizedText;
  validation?: ServiceFieldValidation;
  examplePhrases?: LocalizedText[];
  [key: string]: unknown;
};

export type ServiceSection = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  fields: ServiceField[];
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
  keywords?: SearchAliasSet;
  internalLinkTerms?: SearchAliasSet;
  canonicalPath?: string;
  indexable?: boolean;
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
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  [key: string]: unknown;
};

export type ServiceSearchProfile = {
  aliases?: SearchAliasSet;
  seoKeywords?: SearchAliasSet;
  voicePhrases?: SearchAliasSet;
  commonMisspellings?: SearchAliasSet;
  naturalQueries?: LocalizedText[];
  intentTags?: string[];
  relatedServiceIds?: string[];
  searchableTextBoost?: number;
  [key: string]: unknown;
};

export type ServiceExecutionProfile = {
  requiresDimensions?: boolean;
  requiresQuantity?: boolean;
  requiresMaterial?: boolean;
  requiresDesignDecision?: boolean;
  mayRequireInstallation?: boolean;
  mayRequireSiteVisit?: boolean;
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
  intent?: ServiceIntent;
  useCases?: ServiceUseCase[];
  searchProfile?: ServiceSearchProfile;
  executionProfile?: ServiceExecutionProfile;
  isFeatured?: boolean;
  sortOrder?: number;
  [key: string]: unknown;
};