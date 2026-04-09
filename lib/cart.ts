export type RequestLanguage = "ar" | "de" | "en";

export type CartFieldItem = {
  id: string;
  label: string;
  value: string;
};

export type CartItem = {
  id: string;
  serviceId: string;
  data: Record<string, string>;
  fields: CartFieldItem[];
  serviceTitle?: string;
  requestLanguage?: RequestLanguage;
  quantity?: number;
};

const CART_KEY = "cart_v2";
const LEGACY_CART_KEYS = ["cart"];

type RawCartLikeRecord = Record<string, unknown>;

type CanonicalField = {
  id: string;
  label: string;
  value: string;
  normalizedId: string;
  normalizedLabel: string;
  normalizedValue: string;
  quantityLike: boolean;
};

function generateId() {
  return (
    "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9)
  );
}

function emitCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("cart-updated"));
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeTextValue(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) {
    const joined = value
      .map((entry) => String(entry ?? "").trim())
      .filter(Boolean)
      .join(", ")
      .trim();

    return joined || undefined;
  }

  const normalized = String(value).trim();
  return normalized || undefined;
}

function stripUnicodeMarks(value: string): string {
  return value
    .replace(/[\u2066-\u2069]/g, "")
    .replace(/[\u200E\u200F]/g, "")
    .replace(/[\u0610-\u061A]/g, "")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[\u0670]/g, "")
    .replace(/ـ/g, "");
}

function normalizeArabicLetters(value: string): string {
  return value
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه");
}

