import type { Language } from "@/lib/i18n";

type AnalysisResult = {
  summary: string;
  missing: string[];
  suggestions: string[];
  score: number;
};

type LocalizedText = {
  unknown: string;
  summaryEmpty: string;
  summaryGeneric: string;
  summaryWithType: string;
  summaryWithSize: string;
  summaryWithQuantity: string;
  summaryWithTypeAndSize: string;
  summaryWithTypeAndQuantity: string;
  summaryFull: string;
  summaryIntentHint: string;

  missingRequired: string;
  missingDescription: string;
  missingDimensions: string;
  missingQuantity: string;
  missingMaterial: string;
  missingDesign: string;
  missingInstallation: string;
  missingFiles: string;
  missingServiceSpecific: string;

  suggestionReference: string;
  suggestionDesignFile: string;
  suggestionSitePhoto: string;
  suggestionQuantity: string;
  suggestionDimensions: string;
  suggestionMaterial: string;
  suggestionInstallation: string;
  suggestionDescription: string;
  suggestionClarifyIntent: string;
  suggestionDesignDecision: string;
  suggestionExecutionContext: string;
};

const text: Record<Language, LocalizedText> = {
  ar: {
    unknown: "غير محدد",
    summaryEmpty: "لم يبدأ تحليل الطلب بعد.",
    summaryGeneric: "تم إدخال بعض المعلومات الأساسية لهذا الطلب.",
    summaryWithType: "نوع الطلب الحالي: {type}.",
    summaryWithSize: "تم تحديد المقاس: {size}.",
    summaryWithQuantity: "تم تحديد الكمية: {quantity}.",
    summaryWithTypeAndSize: "الطلب من نوع {type} وبمقاس {size}.",
    summaryWithTypeAndQuantity: "الطلب من نوع {type} وبكمية {quantity}.",
    summaryFull: "الطلب من نوع {type}، بالمقاس {size}، وبكمية {quantity}.",
    summaryIntentHint:
      "الطلب أصبح أوضح، لكنه ما زال يحتاج بعض التحديدات ليكون جاهزًا للتنفيذ بدقة.",

    missingRequired: "بعض الحقول الأساسية المطلوبة ما زالت ناقصة",
    missingDescription: "الوصف أو التفاصيل الإضافية غير كافية",
    missingDimensions: "المقاسات الأساسية غير مكتملة",
    missingQuantity: "الكمية غير محددة",
    missingMaterial: "نوع المادة غير محدد بوضوح",
    missingDesign: "لم يتم تحديد هل يوجد تصميم جاهز",
    missingInstallation: "لم يتم تحديد هل يلزم تركيب أو تنفيذ موقعي",
    missingFiles: "لا يوجد ملف أو صورة مرجعية حتى الآن",
    missingServiceSpecific: "ما زالت هناك تفاصيل أساسية خاصة بهذا النوع من الطلبات",

    suggestionReference:
      "إضافة ملف أو صورة مرجعية تساعدنا على فهم الطلب بشكل أدق",
    suggestionDesignFile:
      "إذا كان لديك تصميم جاهز، فإرفاقه يسرّع المعالجة والتسعير",
    suggestionSitePhoto:
      "إضافة صورة للموقع أو الواجهة تساعد في فهم ظروف التنفيذ",
    suggestionQuantity:
      "تحديد الكمية بدقة يساعد على إعطاء مسار تنفيذ وتسعير أوضح",
    suggestionDimensions:
      "تحديد المقاسات بدقة يجعل التحليل والتوجيه أكثر واقعية",
    suggestionMaterial:
      "تحديد المادة المطلوبة يساعدنا على اقتراح الحل الأنسب",
    suggestionInstallation:
      "تحديد الحاجة إلى التركيب أو التنفيذ الموقعي يوضح نطاق الطلب",
    suggestionDescription:
      "أضف وصفًا أوضح لفكرتك أو الهدف من الطلب للحصول على تحليل أدق",
    suggestionClarifyIntent:
      "حدّد المقصود النهائي من الطلب بشكل أوضح: تصميم فقط، طباعة فقط، تصنيع، تركيب، أو حل متكامل",
    suggestionDesignDecision:
      "وضّح هل تريد التصميم من طرفنا أم لديك ملف جاهز بالفعل",
    suggestionExecutionContext:
      "إضافة تفاصيل عن مكان الاستخدام أو طبيعة المشروع تساعد في توجيه الطلب بشكل أذكى",
  },
  de: {
    unknown: "nicht angegeben",
    summaryEmpty: "Die Analyse der Anfrage hat noch nicht begonnen.",
    summaryGeneric:
      "Einige grundlegende Informationen für diese Anfrage wurden eingegeben.",
    summaryWithType: "Aktuelle Anfrageart: {type}.",
    summaryWithSize: "Format/Maß wurde angegeben: {size}.",
    summaryWithQuantity: "Menge wurde angegeben: {quantity}.",
    summaryWithTypeAndSize:
      "Die Anfrage ist vom Typ {type} im Format/Maß {size}.",
    summaryWithTypeAndQuantity:
      "Die Anfrage ist vom Typ {type} mit Menge {quantity}.",
    summaryFull:
      "Die Anfrage ist vom Typ {type}, im Format/Maß {size}, mit Menge {quantity}.",
    summaryIntentHint:
      "Die Anfrage ist bereits klarer, benötigt aber noch einige Präzisierungen für eine saubere Umsetzung.",

    missingRequired: "Einige grundlegende Pflichtfelder fehlen noch",
    missingDescription:
      "Beschreibung oder zusätzliche Details sind noch nicht ausreichend",
    missingDimensions: "Die Grundmaße sind noch nicht vollständig",
    missingQuantity: "Die Menge ist nicht angegeben",
    missingMaterial: "Das Material ist nicht klar angegeben",
    missingDesign:
      "Es ist nicht angegeben, ob ein fertiges Design vorhanden ist",
    missingInstallation:
      "Es ist nicht angegeben, ob Montage oder Vor-Ort-Ausführung benötigt wird",
    missingFiles:
      "Es wurde noch keine Referenzdatei oder kein Referenzbild hinzugefügt",
    missingServiceSpecific:
      "Es fehlen noch einige zentrale Details für diese Anfrageart",

    suggestionReference:
      "Eine Referenzdatei oder ein Referenzbild hilft uns, die Anfrage genauer zu verstehen",
    suggestionDesignFile:
      "Wenn bereits ein fertiges Design vorhanden ist, beschleunigt das den Ablauf und die Kalkulation",
    suggestionSitePhoto:
      "Ein Foto vom Standort oder von der Fassade hilft bei der Einschätzung der Umsetzung",
    suggestionQuantity:
      "Eine genaue Mengenangabe verbessert Analyse und Preisfindung",
    suggestionDimensions:
      "Genaue Maße machen Analyse und Weiterleitung realistischer",
    suggestionMaterial:
      "Die Angabe des Materials hilft uns, die passende Lösung vorzuschlagen",
    suggestionInstallation:
      "Die Angabe, ob Montage nötig ist, klärt den Umfang der Anfrage",
    suggestionDescription:
      "Füge eine klarere Beschreibung deiner Idee oder deines Ziels hinzu, um eine genauere Analyse zu erhalten",
    suggestionClarifyIntent:
      "Präzisiere das eigentliche Ziel der Anfrage: nur Design, nur Druck, Fertigung, Montage oder Komplettlösung",
    suggestionDesignDecision:
      "Gib an, ob du das Design von uns brauchst oder bereits eine fertige Datei hast",
    suggestionExecutionContext:
      "Mehr Details zum Einsatzort oder zur Art des Projekts helfen bei einer intelligenteren Weiterleitung",
  },
  en: {
    unknown: "not specified",
    summaryEmpty: "The request analysis has not started yet.",
    summaryGeneric: "Some basic information has been entered for this request.",
    summaryWithType: "Current request type: {type}.",
    summaryWithSize: "Size/dimensions provided: {size}.",
    summaryWithQuantity: "Quantity provided: {quantity}.",
    summaryWithTypeAndSize: "The request is for {type} with size {size}.",
    summaryWithTypeAndQuantity:
      "The request is for {type} with quantity {quantity}.",
    summaryFull:
      "The request is for {type}, with size {size}, and quantity {quantity}.",
    summaryIntentHint:
      "The request is becoming clearer, but it still needs a few more details for accurate execution.",

    missingRequired: "Some required core fields are still missing",
    missingDescription:
      "The description or additional details are still not sufficient",
    missingDimensions: "The core dimensions are incomplete",
    missingQuantity: "The quantity is not specified",
    missingMaterial: "The material is not clearly specified",
    missingDesign: "It is not specified whether a ready design exists",
    missingInstallation:
      "It is not specified whether installation or on-site execution is needed",
    missingFiles: "No reference file or image has been added yet",
    missingServiceSpecific:
      "Some important details for this request type are still missing",

    suggestionReference:
      "Adding a reference file or image helps us understand the request more accurately",
    suggestionDesignFile:
      "If you already have a ready design, attaching it speeds up review and pricing",
    suggestionSitePhoto:
      "Adding a site or facade photo helps us understand execution conditions better",
    suggestionQuantity:
      "Specifying the quantity clearly improves analysis and pricing direction",
    suggestionDimensions:
      "Providing exact dimensions makes the analysis and routing more realistic",
    suggestionMaterial:
      "Specifying the material helps us suggest the most suitable solution",
    suggestionInstallation:
      "Specifying whether installation is needed clarifies the scope of the request",
    suggestionDescription:
      "Add a clearer description of your idea or request goal for a more accurate analysis",
    suggestionClarifyIntent:
      "Clarify the final intent of the request: design only, printing only, fabrication, installation, or a complete solution",
    suggestionDesignDecision:
      "Clarify whether you need us to design it or already have a ready file",
    suggestionExecutionContext:
      "Adding usage context or project context helps route the request more intelligently",
  },
};

