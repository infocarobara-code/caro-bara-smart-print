import {
  getGuideById,
  getGuideSmartInternalLinks,
  getLocalizedGuideText,
} from "@/data/guides";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GuideCategoryPage({ params }: Props) {
  const { id } = await params;
  const guide = getGuideById(id);

  if (!guide) {
    return <div className="p-10 text-center">Guide not found</div>;
  }

  const lang = "de" as "ar" | "de" | "en"; // لاحقًا نربطها مع languageContext

  const title = getLocalizedGuideText(guide.title, lang);
  const intro = getLocalizedGuideText(guide.intro, lang);
  const expanded = getLocalizedGuideText(guide.expandedGuide, lang);

  const internalLinks = getGuideSmartInternalLinks(id, {
    limit: 6,
  });

  const requestButtonLabel =
    lang === "ar"
      ? "ابدأ الطلب الآن"
      : lang === "de"
        ? "Jetzt Anfrage starten"
        : "Start Request Now";

  const relatedTitle =
    lang === "ar"
      ? "روابط مفيدة"
      : lang === "de"
        ? "Weitere relevante Bereiche"
        : "Related Sections";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-4">{title}</h1>

      <p className="text-gray-600 mb-6 leading-relaxed">{intro}</p>

      <div className="mb-10">
        <Link
          href={`/request/category/${id}`}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm hover:opacity-90 transition"
        >
          {requestButtonLabel}
        </Link>
      </div>

      <div className="mb-10">
        <p className="text-gray-700 leading-relaxed">{expanded}</p>
      </div>

      <div className="border-t pt-6 mt-10">
        <h3 className="text-sm font-semibold mb-3 text-gray-500">
          {relatedTitle}
        </h3>

        <div className="flex flex-wrap gap-3">
          {internalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm text-gray-700 border px-3 py-1 rounded-md hover:bg-gray-100 transition"
            >
              {getLocalizedGuideText(link.label, lang)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}