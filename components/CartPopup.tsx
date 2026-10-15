"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, type CartItem } from "@/lib/cart";
import type { Language } from "@/lib/i18n";

type Props = {
  lang: Language;
};

const cartText = {
  cartButton: {
    ar: "استفسارك",
    de: "Deine Anfrage",
    en: "Your inquiry",
  },
};

export default function CartPopup({ lang }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);

  const isArabic = lang === "ar";
  const count = items.length;

  useEffect(() => {
    const refreshCart = () => setItems(getCart());

    refreshCart();

    window.addEventListener("focus", refreshCart);
    window.addEventListener("storage", refreshCart);
    window.addEventListener("cart-updated", refreshCart);

    return () => {
      window.removeEventListener("focus", refreshCart);
      window.removeEventListener("storage", refreshCart);
      window.removeEventListener("cart-updated", refreshCart);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div style={{display: "flex", justifyContent: "flex-end", padding: "12px 16px"}}>
      <Link
        href="/cart"
        aria-label={`${cartText.cartButton[lang]} ${count}`}
        style={{
          minWidth: "84px",
          minHeight: "44px",
          padding: "0 12px",
          borderRadius: "999px",
          border: "1px solid var(--wa-green-primary)",
          background: "var(--wa-green-primary)",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(37, 42, 43, 0.12)",
          fontSize: "14px",
          fontWeight: 800,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          direction: isArabic ? "rtl" : "ltr",
          whiteSpace: "nowrap",
        }}
      >
        <span>{cartText.cartButton[lang]}</span>

        <span
          style={{
            minWidth: "26px",
            height: "26px",
            padding: "0 6px",
            borderRadius: "999px",
            background: "#ffffff",
            color: "var(--wa-green-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 800,
            lineHeight: 1,
            border: "1px solid #d9fdd3",
          }}
        >
          {count}
        </span>
      </Link>
    </div>
  );
}
