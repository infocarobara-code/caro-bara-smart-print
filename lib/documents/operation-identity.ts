export type OperationLanguage = "ar" | "de" | "en";

export type OperationKind = "request" | "appointment";

export type OperationAddress = {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
};

export type OperationCustomer = {
  customerId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: OperationAddress;
};

export type OperationAppointmentWindow = {
  date?: string;
  startTime?: string;
  endTime?: string;
  timeLabel?: string;
};

export type OperationIdentityInput = {
  kind: OperationKind;
  language?: OperationLanguage;

  requestId?: string;
  appointmentId?: string;
  referenceNumber?: string;
  customerId?: string;

  status?: string;
  serviceType?: string;
  subject?: string;
  message?: string;

  appointmentType?: string;
  appointmentMode?: string;
  officeId?: string;
  officeLabel?: string;

  createdAt?: string;
  updatedAt?: string;

  customer?: OperationCustomer;
  appointmentWindow?: OperationAppointmentWindow;

  extra?: Record<string, string | number | boolean | null | undefined>;
};

export type NormalizedOperationIdentity = {
  schemaVersion: "1.0";
  entity: "caro-bara-operation";
  kind: OperationKind;
  language: OperationLanguage;

  ids: {
    referenceNumber: string;
    requestId?: string;
    appointmentId?: string;
    customerId?: string;
  };

  customer: {
    fullName?: string;
    email?: string;
    phone?: string;
    addressLine?: string;
    addressParts: {
      street?: string;
      houseNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
    };
  };

  operation: {
    status?: string;
    serviceType?: string;
    subject?: string;
    message?: string;
    appointmentType?: string;
    appointmentMode?: string;
    officeId?: string;
    officeLabel?: string;
  };

  schedule: {
    date?: string;
    startTime?: string;
    endTime?: string;
    timeLabel?: string;
  };

  meta: {
    createdAt?: string;
    updatedAt?: string;
    generatedAt: string;
  };

  extra: Record<string, string | number | boolean | null>;
};

export function buildOperationIdentity(
  input: OperationIdentityInput
): NormalizedOperationIdentity {
  const language = normalizeLanguage(input.language);
  const customerAddress = input.customer?.address;

  const referenceNumber =
    safeTrim(input.referenceNumber) ||
    safeTrim(input.requestId) ||
    safeTrim(input.appointmentId) ||
    createFallbackReference(input.kind);

  const extra: Record<string, string | number | boolean | null> = {};

  if (input.extra) {
    for (const [key, value] of Object.entries(input.extra)) {
      const safeKey = key.trim();
      if (!safeKey) continue;

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        extra[safeKey] =
          typeof value === "string"
            ? normalizeExtraStringForLanguage(safeKey, value, language)
            : value;
      }
    }
  }

  return {
    schemaVersion: "1.0",
    entity: "caro-bara-operation",
    kind: input.kind,
    language,

    ids: {
      referenceNumber,
      requestId: optionalTrim(input.requestId),
      appointmentId: optionalTrim(input.appointmentId),
      customerId:
        optionalTrim(input.customerId) || optionalTrim(input.customer?.customerId),
    },

    customer: {
      fullName: optionalTrim(input.customer?.fullName),
      email: optionalTrim(input.customer?.email),
      phone: optionalTrim(input.customer?.phone),
      addressLine: buildAddressLine(customerAddress),
      addressParts: {
        street: optionalTrim(customerAddress?.street),
        houseNumber: optionalTrim(customerAddress?.houseNumber),
        postalCode: optionalTrim(customerAddress?.postalCode),
        city: optionalTrim(customerAddress?.city),
        country: optionalTrim(customerAddress?.country),
      },
    },

    operation: {
      status: normalizeStatus(optionalTrim(input.status), language),
      serviceType: normalizeServiceType(optionalTrim(input.serviceType), language),
      subject: normalizeSubject(optionalTrim(input.subject), language),
      message: normalizeMessage(optionalTrim(input.message), language),
      appointmentType: normalizeAppointmentType(
        optionalTrim(input.appointmentType),
        language
      ),
      appointmentMode: normalizeAppointmentMode(
        optionalTrim(input.appointmentMode),
        language
      ),
      officeId: optionalTrim(input.officeId),
      officeLabel: normalizeOfficeLabel(optionalTrim(input.officeLabel), language),
    },

    schedule: {
      date: optionalTrim(input.appointmentWindow?.date),
      startTime: optionalTrim(input.appointmentWindow?.startTime),
      endTime: optionalTrim(input.appointmentWindow?.endTime),
      timeLabel: normalizeTimeLabel(
        optionalTrim(input.appointmentWindow?.timeLabel),
        language
      ),
    },

    meta: {
      createdAt: optionalTrim(input.createdAt),
      updatedAt: optionalTrim(input.updatedAt),
      generatedAt: new Date().toISOString(),
    },

    extra,
  };
}

export function serializeOperationIdentityForQr(
  identity: NormalizedOperationIdentity
): string {
  return JSON.stringify(identity);
}

export function buildOperationHumanReference(
  identity: NormalizedOperationIdentity
): string {
  const prefix = identity.kind === "request" ? "REQ" : "APT";
  const base =
    identity.ids.referenceNumber ||
    identity.ids.requestId ||
    identity.ids.appointmentId ||
    "UNSET";

  return `${prefix}-${sanitizeReferenceChunk(base)}`;
}

