import type { Metadata } from "next";
import type { ReactNode } from "react";
import { categories } from "@/data/categories";

type Props = {
  children: ReactNode;
  params: {
    categoryId: string;
  };
};

type SeoPayload = {
  title: string;
  description: string;
  keywords: string[];
};

const siteUrl = "https://www.carobara.de";

const buildCategorySeo = (
  categoryId: string,
  language: "ar" | "de" | "en"
): SeoPayload => {
  if (categoryId === "signage") {
    if (language === "de") {
      return {
        title:
          "Schilder, Fassaden & Lichtwerbung in Berlin | Caro Bara Smart Print",
        description:
          "Entdecke passende Services für Schilder, Fassaden, Lichtwerbung, Montage und weitere Werbetechnik in Berlin. Wähle den richtigen Einstieg für deine Anfrage.",
        keywords: [
          "schilder berlin",
          "lichtwerbung berlin",
          "fassadenbeschriftung berlin",
          "werbeschilder berlin",
          "signage berlin",
          "geschäftsschilder berlin",
          "profilbuchstaben berlin",
          "schilder service berlin",
        ],
      };
    }

    if (language === "en") {
      return {
        title:
          "Signs, Facades & Light Advertising in Berlin | Caro Bara Smart Print",
        description:
          "Explore the right services for signs, facades, light advertising, installation, and related signage solutions in Berlin.",
        keywords: [
          "signs berlin",
          "light advertising berlin",
          "facade signs berlin",
          "shop signs berlin",
          "signage berlin",
          "raised letters berlin",
          "business signage berlin",
          "sign installation berlin",
        ],
      };
    }

    return {
      title:
        "لوحات المحلات والواجهات والإضاءات في برلين | Caro Bara Smart Print",
      description:
        "استكشف الخدمات المناسبة للوحات المحلات والواجهات والإضاءات والتركيب والخدمات المرتبطة بها في برلين، واختر نقطة البداية الأنسب لطلبك.",
      keywords: [
        "لوحات برلين",
        "لوحات محلات برلين",
        "واجهات محلات برلين",
        "إضاءات تجارية برلين",
        "حروف بارزة برلين",
        "تركيب لوحات برلين",
        "لوحات مضيئة برلين",
      ],
    };
  }

  const category = categories.find((item) => item.id === categoryId);

  const localizedTitle =
    category?.title?.[language] ||
    category?.title?.de ||
    category?.title?.en ||
    category?.title?.ar ||
    categoryId ||
    "";

  const safeTitle = String(localizedTitle).trim() || "service";

  const localizedDescription =
    category?.description?.[language] ||
    category?.description?.de ||
    category?.description?.en ||
    category?.description?.ar ||
    "";

  if (language === "de") {
    return {
      title: `${safeTitle} | Caro Bara Smart Print`,
      description:
        localizedDescription ||
        "Wähle den passenden Service für deine Anfrage in Berlin.",
      keywords: [
        `${safeTitle.toLowerCase()} berlin`,
        "druckerei berlin",
        "werbung berlin",
        "anfrage berlin",
      ],
    };
  }

  if (language === "en") {
    return {
      title: `${safeTitle} | Caro Bara Smart Print`,
      description:
        localizedDescription ||
        "Choose the right service for your request in Berlin.",
      keywords: [
        `${safeTitle.toLowerCase()} berlin`,
        "printing berlin",
        "advertising berlin",
        "request service berlin",
      ],
    };
  }

  return {
    title: `${safeTitle} | Caro Bara Smart Print`,
    description: localizedDescription || "اختر الخدمة المناسبة لطلبك في برلين.",
    keywords: [
      `${safeTitle} برلين`,
      "طباعة برلين",
      "إعلان برلين",
      "خدمات برلين",
    ],
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { categoryId } = params;

  const deSeo = buildCategorySeo(categoryId, "de");
  const enSeo = buildCategorySeo(categoryId, "en");
  const arSeo = buildCategorySeo(categoryId, "ar");

  const canonicalPath = `/request/category/${categoryId}`;

  return {
    metadataBase: new URL(siteUrl),
    title: deSeo.title,
    description: deSeo.description,
    keywords: Array.from(
      new Set([...deSeo.keywords, ...enSeo.keywords, ...arSeo.keywords])
    ),
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: canonicalPath,
        en: canonicalPath,
        ar: canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      title: deSeo.title,
      description: deSeo.description,
      url: canonicalPath,
      siteName: "Caro Bara Smart Print",
      type: "website",
      locale: "de_DE",
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

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}