type ServiceProfile = {
  dimensionIds: string[];
  quantityIds: string[];
  materialIds: string[];
  descriptionIds: string[];
  designIds: string[];
  installationIds: string[];
  referenceIds: string[];
  intentIds: string[];
  extraRequiredChecks?: Array<(data: Record<string, string>) => boolean>;
};

const baseProfile: ServiceProfile = {
  dimensionIds: [
    "size",
    "dimensions",
    "width",
    "height",
    "depth",
    "vehicleSize",
    "stampSize",
  ],
  quantityIds: ["quantity", "qty", "numberOfPieces"],
  materialIds: ["material", "paperType", "fabricType", "surfaceFinish"],
  descriptionIds: ["notes", "vision", "textContent", "details", "message", "description"],
  designIds: ["designReady", "hasReference"],
  installationIds: [
    "installation",
    "siteVisit",
    "needSiteVisit",
    "needMeasurements",
    "usagePlace",
  ],
  referenceIds: ["referenceFile", "sitePhoto", "fileUpload"],
  intentIds: [
    "signType",
    "productType",
    "menuType",
    "packageType",
    "stampType",
    "cardFormat",
    "vehicleType",
    "projectType",
    "businessType",
    "wrapType",
    "workType",
    "serviceType",
    "garmentType",
    "projectName",
    "usage",
  ],
};