function normalizeLatinDiacritics(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeTextForCompare(value: unknown): string {
  const base = String(value ?? "").trim().toLowerCase();

  if (!base) return "";

  return normalizeArabicLetters(normalizeLatinDiacritics(stripUnicodeMarks(base)))
    .replace(/&/g, " and ")
    .replace(/[\/\\|]+/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/[()[\]{}<>]/g, " ")
    .replace(/[,:;،؛.!?؟"'`´“”‘’]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFieldIdForCompare(value: unknown): string {
  return normalizeTextForCompare(value).replace(/[\s_-]+/g, "");
}

function isTechnicalLabel(label: unknown, id: unknown): boolean {
  const normalizedLabel = normalizeFieldIdForCompare(label);
  const normalizedId = normalizeFieldIdForCompare(id);

  if (!normalizedLabel || !normalizedId) return false;
  return normalizedLabel === normalizedId;
}

function normalizeRequestLanguage(value: unknown): RequestLanguage | undefined {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }
  return undefined;
}

function resolveLegacyRequestLanguage(
  raw: RawCartLikeRecord
): RequestLanguage | undefined {
  return (
    normalizeRequestLanguage(raw.requestLanguage) ||
    normalizeRequestLanguage(raw.lang) ||
    normalizeRequestLanguage(raw.language) ||
    normalizeRequestLanguage(raw.requestLang)
  );
}

function normalizeQuantity(value: unknown): number {
  const numericValue =
    typeof value === "number" ? value : Number(String(value ?? "").trim());

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(numericValue));
}

function isQuantityLikeKey(value: unknown): boolean {
  const normalized = normalizeFieldIdForCompare(value);

  if (!normalized) return false;

  return (
    normalized.includes("quantity") ||
    normalized.includes("qty") ||
    normalized.includes("amount") ||
    normalized.includes("count") ||
    normalized === "menge" ||
    normalized.includes("menge") ||
    normalized === "anzahl" ||
    normalized.includes("anzahl") ||
    normalized === "كميه" ||
    normalized.includes("كمية") ||
    normalized.includes("كميه")
  );
}

function isQuantityLikeField(field: {
  id?: unknown;
  label?: unknown;
  value?: unknown;
}): boolean {
  return isQuantityLikeKey(field.id) || isQuantityLikeKey(field.label);
}

function normalizeServiceId(value: unknown): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function normalizeServiceTitle(value: unknown): string | undefined {
  return normalizeString(value);
}

function toComparableVoiceText(value: unknown): string {
  return normalizeTextForCompare(value);
}

function buildFieldIdentityKey(input: {
  id?: unknown;
  label?: unknown;
  value?: unknown;
}): string {
  const normalizedId = normalizeFieldIdForCompare(input.id);
  const normalizedLabel = toComparableVoiceText(input.label);
  const normalizedValue = toComparableVoiceText(input.value);

  return `${normalizedId}||${normalizedLabel}||${normalizedValue}`;
}

function buildFieldLabelValueKey(input: {
  label?: unknown;
  value?: unknown;
}): string {
  const normalizedLabel = toComparableVoiceText(input.label);
  const normalizedValue = toComparableVoiceText(input.value);

  return `${normalizedLabel}||${normalizedValue}`;
}

function buildFieldSemanticKey(input: {
  id?: unknown;
  label?: unknown;
}): string {
  const normalizedId = normalizeFieldIdForCompare(input.id);
  const normalizedLabel = toComparableVoiceText(input.label);

  return `${normalizedId}||${normalizedLabel}`;
}

function buildDataSemanticKey(input: { id?: unknown }): string {
  return normalizeFieldIdForCompare(input.id);
}

function preferLongerHumanText(
  currentValue: string | undefined,
  nextValue: string | undefined
): string | undefined {
  const current = normalizeString(currentValue);
  const next = normalizeString(nextValue);

  if (!current) return next;
  if (!next) return current;

  if (next.length > current.length) return next;
  return current;
}

function isInternalMetaKey(value: unknown): boolean {
  const normalized = normalizeString(value);
  return Boolean(normalized && normalized.startsWith("_"));
}

function createCanonicalField(input: {
  id?: unknown;
  label?: unknown;
  value?: unknown;
}): CanonicalField | null {
  const id = normalizeString(input.id);
  const label = normalizeString(input.label);
  const value = normalizeTextValue(input.value);

  if (!id || !label || !value) return null;
  if (isInternalMetaKey(id)) return null;
  if (isTechnicalLabel(label, id) && label !== id) return null;

  return {
    id,
    label,
    value,
    normalizedId: normalizeFieldIdForCompare(id),
    normalizedLabel: toComparableVoiceText(label),
    normalizedValue: toComparableVoiceText(value),
    quantityLike: isQuantityLikeField({ id, label, value }),
  };
}

function choosePreferredField(
  currentField: CanonicalField,
  nextField: CanonicalField
): CanonicalField {
  const preferredId =
    preferLongerHumanText(currentField.id, nextField.id) || currentField.id;
  const preferredLabel =
    preferLongerHumanText(currentField.label, nextField.label) ||
    currentField.label;
  const preferredValue =
    preferLongerHumanText(currentField.value, nextField.value) ||
    currentField.value;

  return {
    id: preferredId,
    label: preferredLabel,
    value: preferredValue,
    normalizedId: normalizeFieldIdForCompare(preferredId),
    normalizedLabel: toComparableVoiceText(preferredLabel),
    normalizedValue: toComparableVoiceText(preferredValue),
    quantityLike:
      isQuantityLikeField({
        id: preferredId,
        label: preferredLabel,
        value: preferredValue,
      }) || currentField.quantityLike || nextField.quantityLike,
  };
}

function dedupeCanonicalFields(fields: CanonicalField[]): CanonicalField[] {
  const result: CanonicalField[] = [];
  const byIdentity = new Map<string, number>();
  const byLabelValue = new Map<string, number>();
  const bySemantic = new Map<string, number>();

  let quantityAlreadyIncluded = false;

  fields.forEach((field) => {
    if (!field.id || !field.label || !field.value) return;

    if (field.quantityLike) {
      if (quantityAlreadyIncluded) return;
      quantityAlreadyIncluded = true;
    }

    const identityKey = buildFieldIdentityKey(field);
    const labelValueKey = buildFieldLabelValueKey(field);
    const semanticKey = buildFieldSemanticKey(field);

    const exactIndex = byIdentity.get(identityKey);
    if (exactIndex !== undefined) {
      result[exactIndex] = choosePreferredField(result[exactIndex], field);
      return;
    }

    const labelValueIndex = byLabelValue.get(labelValueKey);
    if (labelValueIndex !== undefined) {
      result[labelValueIndex] = choosePreferredField(
        result[labelValueIndex],
        field
      );

      const refreshedIdentityKey = buildFieldIdentityKey(
        result[labelValueIndex]
      );
      const refreshedSemanticKey = buildFieldSemanticKey(
        result[labelValueIndex]
      );

      byIdentity.set(refreshedIdentityKey, labelValueIndex);
      bySemantic.set(refreshedSemanticKey, labelValueIndex);
      return;
    }

    const semanticIndex = bySemantic.get(semanticKey);
    if (semanticIndex !== undefined) {
      const current = result[semanticIndex];

      const currentValue = current.normalizedValue;
      const nextValue = field.normalizedValue;

      if (
        currentValue === nextValue ||
        !currentValue ||
        !nextValue ||
        currentValue.includes(nextValue) ||
        nextValue.includes(currentValue)
      ) {
        result[semanticIndex] = choosePreferredField(current, field);

        const refreshedIdentityKey = buildFieldIdentityKey(
          result[semanticIndex]
        );
        const refreshedLabelValueKey = buildFieldLabelValueKey(
          result[semanticIndex]
        );

        byIdentity.set(refreshedIdentityKey, semanticIndex);
        byLabelValue.set(refreshedLabelValueKey, semanticIndex);
        return;
      }
    }

    const nextIndex = result.length;
    result.push(field);
    byIdentity.set(identityKey, nextIndex);
    byLabelValue.set(labelValueKey, nextIndex);
    bySemantic.set(semanticKey, nextIndex);
  });

  return result;
}

function normalizeCartData(rawData: unknown): Record<string, string> {
  const data: Record<string, string> = {};

  if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
    return data;
  }

  Object.entries(rawData as RawCartLikeRecord).forEach(([key, value]) => {
    const normalizedKey = normalizeString(key);
    const normalizedValue = normalizeTextValue(value);

    if (!normalizedKey || !normalizedValue) return;
    if (isQuantityLikeKey(normalizedKey)) return;

    data[normalizedKey] = normalizedValue;
  });

  return data;
}

