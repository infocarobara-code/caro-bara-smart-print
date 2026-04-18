import type {
  AdminEntry,
  AdminEntrySource,
  AdminEntryStatus,
  AdminOfficeId,
  AppointmentMode,
  AppointmentStatus,
  AppointmentType,
  BookingSlotStatus,
  CustomerDataRow,
  CustomerRow,
  RequestCustomer,
  RequestLanguage,
  RequestStatus,
} from "./admin-types";

export function normalizeLanguage(value?: string): RequestLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }
  return "ar";
}

export function normalizeRequestStatus(value?: string): RequestStatus {
  if (value === "new" || value === "in_progress" || value === "done") {
    return value;
  }
  return "new";
}

export function normalizeAppointmentStatus(value?: string): AppointmentStatus {
  if (
    value === "new" ||
    value === "confirmed" ||
    value === "in_progress" ||
    value === "done" ||
    value === "cancelled" ||
    value === "rejected"
  ) {
    return value;
  }
  return "new";
}

export function normalizeBookingSlotStatus(value?: string): BookingSlotStatus {
  if (value === "available" || value === "booked" || value === "blocked") {
    return value;
  }
  return "available";
}

export function normalizeAdminEntryStatus(
  value: string | undefined,
  source: AdminEntrySource
): AdminEntryStatus {
  return source === "appointment"
    ? normalizeAppointmentStatus(value)
    : normalizeRequestStatus(value);
}

export function normalizeAppointmentType(
  value?: string
): AppointmentType | undefined {
  if (
    value === "consultation" ||
    value === "design" ||
    value === "visit" ||
    value === "installation"
  ) {
    return value;
  }
  return undefined;
}

export function normalizeAppointmentMode(
  value?: string
): AppointmentMode | undefined {
  if (
    value === "at_store" ||
    value === "we_come_free" ||
    value === "phone_call"
  ) {
    return value;
  }
  return undefined;
}

export function normalizeOffice(value?: string): AdminOfficeId {
  const offices: AdminOfficeId[] = [
    "requests_new",
    "requests_in_progress",
    "requests_done",
    "appointments_new",
    "appointments_in_progress",
    "appointments_done",
    "appointments_cancelled",
    "appointments_rejected",
    "schedule_settings",
    "request_actions",
    "customer_data",
  ];

  if (value && offices.includes(value as AdminOfficeId)) {
    return value as AdminOfficeId;
  }

  return "requests_new";
}

export function getSafeTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeTimeInput(value: string) {
  const normalized = getSafeTrimmedString(value);

  if (!normalized) {
    return "";
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  return normalized;
}

export function formatTimeOnly(value: string | undefined) {
  if (!value) {
    return "—";
  }

  const normalized = value.trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized.slice(0, 5);
  }

  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  return normalized;
}

export function splitFullName(fullName?: string) {
  const safeName = getSafeTrimmedString(fullName);

  if (!safeName) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const parts = safeName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

export function buildAddress(customer: RequestCustomer) {
  const parts = [
    getSafeTrimmedString(customer.street),
    getSafeTrimmedString(customer.houseNumber),
    getSafeTrimmedString(customer.postalCode),
    getSafeTrimmedString(customer.city),
  ].filter(Boolean);

  return parts.join(", ");
}

export function buildCustomerRowAddress(customer: CustomerRow) {
  const parts = [
    getSafeTrimmedString(customer.street),
    getSafeTrimmedString(customer.house_number),
    getSafeTrimmedString(customer.postal_code),
    getSafeTrimmedString(customer.city),
  ].filter(Boolean);

  return parts.join(", ");
}

export function buildCustomerUniqueKey(entry: AdminEntry) {
  const customer = entry.customer || {};
  const email = getSafeTrimmedString(customer.email).toLowerCase();
  const phone = getSafeTrimmedString(customer.phone).toLowerCase();
  const fullName = getSafeTrimmedString(customer.fullName).toLowerCase();
  const city = getSafeTrimmedString(customer.city).toLowerCase();

  if (email && phone) return `email:${email}|phone:${phone}`;
  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  return `name:${fullName}|city:${city}`;
}

export function matchesSearchValue(value: string, searchTerm: string) {
  if (!searchTerm) return true;
  return value.toLowerCase().includes(searchTerm.toLowerCase());
}

export function entryMatchesSearch(entry: AdminEntry, searchTerm: string) {
  if (!searchTerm) return true;

  const customer = entry.customer || {};

  const haystack = [
    entry.id,
    entry.source,
    entry.status,
    entry.channel,
    entry.created_at,
    customer.requestId,
    customer.fullName,
    customer.email,
    customer.phone,
    customer.street,
    customer.houseNumber,
    customer.postalCode,
    customer.city,
    customer.subject,
    customer.message,
    entry.appointment?.date,
    entry.appointment?.time,
    entry.appointment?.type,
    entry.appointment?.mode,
  ]
    .map((item) => getSafeTrimmedString(item))
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}

export function customerRowMatchesSearch(
  row: CustomerDataRow,
  searchTerm: string
) {
  if (!searchTerm) return true;

  const haystack = [
    row.customerNumber,
    row.firstName,
    row.lastName,
    row.email,
    row.phone,
    row.address,
  ]
    .map((item) => getSafeTrimmedString(item))
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}