const serviceProfiles: Partial<Record<string, Partial<ServiceProfile>>> = {
  "open-request": {
    descriptionIds: ["vision", "notes", "details", "message", "projectType"],
    intentIds: ["projectType", "businessType", "needs"],
  },
  signage: {
    dimensionIds: ["width", "height", "depth", "size", "dimensions"],
    materialIds: ["material", "surfaceFinish"],
    installationIds: ["installation", "siteVisit", "usagePlace"],
    intentIds: ["signType", "projectStage", "usagePlace"],
    extraRequiredChecks: [
      (data) => !isAffirmativeValue(data.lighting) || hasValue(data.lightType),
    ],
  },
  "window-graphics": {
    dimensionIds: ["size", "dimensions", "width", "height"],
    installationIds: ["installation"],
    intentIds: ["productType"],
  },
  "vehicle-branding": {
    dimensionIds: ["vehicleSize", "size", "dimensions"],
    installationIds: ["oldWrapRemoval"],
    intentIds: ["vehicleType", "wrapType"],
  },
  "commercial-printing": {
    dimensionIds: ["cardFormat", "size", "dimensions"],
    materialIds: ["paperWeight", "material"],
    intentIds: ["cardFormat", "printSides", "printColors"],
  },
  "business-printing": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["paperType", "material"],
    intentIds: ["productType", "foldType", "printingSides"],
  },
  "menu-printing": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["paperType", "material"],
    intentIds: ["menuType", "usageLevel", "languageCount"],
  },
  "poster-printing": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["paperType", "material"],
    installationIds: ["usagePlace"],
    intentIds: ["size", "usagePlace"],
  },
  "letterhead-envelopes": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["material"],
    intentIds: ["productType", "printColors"],
  },
  stamps: {
    dimensionIds: ["stampSize", "size", "dimensions"],
    intentIds: ["stampType", "stampShape", "inkColor"],
    descriptionIds: ["textContent", "notes"],
  },
  "stickers-labels": {
    dimensionIds: ["size", "dimensions", "shape"],
    materialIds: ["material", "lamination"],
    intentIds: ["stickerType", "shape", "lamination"],
  },
  packaging: {
    dimensionIds: ["dimensions", "size"],
    materialIds: ["material"],
    intentIds: ["packageType", "productType", "printingNeeded", "sampleNeeded"],
  },
  "textile-printing": {
    dimensionIds: ["size", "dimensions", "sizes"],
    materialIds: ["fabricType", "color", "colors"],
    intentIds: ["productType", "garmentType", "printMethod", "printPositions"],
  },
  "promotional-items": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["material"],
    intentIds: ["productType", "printType"],
  },
  "event-printing": {
    dimensionIds: ["size", "dimensions"],
    materialIds: ["material"],
    installationIds: ["installation"],
    intentIds: ["productType", "eventDate"],
  },
  "branding-design": {
    descriptionIds: ["notes", "vision", "businessType", "targetAudience"],
    intentIds: ["businessType", "neededItems", "projectStage"],
  },
  "logo-design-only": {
    descriptionIds: ["notes", "style", "usage", "colors"],
    intentIds: ["productType", "projectName", "style", "usage"],
  },
};

