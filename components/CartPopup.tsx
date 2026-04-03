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
          minWidth: "92px",
          minHeight: "52px",
          padding: "0 14px",
          borderRadius: "999px",
          border: "1px solid #231a13",
          background: "#1f1711",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
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
            minWidth: "24px",
            height: "24px",
            padding: "0 6px",
            borderRadius: "999px",
            background: count > 0 ? "#f3e3cf" : "rgba(255,255,255,0.14)",
            color: count > 0 ? "#2b2017" : "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 800,
            lineHeight: 1,
            border:
              count > 0
                ? "1px solid #e4ccb0"
                : "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {count}
        </span>
      </Link>
    </div>
  );
}