export type CartItem = {
  id: string;
  serviceId: string;
  data: Record<string, string>;
  serviceTitle?: string;
};

const CART_KEY = "cart";

function generateId() {
  return "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") return null;

  const raw = item as Record<string, unknown>;

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id
      : generateId();

  const serviceId =
    typeof raw.serviceId === "string" && raw.serviceId.trim()
      ? raw.serviceId
      : "";

  if (!serviceId) return null;

  const rawData = raw.data;
  const data: Record<string, string> = {};

  if (rawData && typeof rawData === "object") {
    Object.entries(rawData as Record<string, unknown>).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      data[key] = String(value);
    });
  }

  const serviceTitle =
    typeof raw.serviceTitle === "string" && raw.serviceTitle.trim()
      ? raw.serviceTitle
      : undefined;

  return {
    id,
    serviceId,
    data,
    serviceTitle,
  };
}

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map((item) => normalizeCartItem(item))
      .filter((item): item is CartItem => item !== null);

    const needsRewrite =
      JSON.stringify(parsed) !== JSON.stringify(normalized);

    if (needsRewrite) {
      localStorage.setItem(CART_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (item: {
  serviceId: string;
  data: Record<string, string>;
  serviceTitle?: string;
}) => {
  if (typeof window === "undefined") return;

  const current = getCart();

  const newItem: CartItem = {
    id: generateId(),
    serviceId: item.serviceId,
    data: item.data,
    serviceTitle: item.serviceTitle,
  };

  const updated = [...current, newItem];
  saveCart(updated);
};

export const clearCart = () => {
  if (typeof window === "undefined") return;
  saveCart([]);
};

export const removeCartItem = (id: string) => {
  if (typeof window === "undefined") return;

  const current = getCart();
  const updated = current.filter((item) => item.id !== id);
  saveCart(updated);
};