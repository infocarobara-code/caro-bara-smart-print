import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/languageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.carobara.de"),
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
    type: "website",
    siteName: "Caro Bara Smart Print",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caro Bara Smart Print",
    description:
      "Smart structured request system for print, signage, and production services in Berlin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}