function normalizeCartFields(rawFields: unknown): CartFieldItem[] {
  if (!Array.isArray(rawFields)) return [];

  const canonicalFields = rawFields
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      return createCanonicalField(item as RawCartLikeRecord);
    })
    .filter((item): item is CanonicalField => item !== null)
    .filter((item) => !item.quantityLike)
    .filter((item) => !isTechnicalLabel(item.label, item.id));

  return dedupeCanonicalFields(canonicalFields).map((field) => ({
    id: field.id,
    label: field.label,
    value: field.value,
  }));
}

function buildDataFromFields(fields: CartFieldItem[]): Record<string, string> {
  const data: Record<string, string> = {};

  const canonicalFields = fields
    .map((field) => createCanonicalField(field))
    .filter((field): field is CanonicalField => field !== null)
    .filter((field) => !field.quantityLike)
    .filter((field) => !isTechnicalLabel(field.label, field.id));

  const deduped = dedupeCanonicalFields(canonicalFields);

  deduped.forEach((field) => {
    data[field.id] = field.value;
  });

  return normalizeCartData(data);
}

function mergeDataRecords(
  baseData: Record<string, string>,
  extraData: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  const semanticMap = new Map<string, string>();

  const pushEntry = (id: string, value: string) => {
    const cleanId = normalizeString(id);
    const cleanValue = normalizeTextValue(value);

    if (!cleanId || !cleanValue) return;
    if (isQuantityLikeKey(cleanId)) return;

    if (isInternalMetaKey(cleanId)) {
      result[cleanId] = cleanValue;
      return;
    }

    const semanticKey = buildDataSemanticKey({ id: cleanId });
    const existingId = semanticMap.get(semanticKey);

    if (!existingId) {
      result[cleanId] = cleanValue;
      semanticMap.set(semanticKey, cleanId);
      return;
    }

    const preferredId = preferLongerHumanText(existingId, cleanId) || existingId;
    const preferredValue =
      preferLongerHumanText(result[existingId], cleanValue) || result[existingId];

    if (preferredId !== existingId) {
      delete result[existingId];
    }

    result[preferredId] = preferredValue;
    semanticMap.set(semanticKey, preferredId);
  };

  Object.entries(baseData).forEach(([id, value]) => pushEntry(id, value));
  Object.entries(extraData).forEach(([id, value]) => pushEntry(id, value));

  return normalizeCartData(result);
}

