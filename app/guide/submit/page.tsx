"use client";

import GuideLayout from "@/components/guide/GuideLayout";
import { useLanguage } from "@/lib/languageContext";

export default function Page() {
  const { language } = useLanguage();

  const content = {
    ar: {
      title: "البداية من الفكرة",
      description:
        "ابدأ حتى لو لم تكن تعرف كل التفاصيل. يمكنك الانطلاق من فكرة بسيطة وسنقوم بتنظيمها وتحويلها إلى طلب واضح.",
    },
    de: {
      title: "Start mit der Idee",
      description:
        "Beginne auch ohne alle Details. Wir helfen dir, deine Idee in eine klare Anfrage umzuwandeln.",
    },
    en: {
      title: "Start with your idea",
      description:
        "Start even if you don’t know all details. We help turn your idea into a clear request.",
    },
  };

  return (
    <GuideLayout
      title={content[language].title}
      description={content[language].description}
    />
  );
}