function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(.*?)\}/g, (_, key) => values[key] ?? "");
}

function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[():،؛,.]+/g, "")
    .trim();
}

function normalize(value: string | undefined) {
  return normalizeText(value);
}

function isNegativeOrUnknownValue(value: string | undefined) {
  const v = normalize(value);

  return [
    "",
    "not-sure",
    "not sure",
    "unknown",
    "none",
    "n/a",
    "na",
    "غير متأكد",
    "غير مؤكد",
    "غير محدد",
    "لا اعرف",
    "لا أعرف",
    "بدون",
    "غير واضح",
    "ليس متأكد",
    "nicht sicher",
    "unbekannt",
    "keine",
    "ohne",
    "unsure",
    "no idea",
  ].includes(v);
}

function isMeaningfulValue(value: string | undefined) {
  return hasValue(value) && !isNegativeOrUnknownValue(value);
}

function isAffirmativeValue(value: string | undefined) {
  const v = normalize(value);

  return ["yes", "ja", "نعم", "true", "1", "vorhanden", "ready"].includes(v);
}

function isNegativeValue(value: string | undefined) {
  const v = normalize(value);

  return ["no", "nein", "لا", "false", "0"].includes(v);
}

function findFirstValue(data: Record<string, string>, ids: string[]) {
  for (const id of ids) {
    if (hasValue(data[id])) return data[id];
  }
  return "";
}

function hasAnyField(data: Record<string, string>, ids: string[]) {
  return ids.some((id) => hasValue(data[id]));
}

function countFilled(data: Record<string, string>) {
  return Object.values(data).filter((value) => hasValue(value)).length;
}