function mergeDataAndFields(
  rawData: Record<string, string>,
  rawFields: CartFieldItem[]
): {
  data: Record<string, string>;
  fields: CartFieldItem[];
} {
  const normalizedData = normalizeCartData(rawData);
  const normalizedFields = normalizeCartFields(rawFields);

  const canonicalFromFields = normalizedFields
    .map((field) => createCanonicalField(field))
    .filter((field): field is CanonicalField => field !== null)
    .filter((field) => !field.quantityLike)
    .filter((field) => !isTechnicalLabel(field.label, field.id));

  const mergedCanonical = dedupeCanonicalFields([...canonicalFromFields]);

  const finalFields = mergedCanonical
    .filter((field) => !field.quantityLike)
    .map((field) => ({
      id: field.id,
      label: field.label,
      value: field.value,
    }));

  const fieldBasedData = buildDataFromFields(finalFields);
  const finalData = mergeDataRecords(normalizedData, fieldBasedData);

  return {
    data: finalData,
    fields: finalFields,
  };
}

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") return null;

  const raw = item as RawCartLikeRecord;

  const id = normalizeString(raw.id) || generateId();
  const serviceId = normalizeServiceId(raw.serviceId) || "";

  if (!serviceId) return null;

  const serviceTitle = normalizeServiceTitle(raw.serviceTitle);
  const requestLanguage = resolveLegacyRequestLanguage(raw);
  const quantity = normalizeQuantity(raw.quantity);

  const normalizedData = normalizeCartData(raw.data);
  const normalizedFields = normalizeCartFields(raw.fields);

  const { data, fields } = mergeDataAndFields(normalizedData, normalizedFields);

  return {
    id,
    serviceId,
    data,
    fields,
    serviceTitle,
    requestLanguage,
    quantity,
  };
}

function normalizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => normalizeCartItem(item))
    .filter((item): item is CartItem => item !== null);
}

function cleanupLegacyCartKeys() {
  if (typeof window === "undefined") return;

  LEGACY_CART_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}

function readRawCart(): unknown {
  if (typeof window === "undefined") return [];

  cleanupLegacyCartKeys();

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getCartPublicData(item: CartItem): Record<string, string> {
  return Object.fromEntries(
    Object.entries(item.data || {}).filter(([key]) => !isInternalMetaKey(key))
  );
}

export function getCartInternalMeta(item: CartItem): Record<string, string> {
  return Object.fromEntries(
    Object.entries(item.data || {}).filter(([key]) => isInternalMetaKey(key))
  );
}

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = readRawCart();
    const normalized = normalizeCartItems(parsed);

    const normalizedSerialized = JSON.stringify(normalized);
    const parsedSerialized = JSON.stringify(parsed);

    if (normalizedSerialized !== parsedSerialized) {
      localStorage.setItem(CART_KEY, normalizedSerialized);
    }

    return normalized;
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    cleanupLegacyCartKeys();
    const normalizedItems = normalizeCartItems(items);
    localStorage.setItem(CART_KEY, JSON.stringify(normalizedItems));
    emitCartUpdated();
  } catch {
    // تجاهل الخطأ حتى لا ينكسر التطبيق
  }
};

