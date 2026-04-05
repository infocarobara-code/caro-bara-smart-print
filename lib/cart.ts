export type RequestLanguage = "ar" | "de" | "en";

export type CartItem = {
  id: string;
  serviceId: string;
  data: Record<string, string>;
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

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") return null;

  const raw = item as Record<string, unknown>;

  const id = normalizeString(raw.id) || generateId();
  const serviceId = normalizeString(raw.serviceId) || "";

  if (!serviceId) return null;

  const serviceTitle = normalizeString(raw.serviceTitle);
  const requestLanguage = normalizeRequestLanguage(raw.requestLanguage);
  const data = normalizeCartData(raw.data);
  const quantity = normalizeQuantity(raw.quantity);

  return {
    id,
    serviceId,
    data,
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
  data: Record<string, string>;
  serviceTitle?: string;
  requestLanguage?: RequestLanguage;
  quantity?: number;
}) => {
  if (typeof window === "undefined") return;

  const serviceId = normalizeString(item.serviceId);
  if (!serviceId) return;

  const newItem: CartItem = {
    id: generateId(),
    serviceId,
    data: normalizeCartData(item.data),
    serviceTitle: normalizeString(item.serviceTitle),
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

    const nextData =
      updates.data !== undefined ? normalizeCartData(updates.data) : item.data;

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
      data: nextData,
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