"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { CSSProperties } from "react";
import Header from "@/components/Header";
import CartPopup from "@/components/CartPopup";
import { getServiceById } from "@/data/services/index";
import { useLanguage } from "@/lib/languageContext";

export default function ServicePage() {
  const params = useParams();
  const serviceId = String(params?.serviceId || "");

  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const service = getServiceById(serviceId);
  const isSignage = service?.id === "signage";
  const isOpenRequest = service?.id === "open-request";
  const isCommercialPrinting = service?.id === "commercial-printing";

  const text = {
    badge:
      language === "ar"
        ? "نموذج الطلب"
        : language === "de"
          ? "Anfrageformular"
          : "Request Form",

    fallbackTitle:
      language === "ar"
        ? "الخدمة غير موجودة"
        : language === "de"
          ? "Service nicht gefunden"
          : "Service not found",

    fallbackDescription:
      language === "ar"
        ? "تعذر العثور على هذه الخدمة. يمكنك الرجوع واختيار خدمة أخرى."
        : language === "de"
          ? "Dieser Service wurde nicht gefunden. Bitte gehe zurück und wähle einen anderen Service."
          : "This service could not be found. Please go back and choose another service.",

    start:
      language === "ar"
        ? "ابدأ الطلب الآن"
        : language === "de"
          ? "Jetzt Anfrage starten"
          : "Start Request Now",

    summaryBadge:
      language === "ar"
        ? "ما الذي سنحتاجه منك؟"
        : language === "de"
          ? "Was wir von dir brauchen"
          : "What We Need From You",

    summaryTitle:
      language === "ar"
        ? "فهم الطلب قبل التنفيذ"
        : language === "de"
          ? "Anfrage richtig vorbereiten"
          : "Prepare the Request Properly",

    defaultIntro:
      language === "ar"
        ? "سنأخذ منك المعلومات الأساسية التي تساعدنا على فهم الطلب بشكل صحيح، ثم يمكنك الانتقال إلى النموذج المخصص وإدخال التفاصيل."
        : language === "de"
          ? "Wir erfassen zuerst die wichtigsten Informationen, um deine Anfrage richtig zu verstehen. Danach kannst du zum passenden Formular wechseln und die Details eingeben."
          : "We first collect the essential information needed to understand your request properly, then you can continue to the dedicated form and enter the details.",

    quickStartTitle:
      language === "ar"
        ? "الخطوة التالية"
        : language === "de"
          ? "Nächster Schritt"
          : "Next Step",

    quickStartText:
      language === "ar"
        ? "بعد الدخول إلى النموذج ستتمكن من إدخال تفاصيل الطلب بدقة، ثم إضافته إلى السلة أو متابعة الإرسال."
        : language === "de"
          ? "Nach dem Öffnen des Formulars kannst du die Anfrage präzise eingeben und anschließend zum Warenkorb oder zum Versand weitergehen."
          : "After opening the form, you will be able to enter the request details accurately and then proceed to cart or submission.",
  };

  const signageContent = {
    title:
      language === "ar"
        ? "لوحات المحلات والإضاءات في برلين"
        : language === "de"
          ? "Schilder & Lichtwerbung in Berlin"
          : "Signs & Light Advertising in Berlin",

    description:
      language === "ar"
        ? "حلول احترافية للوحات المحلات، الحروف البارزة، والإضاءات التجارية في برلين. أرسل فكرتك حتى لو كانت غير مكتملة، وسنحوّلها إلى طلب واضح وجاهز للتنفيذ."
        : language === "de"
          ? "Professionelle Lösungen für Geschäftsschilder, Profilbuchstaben und Lichtwerbung in Berlin. Sende deine Anfrage auch dann, wenn noch nicht alle Details klar sind – wir strukturieren sie für die saubere Umsetzung."
          : "Professional solutions for shop signs, raised letters, and light advertising in Berlin. Send your request even if not all details are clear yet — we will structure it into a clean, execution-ready order.",

    intro:
      language === "ar"
        ? "في هذه الخدمة نساعدك على تحويل فكرة اللوحة أو الواجهة إلى طلب منظم وواضح. لا تحتاج لمعرفة كل التفاصيل الفنية من البداية، فقط أدخل ما تعرفه وسنراجع النواقص ونرتب الطلب بالشكل الصحيح."
        : language === "de"
          ? "Mit diesem Service helfen wir dir, deine Idee für ein Schild oder eine Werbeanlage in eine klare und strukturierte Anfrage zu verwandeln. Du musst nicht alle technischen Details kennen – gib einfach an, was du bereits weißt, und wir ergänzen den Rest sinnvoll."
          : "With this service, we help you turn your sign or storefront idea into a clear and structured request. You do not need to know all technical details from the start — just provide what you know, and we will organize the rest properly.",

    quickStartText:
      language === "ar"
        ? "أدخل ما تعرفه عن المقاس، نوع اللوحة، مكان التركيب أو الإضاءة. وإذا كانت بعض التفاصيل غير واضحة، اتركها لنا لنرتبها معك داخل الطلب."
        : language === "de"
          ? "Trage ein, was du bereits über Maße, Schildart, Montageort oder Beleuchtung weißt. Wenn dir noch Details fehlen, ist das kein Problem – wir klären und strukturieren die Anfrage gemeinsam."
          : "Enter whatever you already know about size, sign type, installation location, or lighting. If some details are still missing, that is completely fine — we will clarify and structure the request with you.",
  };

  const openRequestContent = {
    title:
      language === "ar"
        ? "الطلب الذكي المفتوح"
        : language === "de"
          ? "Offene intelligente Anfrage"
          : "Smart Open Request",

    description:
      language === "ar"
        ? "هذه هي نقطة البداية الصحيحة عندما تكون فكرتك أو حاجتك غير واضحة بالكامل. اكتب ما تعرفه فقط، وسنساعدك على تنظيم الطلب واكتشاف النواقص وتوجيهه إلى المسار المناسب."
        : language === "de"
          ? "Das ist der richtige Einstieg, wenn deine Idee oder dein Bedarf noch nicht vollständig klar ist. Gib einfach an, was du bereits weißt, und wir helfen dir dabei, die Anfrage zu strukturieren, Lücken zu erkennen und sie in den passenden Weg zu leiten."
          : "This is the right starting point when your idea or need is not yet fully clear. Just enter what you already know, and we will help structure the request, identify missing parts, and guide it into the right path.",

    intro:
      language === "ar"
        ? "في هذه الخدمة لا تحتاج لمعرفة اسم الخدمة الصحيحة أو كل التفاصيل الفنية من البداية. إذا كان لديك مشروع جديد، فكرة غير مرتبة، مكان يحتاج تجهيز، أو حاجة عامة لا تعرف من أين تبدأ فيها، فهذا هو النموذج المناسب. نحن سنأخذ ما تكتبه ونحوّله إلى طلب احترافي واضح."
        : language === "de"
          ? "Bei diesem Service musst du weder den genauen Servicenamen noch alle technischen Details von Anfang an kennen. Wenn du ein neues Projekt, eine noch unstrukturierte Idee, einen Ort mit Umsetzungsbedarf oder eine allgemeine Anfrage hast und nicht weißt, wo du anfangen sollst, ist dieses Formular der richtige Einstieg. Wir verwandeln deine Angaben in eine klare professionelle Anfrage."
          : "With this service, you do not need to know the exact service name or all technical details from the start. If you have a new project, an unstructured idea, a place that needs setup, or a general need and do not know where to begin, this is the right form. We will turn what you provide into a clear professional request.",

    quickStartText:
      language === "ar"
        ? "اكتب بحرية نوع المشروع، ما الذي تحتاجه تقريبًا، وما الهدف الذي تريد الوصول إليه. وإذا كانت لديك صور أو ملفات أو أمثلة، فذلك يساعدنا على فهم الطلب بشكل أسرع."
        : language === "de"
          ? "Beschreibe frei die Art des Projekts, was du ungefähr brauchst und welches Ziel du erreichen möchtest. Wenn du Fotos, Dateien oder Referenzen hast, hilft uns das dabei, die Anfrage schneller zu verstehen."
          : "Write freely about the type of project, what you roughly need, and what goal you want to achieve. If you have photos, files, or references, that helps us understand the request faster.",
  };

  const commercialPrintingContent = {
    title:
      language === "ar"
        ? "الطباعة الورقية والتجارية في برلين"
        : language === "de"
          ? "Papierdruck in Berlin"
          : "Paper Printing in Berlin",

    description:
      language === "ar"
        ? "حلول واسعة للطباعة الورقية تشمل بطاقات الأعمال، الفلايرات، البروشورات، المنيوهات، البوسترات، الكتب، الكتالوجات، الأوراق الرسمية، وغيرها من المطبوعات التجارية والشخصية في برلين."
        : language === "de"
          ? "Breite Papierdruck-Lösungen in Berlin für Visitenkarten, Flyer, Broschüren, Speisekarten, Poster, Bücher, Kataloge, Briefpapier und weitere geschäftliche oder individuelle Druckprodukte."
          : "Broad paper printing solutions in Berlin for business cards, flyers, brochures, menus, posters, books, catalogs, letterheads, and other commercial or custom print products.",

    intro:
      language === "ar"
        ? "في هذه الخدمة يمكنك البدء بأي طلب طباعة ورقية تقريبًا، حتى لو لم يكن المنتج موجودًا حرفيًا في القائمة. إذا كنت تريد بطاقات، منيوهات، فلايرات، ملفات شركات، مطبوعات افتتاح، كتب، كتالوجات، أو أي منتج ورقي آخر، فهذا هو المسار الصحيح. فقط أدخل ما تعرفه عن المنتج وسنساعدك على تنظيم التفاصيل واختيار الأنسب."
        : language === "de"
          ? "Mit diesem Service kannst du fast jede Papierdruck-Anfrage starten – auch wenn das gewünschte Produkt nicht exakt in der Liste steht. Ob Visitenkarten, Speisekarten, Flyer, Mappen, Eröffnungsdrucksachen, Bücher, Kataloge oder ein anderes Druckprodukt: Das ist der richtige Einstieg. Gib einfach an, was du bereits weißt, und wir helfen dir bei der Strukturierung."
          : "With this service, you can start almost any paper printing request, even if the exact product is not listed. Whether you need business cards, menus, flyers, company folders, opening print materials, books, catalogs, or another print product, this is the right entry point. Just enter what you already know and we will help structure the details.",

    quickStartText:
      language === "ar"
        ? "اختر أقرب نوع منتج، ثم أضف ما تعرفه عن المقاس، الكمية، الورق، الألوان أو التشطيب. وإذا لم تكن متأكدًا من بعض المواصفات، اتركها لنا وسنقترح الأنسب حسب نوع المطبوع واستعماله."
        : language === "de"
          ? "Wähle den Produkttyp, der deiner Anfrage am nächsten kommt, und ergänze dann, was du bereits über Format, Menge, Papier, Farben oder Veredelung weißt. Wenn dir einzelne Spezifikationen noch fehlen, ist das kein Problem – wir schlagen die passende Lösung vor."
          : "Choose the product type that is closest to your request, then add what you already know about size, quantity, paper, colors, or finishing. If some specifications are still unclear, that is completely fine — we will suggest the best option based on the print product and its use.",
  };

  const localizedTitle =
    (isCommercialPrinting
      ? commercialPrintingContent.title
      : isOpenRequest
        ? openRequestContent.title
        : isSignage
          ? signageContent.title
          : service?.title?.[language] ||
            service?.title?.en ||
            service?.title?.de ||
            service?.title?.ar) || serviceId;

  const localizedDescription =
    (isCommercialPrinting
      ? commercialPrintingContent.description
      : isOpenRequest
        ? openRequestContent.description
        : isSignage
          ? signageContent.description
          : service?.description?.[language] ||
            service?.description?.en ||
            service?.description?.de ||
            service?.description?.ar) || "";

  const localizedIntro =
    (isCommercialPrinting
      ? commercialPrintingContent.intro
      : isOpenRequest
        ? openRequestContent.intro
        : isSignage
          ? signageContent.intro
          : service?.intro?.[language] ||
            service?.intro?.en ||
            service?.intro?.de ||
            service?.intro?.ar) || text.defaultIntro;

  const localizedQuickStartText = isCommercialPrinting
    ? commercialPrintingContent.quickStartText
    : isOpenRequest
      ? openRequestContent.quickStartText
      : isSignage
        ? signageContent.quickStartText
        : text.quickStartText;

  const guidanceItems =
    service?.requestGuidance
      ?.map((item) => item[language] || item.en || item.de || item.ar || "")
      .filter(Boolean) || [];

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f2e9de 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "980px",
      margin: "14px auto 0",
    },

    heroCard: {
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "26px",
      padding: "24px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
    },

    badge: {
      display: "inline-block",
      marginBottom: "12px",
      padding: "7px 13px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
    },

    title: {
      margin: "0 0 12px",
      fontSize: "clamp(28px, 6vw, 42px)",
      fontWeight: 800,
      color: "#2f2419",
      lineHeight: 1.2,
      textAlign: isArabic ? "right" : "left",
    },

    description: {
      margin: 0,
      fontSize: "15px",
      lineHeight: 1.9,
      color: "#5b4b3c",
      textAlign: isArabic ? "right" : "left",
    },

    sectionCard: {
      marginTop: "16px",
      background: "rgba(255,255,255,0.88)",
      border: "1px solid #e7d9c8",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
    },

    sectionHeader: {
      marginBottom: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #eadbc9",
    },

    sectionBadge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#f3e7d8",
      color: "#6b5238",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #dec8ae",
    },

    sectionTitle: {
      margin: "0 0 8px",
      fontSize: "18px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
      textAlign: isArabic ? "right" : "left",
    },

    sectionText: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#645240",
      textAlign: isArabic ? "right" : "left",
    },

    guidanceList: {
      margin: "14px 0 0",
      paddingInlineStart: "20px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#6b5846",
      textAlign: isArabic ? "right" : "left",
    },

    actionCard: {
      marginTop: "16px",
      background: "#fffaf4",
      border: "1px solid #e3d4c2",
      borderRadius: "22px",
      padding: "18px 16px",
      boxShadow: "0 8px 24px rgba(96, 73, 46, 0.06)",
    },

    actionTitle: {
      margin: "0 0 8px",
      fontSize: "17px",
      fontWeight: 800,
      color: "#2f2419",
      textAlign: isArabic ? "right" : "left",
    },

    actionText: {
      margin: "0 0 16px",
      fontSize: "14px",
      lineHeight: 1.8,
      color: "#5f4d3d",
      textAlign: isArabic ? "right" : "left",
    },

    button: {
      width: "100%",
      minHeight: "50px",
      padding: "12px 18px",
      borderRadius: "16px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 800,
      textAlign: "center",
      textDecoration: "none",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    },
  };

  if (!service) {
    return (
      <div dir={dir} style={styles.page}>
        <Header showBackButton showBackHome backHref="/request" />

        <div style={styles.container}>
          <div style={styles.heroCard}>
            <div style={styles.badge}>{text.badge}</div>
            <h1 style={styles.title}>{text.fallbackTitle}</h1>
            <p style={styles.description}>{text.fallbackDescription}</p>
          </div>

          <CartPopup lang={language} />
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} style={styles.page}>
      <Header
        showBackButton
        showBackHome
        backHref={`/request/category/${service.category}`}
      />

      <div style={styles.container}>
        <div style={styles.heroCard}>
          <div style={styles.badge}>{text.badge}</div>
          <h1 style={styles.title}>{localizedTitle}</h1>
          <p style={styles.description}>{localizedDescription}</p>
        </div>

        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionBadge}>{text.summaryBadge}</div>
            <h2 style={styles.sectionTitle}>{text.summaryTitle}</h2>
            <p style={styles.sectionText}>{localizedIntro}</p>
          </div>

          {guidanceItems.length > 0 && (
            <ul style={styles.guidanceList}>
              {guidanceItems.map((item, index) => (
                <li key={`${service.id}-guidance-${index}`}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>{text.quickStartTitle}</h3>
          <p style={styles.actionText}>{localizedQuickStartText}</p>

          <Link href={`/request/service/${service.id}/form`} style={styles.button}>
            {text.start}
          </Link>
        </div>

        <CartPopup lang={language} />
      </div>
    </div>
  );
}