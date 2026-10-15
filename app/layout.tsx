import { CategoryProvider } from "@/lib/catalog/context";
import { publishedCategories } from "@/lib/catalog/server";
import { publicCategories } from "@/lib/catalog/model";
import { seoSite } from "@/data/seoSite";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import LegalFooter from "@/components/LegalFooter";
import { LanguageProvider } from "@/lib/languageContext";

export const metadata: Metadata = {
  metadataBase: new URL(seoSite.url),
  title: {
    default: "Caro Bara Smart Print",
    template: "%s | Caro Bara Smart Print",
  },
  description:
    "Caro Bara Smart Print is a structured smart request system for print, signage, branding, packaging, textile, fabrication, and commercial production services in Berlin.",
  keywords: [
    "druckerei berlin",
    "werbung berlin",
    "schilder berlin",
    "lichtwerbung berlin",
    "print service berlin",
    "textildruck berlin",
    "branding berlin",
    "visitenkarten druck berlin",
    "werbetechnik berlin",
    "signage berlin",
    "مطبعة برلين",
    "لوحات برلين",
    "إعلان برلين",
    "طباعة برلين",
  ],
  openGraph: {
    title: "Caro Bara Smart Print",
    description:
      "A smart structured request system for print, signage, branding, packaging, textile, and production services in Berlin.",
    url: seoSite.url,
    siteName: "Caro Bara Smart Print",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: `${seoSite.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Caro Bara Smart Print",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caro Bara Smart Print",
    description:
      "Smart structured request system for print, signage, and production services in Berlin.",
    images: [`${seoSite.url}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categoryContent = publicCategories(await publishedCategories());
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          background: "#f5f1eb",
          boxSizing: "border-box",
        }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${seoSite.companyUrl}#organization`, name: "Caro Bara Werbeagentur", url: seoSite.companyUrl, sameAs: [seoSite.facebook, seoSite.instagram], hasMap: seoSite.maps },
            { "@type": "WebSite", "@id": `${seoSite.url}/#website`, name: seoSite.name, url: seoSite.url, inLanguage: ["de", "ar", "en"], publisher: { "@id": `${seoSite.companyUrl}#organization` } },
          ],
        }).replace(/</g, "\\u003c") }} />
        <CategoryProvider value={categoryContent}><LanguageProvider>{children}<LegalFooter /></LanguageProvider></CategoryProvider>
      </body>
    </html>
  );
}