function pushUnique(arr: string[], value: string) {
  if (!arr.includes(value)) arr.push(value);
}

function getDescriptionLength(value: string | undefined) {
  return String(value ?? "").trim().length;
}

function mergeProfile(serviceId: string): ServiceProfile {
  const custom = serviceProfiles[serviceId] || {};

  return {
    dimensionIds: custom.dimensionIds || baseProfile.dimensionIds,
    quantityIds: custom.quantityIds || baseProfile.quantityIds,
    materialIds: custom.materialIds || baseProfile.materialIds,
    descriptionIds: custom.descriptionIds || baseProfile.descriptionIds,
    designIds: custom.designIds || baseProfile.designIds,
    installationIds: custom.installationIds || baseProfile.installationIds,
    referenceIds: custom.referenceIds || baseProfile.referenceIds,
    intentIds: custom.intentIds || baseProfile.intentIds,
    extraRequiredChecks: custom.extraRequiredChecks || [],
  };
}

function inferIntentQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.intentIds);

  if (isMeaningfulValue(value)) return 2;

  const richSignals =
    hasAnyField(data, profile.descriptionIds) ||
    hasAnyField(data, profile.dimensionIds) ||
    hasAnyField(data, profile.materialIds);

  return richSignals ? 1 : 0;
}

function inferDimensionQuality(data: Record<string, string>, profile: ServiceProfile) {
  const explicitPair = hasValue(data.width) && hasValue(data.height);
  const direct = findFirstValue(data, profile.dimensionIds);

  if (explicitPair) return 2;
  if (isMeaningfulValue(direct)) return 2;
  if (hasAnyField(data, profile.dimensionIds)) return 1;
  return 0;
}

function inferQuantityQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.quantityIds);

  if (!hasAnyField(data, profile.quantityIds)) return 0;
  if (!hasValue(value)) return 1;

  const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isFinite(numeric) && numeric > 0) return 2;

  return isMeaningfulValue(value) ? 1 : 0;
}

function inferMaterialQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.materialIds);

  if (!hasAnyField(data, profile.materialIds)) return 0;
  if (isMeaningfulValue(value)) return 2;
  return 1;
}

function inferDescriptionQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.descriptionIds);
  const length = getDescriptionLength(value);

  if (!hasAnyField(data, profile.descriptionIds)) return 0;
  if (length >= 40) return 2;
  if (length >= 12) return 1;
  return 0;
}

function inferDesignQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.designIds);

  if (!hasAnyField(data, profile.designIds)) return 0;
  if (isAffirmativeValue(value) || isNegativeValue(value)) return 2;
  if (hasValue(value)) return 1;
  return 0;
}

function inferInstallationQuality(data: Record<string, string>, profile: ServiceProfile) {
  const value = findFirstValue(data, profile.installationIds);

  if (!hasAnyField(data, profile.installationIds)) return 0;
  if (
    isAffirmativeValue(value) ||
    isNegativeValue(value) ||
    isMeaningfulValue(value)
  ) {
    return 2;
  }
  return 1;
}

function inferReferenceQuality(data: Record<string, string>, profile: ServiceProfile) {
  if (!hasAnyField(data, profile.referenceIds)) return 0;

  const hasRealReference = profile.referenceIds.some((id) =>
    isMeaningfulValue(data[id])
  );
  return hasRealReference ? 2 : 1;
}

function buildSummary(
  t: LocalizedText,
  typeValue: string,
  sizeValue: string,
  quantityValue: string,
  score: number,
  filledCount: number
) {
  let summary = t.summaryGeneric;

  if (typeValue && sizeValue && quantityValue) {
    summary = format(t.summaryFull, {
      type: typeValue,
      size: sizeValue,
      quantity: quantityValue,
    });
  } else if (typeValue && sizeValue) {
    summary = format(t.summaryWithTypeAndSize, {
      type: typeValue,
      size: sizeValue,
    });
  } else if (typeValue && quantityValue) {
    summary = format(t.summaryWithTypeAndQuantity, {
      type: typeValue,
      quantity: quantityValue,
    });
  } else if (typeValue) {
    summary = format(t.summaryWithType, {
      type: typeValue,
    });
  } else if (sizeValue) {
    summary = format(t.summaryWithSize, {
      size: sizeValue,
    });
  } else if (quantityValue) {
    summary = format(t.summaryWithQuantity, {
      quantity: quantityValue,
    });
  }

  if (score < 60 && filledCount > 0) {
    summary = `${summary} ${t.summaryIntentHint}`;
  }

  return summary;
}

