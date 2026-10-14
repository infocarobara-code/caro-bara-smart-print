import Image from "next/image";
import { categories } from "@/data/categories";
import type { Language } from "@/lib/i18n";

export default function ServiceVisual({ categoryId, language, src, alt }: {
  categoryId?: string;
  language: Language;
  src?: string;
  alt?: string;
}) {
  const category = categories.find((item) => item.id === categoryId);
  const image = src || category?.image;
  if (!image) return null;
  const caption = {
    ar: "صورة توضيحية للخدمة والخامات",
    de: "Beispiel für Leistung und Materialien",
    en: "Illustrative service and material example",
  };
  return (
    <figure style={{ margin: "18px 0 22px", width: "100%" }}>
      <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "18px", background: "#f2f0eb" }}>
        <Image src={image} alt={alt || category?.title[language] || caption[language]} fill sizes="(max-width: 768px) 94vw, 1000px" style={{ objectFit: "cover" }} />
      </div>
      <figcaption style={{ marginTop: "7px", color: "#756f66", fontSize: "11px", lineHeight: 1.5 }}>{caption[language]}</figcaption>
    </figure>
  );
}
