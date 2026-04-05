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

const CART_KEY = "cart";

function generateId() {
  return "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
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

function normalizeRequestLanguage(value: unknown): RequestLanguage | undefined {
  if (value === "ar" || value === "de" || value === "en") {
    return value;
  }
  return undefined;
}

function resolveLegacyRequestLanguage(
  raw: Record<string, unknown>
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

function normalizeCartData(rawData: unknown): Record<string, string> {
  const data: Record<string, string> = {};

  if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
    return data;
  }

  Object.entries(rawData as Record<string, unknown>).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    const normalizedKey = String(key).trim();
    if (!normalizedKey) return;

    if (Array.isArray(value)) {
      const normalizedArrayValue = value
        .map((entry) => String(entry).trim())
        .filter(Boolean)
        .join(", ");

      if (normalizedArrayValue) {
        data[normalizedKey] = normalizedArrayValue;
      }
      return;
    }

    const normalizedValue = String(value).trim();
    if (!normalizedValue) return;

    data[normalizedKey] = normalizedValue;
  });

  return data;
}

function normalizeCartFields(rawFields: unknown): CartFieldItem[] {
  if (!Array.isArray(rawFields)) return [];

  return rawFields
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const raw = item as Record<string, unknown>;

      const id = normalizeString(raw.id);
      const label = normalizeString(raw.label);
      const value = normalizeString(raw.value);

      if (!id || !label || !value) return null;

      return {
        id,
        label,
        value,
      };
    })
    .filter((item): item is CartFieldItem => item !== null);
}

function buildFieldsFromData(data: Record<string, string>): CartFieldItem[] {
  return Object.entries(data)
    .map(([id, value]) => {
      const normalizedId = normalizeString(id);
      const normalizedValue = normalizeString(value);

      if (!normalizedId || !normalizedValue) return null;

      return {
        id: normalizedId,
        label: normalizedId,
        value: normalizedValue,
      };
    })
    .filter((item): item is CartFieldItem => item !== null);
}

function buildDataFromFields(fields: CartFieldItem[]): Record<string, string> {
  const data: Record<string, string> = {};

  fields.forEach((field) => {
    const id = normalizeString(field.id);
    const value = normalizeString(field.value);

    if (!id || !value) return;
    data[id] = value;
  });

  return data;
}

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") return null;

  const raw = item as Record<string, unknown>;

  const id = normalizeString(raw.id) || generateId();
  const serviceId = normalizeString(raw.serviceId) || "";

  if (!serviceId) return null;

  const serviceTitle = normalizeString(raw.serviceTitle);
  const requestLanguage = resolveLegacyRequestLanguage(raw);
  const quantity = normalizeQuantity(raw.quantity);

  const normalizedData = normalizeCartData(raw.data);
  const normalizedFields = normalizeCartFields(raw.fields);

  const data =
    Object.keys(normalizedData).length > 0
      ? normalizedData
      : buildDataFromFields(normalizedFields);

  const fields =
    normalizedFields.length > 0
      ? normalizedFields
      : buildFieldsFromData(data);

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

function readRawCart(): unknown {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
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

  const serviceId = normalizeString(item.serviceId);
  if (!serviceId) return;

  const normalizedData = normalizeCartData(item.data);
  const normalizedFields = normalizeCartFields(item.fields);

  const finalData =
    Object.keys(normalizedData).length > 0
      ? normalizedData
      : buildDataFromFields(normalizedFields);

  const finalFields =
    normalizedFields.length > 0
      ? normalizedFields
      : buildFieldsFromData(finalData);

  const newItem: CartItem = {
    id: generateId(),
    serviceId,
    data: finalData,
    fields: finalFields,
    serviceTitle: normalizeString(item.serviceTitle),
    requestLanguage: normalizeRequestLanguage(item.requestLanguage),
    quantity: normalizeQuantity(item.quantity),
  };

  const current = getCart();
  const updated = [...current, newItem];
  saveCart(updated);
};export const updateCartItem = (
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

    const normalizedUpdatedData =
      updates.data !== undefined ? normalizeCartData(updates.data) : undefined;

    const normalizedUpdatedFields =
      updates.fields !== undefined ? normalizeCartFields(updates.fields) : undefined;

    const finalData =
      normalizedUpdatedData !== undefined
        ? normalizedUpdatedData
        : normalizedUpdatedFields !== undefined
          ? buildDataFromFields(normalizedUpdatedFields)
          : item.data;

    const finalFields =
      normalizedUpdatedFields !== undefined
        ? normalizedUpdatedFields
        : normalizedUpdatedData !== undefined
          ? buildFieldsFromData(normalizedUpdatedData)
          : item.fields;

    const nextServiceTitle =
      updates.serviceTitle !== undefined
        ? normalizeString(updates.serviceTitle)
        : item.serviceTitle;

    const nextRequestLanguage =
      updates.requestLanguage !== undefined
        ? normalizeRequestLanguage(updates.requestLanguage) || item.requestLanguage
        : item.requestLanguage;

    const nextQuantity =
      updates.quantity !== undefined
        ? normalizeQuantity(updates.quantity)
        : normalizeQuantity(item.quantity);

    return {
      ...item,
      data: finalData,
      fields: finalFields,
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
  saveCart([]);
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