export function analyzeRequest(
  serviceId: string,
  data: Record<string, string>,
  lang: Language
): AnalysisResult {
  const t = text[lang];
  const profile = mergeProfile(serviceId);
  const missing: string[] = [];
  const suggestions: string[] = [];

  const typeValue = findFirstValue(data, profile.intentIds);
  const sizeValue = findFirstValue(data, profile.dimensionIds);
  const quantityValue = findFirstValue(data, profile.quantityIds);
  const materialValue = findFirstValue(data, profile.materialIds);
  const designReadyValue = findFirstValue(data, profile.designIds);
  const installationValue = findFirstValue(data, profile.installationIds);
  const descriptionValue = findFirstValue(data, profile.descriptionIds);

  const filledCount = countFilled(data);
  const descriptionLength = getDescriptionLength(descriptionValue);

  if (filledCount === 0) {
    return {
      summary: t.summaryEmpty,
      missing: [],
      suggestions: [t.suggestionDescription, t.suggestionClarifyIntent],
      score: 0,
    };
  }

  const intentQuality = inferIntentQuality(data, profile);
  const dimensionQuality = inferDimensionQuality(data, profile);
  const quantityQuality = inferQuantityQuality(data, profile);
  const materialQuality = inferMaterialQuality(data, profile);
  const descriptionQuality = inferDescriptionQuality(data, profile);
  const designQuality = inferDesignQuality(data, profile);
  const installationQuality = inferInstallationQuality(data, profile);
  const referenceQuality = inferReferenceQuality(data, profile);

  const scoringBuckets = [
    { weight: 18, quality: intentQuality },
    { weight: 16, quality: dimensionQuality },
    { weight: 14, quality: quantityQuality },
    { weight: 10, quality: materialQuality },
    { weight: 14, quality: descriptionQuality },
    { weight: 10, quality: designQuality },
    { weight: 8, quality: installationQuality },
    { weight: 10, quality: referenceQuality },
  ];

  let score = Math.round(
    scoringBuckets.reduce((total, bucket) => {
      return total + bucket.weight * (bucket.quality / 2);
    }, 0)
  );

  score = Math.max(0, Math.min(100, score));

  if (filledCount <= 2) {
    score = Math.min(score, 35);
  }

  if (intentQuality === 0) {
    pushUnique(missing, t.missingRequired);
    pushUnique(suggestions, t.suggestionClarifyIntent);
  } else if (intentQuality === 1) {
    pushUnique(suggestions, t.suggestionClarifyIntent);
  }

  if (descriptionQuality === 0) {
    if (filledCount >= 2 || serviceId === "open-request") {
      pushUnique(missing, t.missingDescription);
    }
    pushUnique(suggestions, t.suggestionDescription);
  } else if (descriptionQuality === 1) {
    pushUnique(suggestions, t.suggestionDescription);
  }

  if (dimensionQuality === 0) {
    if (
      ["signage", "window-graphics", "vehicle-branding", "commercial-printing", "business-printing", "menu-printing", "poster-printing", "stickers-labels", "packaging", "textile-printing", "promotional-items", "event-printing", "stamps"].includes(
        serviceId
      )
    ) {
      pushUnique(missing, t.missingDimensions);
      pushUnique(suggestions, t.suggestionDimensions);
    }
  } else if (dimensionQuality === 1) {
    pushUnique(missing, t.missingDimensions);
    pushUnique(suggestions, t.suggestionDimensions);
  }

  if (quantityQuality === 0) {
    pushUnique(missing, t.missingQuantity);
    pushUnique(suggestions, t.suggestionQuantity);
  } else if (quantityQuality === 1) {
    pushUnique(missing, t.missingQuantity);
    pushUnique(suggestions, t.suggestionQuantity);
  }

  if (materialQuality === 0) {
    if (
      ["signage", "commercial-printing", "business-printing", "menu-printing", "poster-printing", "letterhead-envelopes", "stickers-labels", "packaging", "textile-printing", "promotional-items", "event-printing"].includes(
        serviceId
      )
    ) {
      pushUnique(missing, t.missingMaterial);
      pushUnique(suggestions, t.suggestionMaterial);
    }
  } else if (materialQuality === 1) {
    pushUnique(missing, t.missingMaterial);
    pushUnique(suggestions, t.suggestionMaterial);
  }

  if (designQuality === 0) {
    pushUnique(missing, t.missingDesign);
    pushUnique(suggestions, t.suggestionDesignDecision);
  } else if (designQuality === 1) {
    pushUnique(missing, t.missingDesign);
    pushUnique(suggestions, t.suggestionDesignDecision);
  }

  if (installationQuality === 0) {
    if (
      ["signage", "window-graphics", "vehicle-branding", "event-printing", "sign-installation-maintenance"].includes(
        serviceId
      )
    ) {
      pushUnique(missing, t.missingInstallation);
      pushUnique(suggestions, t.suggestionInstallation);
    }
  } else if (installationQuality === 1) {
    pushUnique(missing, t.missingInstallation);
    pushUnique(suggestions, t.suggestionInstallation);
  }

  if (referenceQuality === 0) {
    pushUnique(missing, t.missingFiles);
    pushUnique(suggestions, t.suggestionReference);
  } else if (referenceQuality === 1) {
    pushUnique(missing, t.missingFiles);
    pushUnique(suggestions, t.suggestionReference);
  }

  if (
    isAffirmativeValue(designReadyValue) &&
    !isMeaningfulValue(data.referenceFile) &&
    !isMeaningfulValue(data.fileUpload)
  ) {
    pushUnique(suggestions, t.suggestionDesignFile);
  }

  if (
    hasAnyField(data, ["siteVisit", "installation", "needSiteVisit", "usagePlace", "signType"]) &&
    !isMeaningfulValue(data.sitePhoto)
  ) {
    pushUnique(suggestions, t.suggestionSitePhoto);
  }

  if (
    !hasAnyField(data, profile.installationIds) &&
    ["signage", "window-graphics", "event-printing", "sign-installation-maintenance"].includes(
      serviceId
    )
  ) {
    pushUnique(suggestions, t.suggestionExecutionContext);
  }

  if (serviceId === "open-request" && descriptionLength < 20) {
    pushUnique(missing, t.missingDescription);
    pushUnique(suggestions, t.suggestionDescription);
    score = Math.min(score, 45);
  }

  if (
    serviceId === "signage" &&
    isAffirmativeValue(data.lighting) &&
    !hasValue(data.lightType)
  ) {
    pushUnique(missing, t.missingServiceSpecific);
    pushUnique(suggestions, t.suggestionClarifyIntent);
    score = Math.min(score, 70);
  }

  for (const check of profile.extraRequiredChecks || []) {
    if (!check(data)) {
      pushUnique(missing, t.missingServiceSpecific);
      score = Math.min(score, 72);
    }
  }

  if (!typeValue && !sizeValue && !quantityValue && filledCount > 0 && filledCount <= 2) {
    pushUnique(suggestions, t.suggestionClarifyIntent);
  }

  if (!materialValue && materialQuality === 0) {
    pushUnique(suggestions, t.suggestionMaterial);
  }

  if (!installationValue && installationQuality === 0) {
    pushUnique(suggestions, t.suggestionInstallation);
  }

  const summary = buildSummary(
    t,
    typeValue,
    sizeValue,
    quantityValue,
    score,
    filledCount
  );

  return {
    summary,
    missing,
    suggestions,
    score,
  };
}