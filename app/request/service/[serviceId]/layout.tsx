import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServiceById } from "@/data/services/index";

type Props = {
  children: ReactNode;
  params: Promise<{
    serviceId: string;
  }>;
};

const buildServiceSeo = (serviceId: string, language: "ar" | "de" | "en") => {
  if (serviceId === "signage") {
    if (language === "de") {
      return {
        title: "Schilder & Lichtwerbung in Berlin | Caro Bara Smart Print",
        description:
          "Professionelle Schilder, Lichtwerbung und Werbeanlagen in Berlin. Sende deine Anfrage auch ohne vollständige technische Details – wir strukturieren sie für die saubere Umsetzung.",
        keywords: [
          "schilder berlin",
          "werbeschilder berlin",
          "lichtwerbung berlin",
          "firmenschild berlin",
          "ladenschild berlin",
          "leuchtreklame berlin",
          "beschilderung berlin",
          "außenwerbung berlin",
          "reklametafel berlin",
          "werbeschild erstellen lassen berlin",
        ],
      };
    }

    if (language === "en") {
      return {
        title: "Signs & Light Advertising in Berlin | Caro Bara Smart Print",
        description:
          "Professional shop signs, raised letters, and light advertising in Berlin. Send your request even if some technical details are still unclear.",
        keywords: [
          "signs berlin",
          "shop signs berlin",
          "light advertising berlin",
          "business sign berlin",
          "storefront signs berlin",
          "custom signs berlin",
          "illuminated signs berlin",
          "raised letters berlin",
          "sign maker berlin",
          "signage berlin germany",
        ],
      };
    }

    return {
      title: "لوحات المحلات والإضاءات في برلين | Caro Bara Smart Print",
      description:
        "حلول احترافية للوحات المحلات والحروف البارزة والإضاءات التجارية في برلين. أرسل طلبك حتى لو لم تكن كل التفاصيل الفنية واضحة بعد.",
      keywords: [
        "لوحات برلين",
        "لوحات محلات برلين",
        "لوحات مضيئة برلين",
        "إعلانات ضوئية برلين",
        "لوحات واجهات برلين",
        "تصميم لوحات برلين",
        "تنفيذ لوحات برلين",
        "حروف بارزة برلين",
        "لوحات تجارية برلين",
        "لوحة محل برلين",
      ],
    };
  }

  const service = getServiceById(serviceId);

  const serviceTitle =
    service?.title?.[language] ||
    service?.title?.de ||
    service?.title?.en ||
    service?.title?.ar ||
    "Service";

  const serviceDescription =
    service?.description?.[language] ||
    service?.description?.de ||
    service?.description?.en ||
    service?.description?.ar ||
    "";

  if (language === "de") {
    return {
      title: `${serviceTitle} | Caro Bara Smart Print`,
      description:
        serviceDescription ||
        "Professionelle Anfrage für Druck, Werbetechnik und individuelle Produktionslösungen in Berlin.",
      keywords: [
        `${serviceTitle.toLowerCase()} berlin`,
        "druckerei berlin",
        "werbung berlin",
        "print service berlin",
        "individuelle anfrage berlin",
      ],
    };
  }

  if (language === "en") {
    return {
      title: `${serviceTitle} | Caro Bara Smart Print`,
      description:
        serviceDescription ||
        "Professional request flow for print, signage, and custom production services in Berlin.",
      keywords: [
        `${serviceTitle.toLowerCase()} berlin`,
        "printing berlin",
        "signage berlin",
        "advertising berlin",
        "custom print request berlin",
      ],
    };
  }

  return {
    title: `${serviceTitle} | Caro Bara Smart Print`,
    description:
      serviceDescription ||
      "نظام طلب احترافي لخدمات الطباعة والإعلان والتنفيذ في برلين.",
    keywords: [
      `${serviceTitle} برلين`,
      "طباعة برلين",
      "إعلان برلين",
      "لوحات برلين",
      "طلب طباعة برلين",
    ],
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;

  const deSeo = buildServiceSeo(serviceId, "de");
  const enSeo = buildServiceSeo(serviceId, "en");
  const arSeo = buildServiceSeo(serviceId, "ar");

  return {
    title: deSeo.title,
    description: deSeo.description,
    keywords: [...deSeo.keywords, ...enSeo.keywords, ...arSeo.keywords],
    openGraph: {
      title: deSeo.title,
      description: deSeo.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: deSeo.title,
      description: deSeo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ServiceLayout({ children }: Props) {
  return <>{children}</>;
}