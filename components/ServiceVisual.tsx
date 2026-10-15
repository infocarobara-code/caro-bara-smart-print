"use client";
import Image from "next/image";
import { useCategories } from "@/lib/catalog/context";
import type { Language } from "@/lib/i18n";

export default function ServiceVisual({ categoryId, language, src, alt }: {
  categoryId?: string;
  language: Language;
  src?: string;
  alt?: string;
}) {
  const categories = useCategories();
  const category = categories.find((item) => item.id === categoryId);
  const image = src || category?.image;
  if (!image) return null;
  const caption = {
    ar: "صورة توضيحية للخدمة والخامات",
    de: "Beispiel für Leistung und Materialien",
    en: "Illustrative service and material example",
  };
  return (
    <figure style={{ margin: "12px 0 16px", width: "100%", display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ position: "relative", width: "112px", height: "72px", flexShrink: 0, overflow: "hidden", borderRadius: "12px", background: "#f2f0eb" }}>
        <Image src={image} alt={alt || category?.title[language] || caption[language]} fill sizes="112px" style={{ objectFit: "cover" }} />
      </div>
      <figcaption style={{ margin: 0, color: "#756f66", fontSize: "11px", lineHeight: 1.5 }}>{caption[language]}</figcaption>
    </figure>
  );
}
