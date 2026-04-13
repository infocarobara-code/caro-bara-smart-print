"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { getCart, type CartItem } from "@/lib/cart";
import type { Language } from "@/lib/i18n";

type Props = {
  lang: Language;
};

const cartText = {
  cartButton: {
    ar: "السلة",
    de: "Warenkorb",
    en: "Cart",
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

  const wrapperPositionStyle = useMemo<CSSProperties>(() => {
    if (isArabic) {
      return {
        position: "fixed",
        bottom: "16px",
        left: "16px",
        zIndex: 999,
      };
    }

    return {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      zIndex: 999,
    };
  }, [isArabic]);

  return (
    <div style={wrapperPositionStyle}>
      <Link
        href="/cart"
        aria-label={`${cartText.cartButton[lang]} ${count}`}
        style={{
          minWidth: "100px",
          minHeight: "54px",
          padding: "0 16px",
          borderRadius: "999px",
          border: "1px solid #25d366",
          background: "#25d366",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 10px 22px rgba(37, 211, 102, 0.25)",
          fontSize: "14px",
          fontWeight: 800,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          direction: isArabic ? "rtl" : "ltr",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
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
            color: "#25d366",
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