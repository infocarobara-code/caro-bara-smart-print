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
    ar: "السلة",
    de: "Warenkorb",
    en: "Cart",
  },
};

export default function CartPopup({ lang }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const refreshCart = () => setItems(getCart());

    refreshCart();

    window.addEventListener("focus", refreshCart);
    window.addEventListener("storage", refreshCart);

    return () => {
      window.removeEventListener("focus", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  return (
    <Link
      href="/cart"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        minWidth: "74px",
        height: "58px",
        padding: "0 18px",
        borderRadius: "999px",
        border: "1px solid #231a13",
        background: "#1f1711",
        color: "#ffffff",
        cursor: "pointer",
        zIndex: 999,
        boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
        fontSize: "15px",
        fontWeight: 800,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {cartText.cartButton[lang]} {items.length}
    </Link>
  );
}