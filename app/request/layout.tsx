import type { Metadata } from "next";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Smart Print Request System in Berlin | Caro Bara Smart Print",
  description:
    "Start your print, signage, packaging, textile, branding, and production request in Berlin through a smart structured system that helps turn unclear ideas into clear execution-ready orders.",
  keywords: [
    "druckerei berlin",
    "smart request berlin",
    "print request berlin",
    "signage berlin",
    "werbung berlin",
    "schilder berlin",
    "visitenkarten druck berlin",
    "textildruck berlin",
    "branding berlin",
    "printing service berlin",
    "طلب طباعة برلين",
    "لوحات برلين",
    "إعلان برلين",
    "مطبعة برلين",
  ],
  openGraph: {
    title: "Smart Print Request System in Berlin | Caro Bara Smart Print",
    description:
      "A structured smart request system for print, signage, branding, packaging, and production services in Berlin.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Print Request System in Berlin | Caro Bara Smart Print",
    description:
      "Start your request through a smart structured system for print and signage services in Berlin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RequestLayout({ children }: Props) {
  return <>{children}</>;
}