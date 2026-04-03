"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import {
  Wrench,
  Flag,
  ScanLine,
  Store,
  Package,
  Shirt,
  Palette,
  Printer,
  LayoutGrid,
  Hammer,
  PenTool,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { categories } from "@/data/categories";
import { getServicesByCategory } from "@/data/services/index";
import { useLanguage } from "@/lib/languageContext";

type SimpleService = {
  id: string;
  title?: { ar?: string; de?: string; en?: string };
  description?: { ar?: string; de?: string; en?: string };
};

type IconComponent = typeof Store;

export default function CategoryPage() {
  const params = useParams();
  const categoryId = String(params?.categoryId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const category = categories.find((item) => item.id === categoryId) || null;
  const categoryServices = category ? getServicesByCategory(category.id) : [];

  const text = {
    badge:
      language === "ar"
        ? "صفحة الفئة"
        : language === "de"
          ? "Kategorieseite"
          : "Category Page",

    fallbackTitle:
      language === "ar"
        ? "الفئة غير موجودة"
        : language === "de"
          ? "Kategorie nicht gefunden"
          : "Category not found",

    fallbackDescription:
      language === "ar"
        ? "تعذر العثور على هذه الفئة. يمكنك الرجوع واختيار فئة أخرى."
        : language === "de"
          ? "Diese Kategorie wurde nicht gefunden. Bitte gehe zurück und wähle eine andere Kategorie."
          : "This category could not be found. Please go back and choose another category.",

    servicesTitle:
      language === "ar"
        ? "الخدمات ضمن هذه الفئة"
        : language === "de"
          ? "Services in dieser Kategorie"
          : "Services in this category",

    emptyServices:
      language === "ar"
        ? "لا توجد خدمات متاحة ضمن هذه الفئة حاليًا."
        : language === "de"
          ? "Aktuell sind in dieser Kategorie keine Services verfügbar."
          : "There are currently no services available in this category.",

    openService:
      language === "ar"
        ? "فتح الخدمة"
        : language === "de"
          ? "Service öffnen"
          : "Open Service",
  };

  const localizedCategoryTitle =
    category?.title?.[language] ||
    category?.title?.en ||
    category?.title?.de ||
    category?.title?.ar ||
    categoryId;

  const localizedCategoryDescription =
    category?.description?.[language] ||
    category?.description?.en ||
    category?.description?.de ||
    category?.description?.ar ||
    "";

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .replace(/[&/,_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const containsAny = (source: string, keywords: string[]) =>
    keywords.some((keyword) => source.includes(keyword));

  const getServiceSearchText = (service: SimpleService) => {
    return normalizeText(
      [
        service.id,
        service.title?.ar || "",
        service.title?.de || "",
        service.title?.en || "",
        service.description?.ar || "",
        service.description?.de || "",
        service.description?.en || "",
      ].join(" ")
    );
  };

  const hashString = (value: string) => {
    let hash = 0;

    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  };

  const getSignageIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "banner",
        "roll up",
        "rollup",
        "flag",
        "flags",
        "fahne",
        "fahnen",
        "messe",
        "event",
        "events",
        "فعاليات",
        "معارض",
        "bannerwerbung",
      ])
    ) {
      return Flag;
    }

    if (
      containsAny(source, [
        "window",
        "glass",
        "glazing",
        "folie",
        "folierung",
        "schaufenster",
        "glas",
        "زجاج",
        "واجهة زجاجية",
      ])
    ) {
      return ScanLine;
    }

    if (
      containsAny(source, [
        "mount",
        "installation",
        "wartung",
        "maintenance",
        "repair",
        "demontage",
        "montage",
        "تركيب",
        "صيانة",
        "فك",
      ])
    ) {
      return Wrench;
    }

    if (
      containsAny(source, [
        "shop",
        "store",
        "shopfront",
        "fassade",
        "fassaden",
        "sign",
        "signage",
        "schild",
        "schilder",
        "licht",
        "light",
        "واجهة",
        "لوحة",
        "لوحات",
        "إضاءة",
        "متاجر",
      ])
    ) {
      return Store;
    }

    const pool = [Store, Flag, ScanLine, Wrench];
    return pool[hashString(serviceId) % pool.length];
  };

  const getPrintingIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "business card",
        "visitenkarte",
        "cards",
        "karte",
        "بطاقة",
        "بطاقات",
        "flyer",
        "poster",
        "brochure",
        "booklet",
        "druck",
        "print",
        "طباعة",
        "منشور",
        "بروشور",
        "ملف مطبوع",
      ])
    ) {
      return Printer;
    }

    if (
      containsAny(source, [
        "menu",
        "menü",
        "booklet",
        "catalog",
        "katalog",
        "magazine",
        "folder",
        "منيو",
        "كتالوج",
        "مجلة",
      ])
    ) {
      return FileText;
    }

    if (
      containsAny(source, [
        "layout",
        "template",
        "preparation",
        "aufbau",
        "satz",
        "gestalten",
        "تصميم",
        "تجهيز ملف",
        "تنسيق",
      ])
    ) {
      return PenTool;
    }

    const pool = [Printer, FileText, PenTool, LayoutGrid];
    return pool[hashString(serviceId) % pool.length];
  };

  const getPackagingIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "packaging",
        "box",
        "carton",
        "verpackung",
        "عبوة",
        "تغليف",
        "علبة",
      ])
    ) {
      return Package;
    }

    if (
      containsAny(source, [
        "label",
        "labels",
        "etikett",
        "etiketten",
        "sticker",
        "aufkleber",
        "ملصق",
        "ملصقات",
      ])
    ) {
      return Printer;
    }

    if (
      containsAny(source, [
        "design",
        "layout",
        "konzept",
        "brand look",
        "تصميم",
        "تنسيق",
      ])
    ) {
      return PenTool;
    }

    const pool = [Package, Printer, PenTool, LayoutGrid];
    return pool[hashString(serviceId) % pool.length];
  };

  const getTextileIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "shirt",
        "textil",
        "textile",
        "hoodie",
        "cap",
        "wear",
        "merch",
        "t shirt",
        "t-shirt",
        "تيشيرت",
        "ملابس",
        "نسيج",
        "قبعة",
      ])
    ) {
      return Shirt;
    }

    if (
      containsAny(source, [
        "event",
        "promotion",
        "promo",
        "werbeartikel",
        "giveaway",
        "فعاليات",
        "دعائي",
        "تبرز",
      ])
    ) {
      return Flag;
    }

    if (
      containsAny(source, [
        "print",
        "druck",
        "branding",
        "طباعة",
        "طباعة ملابس",
      ])
    ) {
      return Printer;
    }

    const pool = [Shirt, Printer, Flag, PenTool];
    return pool[hashString(serviceId) % pool.length];
  };

  const getBrandingIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "logo",
        "branding",
        "brand",
        "corporate design",
        "identity",
        "identity system",
        "هوية",
        "شعار",
        "branding design",
        "brand guide",
      ])
    ) {
      return Palette;
    }

    if (
      containsAny(source, [
        "concept",
        "creative",
        "layout",
        "design",
        "konzept",
        "design system",
        "تصميم",
        "تخطيط",
        "رسم",
      ])
    ) {
      return PenTool;
    }

    if (
      containsAny(source, [
        "brief",
        "strategy",
        "profile",
        "naming",
        "guideline",
        "ملف",
        "تعريف",
        "دليل",
      ])
    ) {
      return FileText;
    }

    const pool = [Palette, PenTool, FileText, LayoutGrid];
    return pool[hashString(serviceId) % pool.length];
  };

  const getFabricationIcon = (source: string, serviceId: string): IconComponent => {
    if (
      containsAny(source, [
        "fabrication",
        "custom",
        "special",
        "sonder",
        "dekor",
        "decor",
        "wood",
        "acryl",
        "acrylic",
        "dibond",
        "cnc",
        "تصنيع",
        "ديكور",
        "أكريليك",
        "ديبوند",
        "قص",
        "تجهيز خاص",
      ])
    ) {
      return Hammer;
    }

    if (
      containsAny(source, [
        "mount",
        "installation",
        "repair",
        "maintenance",
        "تركيب",
        "صيانة",
      ])
    ) {
      return Wrench;
    }

    if (
      containsAny(source, [
        "structure",
        "display",
        "stand",
        "frame",
        "booth",
        "ستاند",
        "هيكل",
        "حامل",
      ])
    ) {
      return LayoutGrid;
    }

    const pool = [Hammer, Wrench, LayoutGrid, Store];
    return pool[hashString(serviceId) % pool.length];
  };

  const getServiceIcon = (service: SimpleService, currentCategoryId: string) => {
    const source = getServiceSearchText(service);

    switch (currentCategoryId) {
      case "signage":
        return getSignageIcon(source, service.id);
      case "printing":
        return getPrintingIcon(source, service.id);
      case "packaging-labeling":
        return getPackagingIcon(source, service.id);
      case "textile-promotional":
        return getTextileIcon(source, service.id);
      case "branding-design":
        return getBrandingIcon(source, service.id);
      case "fabrication-decor":
        return getFabricationIcon(source, service.id);
      default:
        return LayoutGrid;
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1080px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "22px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
      textAlign: isArabic ? "right" : "left",
    },

    badge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
      letterSpacing: "0.2px",
    },

    title: {
      margin: "0 0 8px",
      fontSize: "clamp(24px, 6vw, 36px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
    },

    description: {
      margin: 0,
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
      maxWidth: "760px",
    },

    section: {
      background: "rgba(255,255,255,0.84)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionTitle: {
      margin: "0 0 12px",
      fontSize: "18px",
      lineHeight: 1.3,
      color: "#35281d",
      fontWeight: 800,
      textAlign: isArabic ? "right" : "left",
    },

    emptyBox: {
      border: "1px dashed #d9c4ab",
      borderRadius: "14px",
      padding: "14px",
      color: "#6f5b48",
      background: "#fffaf4",
      fontSize: "13px",
      lineHeight: 1.7,
      textAlign: isArabic ? "right" : "left",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "12px",
    },

    card: {
      display: "flex",
      flexDirection: "column" as const,
      minWidth: 0,
      borderRadius: "18px",
      border: "1px solid #decdb8",
      background: "#fffaf5",
      textDecoration: "none",
      color: "#2f2419",
      boxShadow: "0 5px 16px rgba(90, 70, 40, 0.05)",
      overflow: "hidden",
      padding: "14px",
      minHeight: "208px",
    },

    iconRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-end" : "flex-start",
      marginBottom: "10px",
    },

    iconWrap: {
      width: "58px",
      height: "58px",
      borderRadius: "18px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 10px rgba(90, 70, 40, 0.05)",
      flexShrink: 0,
      background: "linear-gradient(135deg, #f6ede2 0%, #efe1cf 100%)",
      border: "1px solid #dcc6ae",
    },

    content: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      minWidth: 0,
      flex: 1,
    },

    cardTitle: {
      margin: 0,
      fontSize: "16px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
      minHeight: "44px",
    },

    cardDescription: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#6a5642",
      textAlign: isArabic ? "right" : "left",
      minHeight: "52px",
      flex: 1,
    },

    footerRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
      marginTop: "6px",
    },

    openPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "34px",
      padding: "0 14px",
      borderRadius: "999px",
      border: "1px solid #cdb79f",
      background: "#f3e3cf",
      color: "#3b2f24",
      fontSize: "12px",
      fontWeight: 800,
    },
  };

  if (!category) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <section style={styles.hero}>
            <div style={styles.badge}>{text.badge}</div>
            <h1 style={styles.title}>{text.fallbackTitle}</h1>
            <p style={styles.description}>{text.fallbackDescription}</p>
          </section>

          <CartPopup lang={language} />
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackButton showBackHome backHref="/request" />

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{localizedCategoryTitle}</h1>
          <p style={styles.description}>{localizedCategoryDescription}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{text.servicesTitle}</h2>

          {categoryServices.length === 0 ? (
            <div style={styles.emptyBox}>{text.emptyServices}</div>
          ) : (
            <div style={styles.grid}>
              {categoryServices.map((service) => {
                const localizedServiceTitle =
                  service.title?.[language] ||
                  service.title?.en ||
                  service.title?.de ||
                  service.title?.ar ||
                  service.id;

                const localizedServiceDescription =
                  service.description?.[language] ||
                  service.description?.en ||
                  service.description?.de ||
                  service.description?.ar ||
                  "";

                const ServiceIcon = getServiceIcon(service, category.id);

                return (
                  <Link
                    key={service.id}
                    href={`/request/service/${service.id}`}
                    style={styles.card}
                  >
                    <div style={styles.iconRow}>
                      <div style={styles.iconWrap}>
                        <ServiceIcon
                          size={26}
                          strokeWidth={2.1}
                          color="#4b3a2b"
                        />
                      </div>
                    </div>

                    <div style={styles.content}>
                      <h3 style={styles.cardTitle}>{localizedServiceTitle}</h3>
                      <p style={styles.cardDescription}>
                        {localizedServiceDescription}
                      </p>

                      <div style={styles.footerRow}>
                        <span style={styles.openPill}>{text.openService}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}