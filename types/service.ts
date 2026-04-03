export type Lang = "ar" | "de" | "en";
export type Language = Lang;

export type LocalizedText = {
  ar: string;
  de: string;
  en: string;
};

export type PartialLocalizedText = Partial<LocalizedText>;

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

export type AttachmentKind =
  | "site-photos"
  | "product-photos"
  | "reference-images"
  | "design-files"
  | "measurements"
  | "documents"
  | "other";

export type FieldSemanticGroup =
  | "contact"
  | "project"
  | "dimensions"
  | "materials"
  | "production"
  | "design"
  | "installation"
  | "delivery"
  | "attachments"
  | "notes";

export type ServiceField = {
  id: string;
  type: FieldType;
  label: LocalizedText;
  placeholder?: PartialLocalizedText;
  required?: boolean;
  options?: FieldOption[];

  /**
   * Helps future logic understand whether this field is
   * basic info, technical info, logistics, design, etc.
   */
  semanticGroup?: FieldSemanticGroup;

  /**
   * Marks fields where the customer may not know the answer yet.
   * Useful later for AI missing-data interpretation.
   */
  allowsUnknown?: boolean;

  /**
   * Helpful hint for future AI / request routing logic.
   */
  aiHint?: string;
};

export type ServiceSection = {
  id: string;
  title: LocalizedText;
  description?: PartialLocalizedText;
  fields: ServiceField[];
};

export type ServiceAttachmentRequirement = {
  id: string;
  kind: AttachmentKind;
  title: LocalizedText;
  description?: PartialLocalizedText;
  required?: boolean;
  multiple?: boolean;
};

export type ServiceSEO = {
  slug: string;
  categorySlug?: string;
  metaTitle?: PartialLocalizedText;
  metaDescription?: PartialLocalizedText;
};

export type Service = {
  id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;

  /**
   * Current structure still supported temporarily
   * so the existing project does not break while we migrate.
   */
  fields?: ServiceField[];

  /**
   * New structured form architecture.
   * This is the target direction.
   */
  sections?: ServiceSection[];

  /**
   * Short guiding text for the service page
   * before the user enters the dedicated form.
   */
  intro?: PartialLocalizedText;

  /**
   * Optional hints shown before the form to reduce ambiguity.
   */
  requestGuidance?: PartialLocalizedText[];

  /**
   * Attachment strategy for future upload UI and AI-readiness.
   */
  attachments?: ServiceAttachmentRequirement[];

  /**
   * Future-ready SEO structure for dedicated pages.
   */
  seo?: ServiceSEO;

  /**
   * Helpful for routing, summaries, and internal handling later.
   */
  aiSummaryHint?: string;
};

export type FormValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | File
  | File[];

export type FormDataMap = Record<string, FormValue>;