export const addToCart = (item: {
  serviceId: string;
  data?: Record<string, string>;
  fields?: CartFieldItem[];
  serviceTitle?: string;
  requestLanguage?: RequestLanguage;
  quantity?: number;
}) => {
  if (typeof window === "undefined") return;

  const serviceId = normalizeServiceId(item.serviceId);
  if (!serviceId) return;

  const normalizedData = normalizeCartData(item.data);
  const normalizedFields = normalizeCartFields(item.fields);

  const { data, fields } = mergeDataAndFields(normalizedData, normalizedFields);

  const newItem: CartItem = {
    id: generateId(),
    serviceId,
    data,
    fields,
    serviceTitle: normalizeServiceTitle(item.serviceTitle),
    requestLanguage: normalizeRequestLanguage(item.requestLanguage),
    quantity: normalizeQuantity(item.quantity),
  };

  const current = getCart();
  const updated = [...current, newItem];
  saveCart(updated);
};

export const updateCartItem = (
  id: string,
  updates: Partial<{
    data: Record<string, string>;
    fields: CartFieldItem[];
    serviceTitle?: string;
    requestLanguage?: RequestLanguage;
    quantity?: number;
  }>
) => {
  if (typeof window === "undefined") return;

  const normalizedId = normalizeString(id);
  if (!normalizedId) return;

  const current = getCart();

  const updated = current.map((item) => {
    if (item.id !== normalizedId) return item;

    const hasDataUpdate = updates.data !== undefined;
    const hasFieldsUpdate = updates.fields !== undefined;

    const normalizedUpdatedData = hasDataUpdate
      ? normalizeCartData(updates.data)
      : item.data;

    const normalizedUpdatedFields = hasFieldsUpdate
      ? normalizeCartFields(updates.fields)
      : item.fields;

    const merged = mergeDataAndFields(
      normalizedUpdatedData,
      normalizedUpdatedFields
    );

    const nextServiceTitle =
      updates.serviceTitle !== undefined
        ? normalizeServiceTitle(updates.serviceTitle)
        : item.serviceTitle;

    const nextRequestLanguage =
      updates.requestLanguage !== undefined
        ? normalizeRequestLanguage(updates.requestLanguage) ||
          item.requestLanguage
        : item.requestLanguage;

    const nextQuantity =
      updates.quantity !== undefined
        ? normalizeQuantity(updates.quantity)
        : normalizeQuantity(item.quantity);

    return {
      ...item,
      data: merged.data,
      fields: merged.fields,
      serviceTitle: nextServiceTitle,
      requestLanguage: nextRequestLanguage,
      quantity: nextQuantity,
    };
  });

  saveCart(updated);
};

export const setCartItemQuantity = (id: string, quantity: number) => {
  if (typeof window === "undefined") return;

  const normalizedId = normalizeString(id);
  if (!normalizedId) return;

  const normalizedQuantity = normalizeQuantity(quantity);
  const current = getCart();

  const updated = current.map((item) =>
    item.id === normalizedId
      ? {
          ...item,
          quantity: normalizedQuantity,
        }
      : item
  );

  saveCart(updated);
};

export const clearCart = () => {
  if (typeof window === "undefined") return;

  try {
    cleanupLegacyCartKeys();
    localStorage.removeItem(CART_KEY);
    emitCartUpdated();
  } catch {
    // ignore
  }
};

export const removeCartItem = (id: string) => {
  if (typeof window === "undefined") return;

  const normalizedId = normalizeString(id);
  if (!normalizedId) return;

  const current = getCart();
  const updated = current.filter((item) => item.id !== normalizedId);
  saveCart(updated);
};

export const getCartItemsCount = (): number => {
  return getCart().length;
};

export const getCartQuantityCount = (): number => {
  return getCart().reduce((total, item) => {
    return total + normalizeQuantity(item.quantity);
  }, 0);
};