export function getOperationDisplayTitle(
  identity: NormalizedOperationIdentity
): string {
  if (identity.language === "de") {
    return identity.kind === "appointment" ? "Termin" : "Anfrage";
  }

  if (identity.kind === "appointment") {
    return "Appointment";
  }

  return "Request";
}

function normalizeLanguage(value?: string): OperationLanguage {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }

  return "en";
}

function buildAddressLine(address?: OperationAddress): string | undefined {
  if (!address) return undefined;

  const parts = [
    optionalTrim(address.street),
    optionalTrim(address.houseNumber),
    optionalTrim(address.postalCode),
    optionalTrim(address.city),
    optionalTrim(address.country),
  ].filter(Boolean);

  if (!parts.length) {
    return undefined;
  }

  return parts.join(", ");
}

function optionalTrim(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function safeTrim(value?: string | null): string {
  return optionalTrim(value) || "";
}

function createFallbackReference(kind: OperationKind): string {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
  ].join("");

  return `${kind}-${stamp}`;
}

function sanitizeReferenceChunk(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, "-");
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function normalizeStatus(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  const normalized = toLookupKey(value);

  const map: Record<string, string> = {
    new: "Neu",
    open: "Offen",
    pending: "Ausstehend",
    confirmed: "Bestätigt",
    inprogress: "In Bearbeitung",
    processing: "In Bearbeitung",
    done: "Abgeschlossen",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
    canceled: "Storniert",
    rejected: "Abgelehnt",
  };

  return map[normalized] || value;
}

function normalizeAppointmentType(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  const normalized = toLookupKey(value);

  const map: Record<string, string> = {
    visit: "Besuch",
    onsite: "Vor-Ort-Termin",
    instore: "Vor-Ort im Geschäft",
    office: "Bürotermin",
    consultation: "Beratung",
    phone: "Telefontermin",
    call: "Anruf",
    meeting: "Besprechung",
  };

  return map[normalized] || value;
}

function normalizeAppointmentMode(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  const normalized = toLookupKey(value);

  const map: Record<string, string> = {
    onsite: "Vor Ort",
    atcustomer: "Beim Kunden",
    instore: "Im Geschäft",
    office: "Im Büro",
    phone: "Telefonisch",
    videocall: "Videoanruf",
    online: "Online",
  };

  return map[normalized] || value;
}

function normalizeOfficeLabel(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  const normalized = toLookupKey(value);

  const map: Record<string, string> = {
    berlin: "Berlin",
    mainoffice: "Hauptstandort",
    headoffice: "Hauptstandort",
    showroom: "Showroom",
    workshop: "Werkstatt",
  };

  return map[normalized] || value;
}

function normalizeTimeLabel(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  return value
    .replace(/\bfrom\b/gi, "von")
    .replace(/\bto\b/gi, "bis")
    .replace(/\bam\b/gi, "vorm.")
    .replace(/\bpm\b/gi, "nachm.");
}

function normalizeServiceType(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  return replaceCommonEnglishTermsWithGerman(value);
}

function normalizeSubject(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  return replaceCommonEnglishTermsWithGerman(value);
}

function normalizeMessage(
  value: string | undefined,
  language: OperationLanguage
): string | undefined {
  if (!value) return undefined;
  if (language !== "de") return value;

  return replaceCommonEnglishTermsWithGerman(value);
}

function normalizeExtraStringForLanguage(
  key: string,
  value: string,
  language: OperationLanguage
): string {
  if (language !== "de") {
    return value;
  }

  const germanizedKey = toLookupKey(key);

  if (
    germanizedKey.includes("time") ||
    germanizedKey.includes("mode") ||
    germanizedKey.includes("type") ||
    germanizedKey.includes("status") ||
    germanizedKey.includes("service") ||
    germanizedKey.includes("office") ||
    germanizedKey.includes("subject") ||
    germanizedKey.includes("message")
  ) {
    return replaceCommonEnglishTermsWithGerman(value);
  }

  return value;
}

function replaceCommonEnglishTermsWithGerman(value: string): string {
  return value
    .replace(/\brequest\b/gi, "Anfrage")
    .replace(/\bappointment\b/gi, "Termin")
    .replace(/\bservice\b/gi, "Service")
    .replace(/\bmeeting\b/gi, "Besprechung")
    .replace(/\bphone call\b/gi, "Telefonanruf")
    .replace(/\bphone\b/gi, "Telefon")
    .replace(/\bonline\b/gi, "Online")
    .replace(/\boffice\b/gi, "Büro")
    .replace(/\bstatus\b/gi, "Status")
    .replace(/\bconfirmed\b/gi, "Bestätigt")
    .replace(/\bpending\b/gi, "Ausstehend")
    .replace(/\bnew\b/gi, "Neu")
    .replace(/\bin progress\b/gi, "In Bearbeitung")
    .replace(/\bdone\b/gi, "Abgeschlossen")
    .replace(/\bcompleted\b/gi, "Abgeschlossen")
    .replace(/\bcancelled\b/gi, "Storniert")
    .replace(/\bcanceled\b/gi, "Storniert")
    .replace(/\brejected\b/gi, "Abgelehnt")
    .replace(/\bfrom\b/gi, "von")
    .replace(/\bto\b/gi, "bis");
}

function toLookupKey(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/g, "").toLowerCase();
}