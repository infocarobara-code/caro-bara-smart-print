export type RequestStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "quoted"
  | "in_progress"
  | "completed"
  | "archived";

export type RequestChannel =
  | "internal_web"
  | "whatsapp"
  | "email"
  | "manual";

export type RequestLanguage = "ar" | "de" | "en";

export type CustomerContact = {
  fullName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
};

export type RequestServiceInfo = {
  categoryId?: string;
  serviceId?: string;
  serviceName?: string;
};

export type RequestMeta = {
  language?: RequestLanguage;
  sourcePath?: string;
  userAgent?: string;
  ipAddress?: string;
  submittedAt: string;
};

export type RequestRecord = {
  id: string;
  status: RequestStatus;
  channel: RequestChannel;

  customer: CustomerContact;
  service: RequestServiceInfo;

  subject: string;
  message: string;

  items?: unknown[];
  formData?: Record<string, unknown>;
  notes?: string;

  meta: RequestMeta;

  createdAt: string;
  updatedAt: string;
};

export type CreateRequestInput = {
  channel?: RequestChannel;

  customer: CustomerContact;
  service?: RequestServiceInfo;

  subject: string;
  message: string;

  items?: unknown[];
  formData?: Record<string, unknown>;
  notes?: string;

  meta: RequestMeta;
};

export type UpdateRequestStatusInput = {
  id: string;
  status: RequestStatus;
  notes?: string;
};