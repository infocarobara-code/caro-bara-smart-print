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

  missingRequired: string;
  missingDescription: string;
  missingDimensions: string;
  missingQuantity: string;
  missingMaterial: string;
  missingDesign: string;
  missingInstallation: string;
  missingFiles: string;

  suggestionReference: string;
  suggestionDesignFile: string;
  suggestionSitePhoto: string;
  suggestionQuantity: string;
  suggestionDimensions: string;
  suggestionMaterial: string;
  suggestionInstallation: string;
  suggestionDescription: string;
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

    missingRequired: "بعض الحقول الأساسية المطلوبة ما زالت ناقصة",
    missingDescription: "الوصف أو التفاصيل الإضافية غير كافية",
    missingDimensions: "المقاسات الأساسية غير مكتملة",
    missingQuantity: "الكمية غير محددة",
    missingMaterial: "نوع المادة غير محدد بوضوح",
    missingDesign: "لم يتم تحديد هل يوجد تصميم جاهز",
    missingInstallation: "لم يتم تحديد هل يلزم تركيب أو تنفيذ موقعي",
    missingFiles: "لا يوجد ملف أو صورة مرجعية حتى الآن",

    suggestionReference: "إضافة ملف أو صورة مرجعية تساعدنا على فهم الطلب بشكل أدق",
    suggestionDesignFile: "إذا كان لديك تصميم جاهز، فإرفاقه يسرّع المعالجة والتسعير",
    suggestionSitePhoto: "إضافة صورة للموقع أو الواجهة تساعد في فهم ظروف التنفيذ",
    suggestionQuantity: "تحديد الكمية بدقة يساعد على إعطاء مسار تنفيذ وتسعير أوضح",
    suggestionDimensions: "تحديد المقاسات بدقة يجعل التحليل والتوجيه أكثر واقعية",
    suggestionMaterial: "تحديد المادة المطلوبة يساعدنا على اقتراح الحل الأنسب",
    suggestionInstallation: "تحديد الحاجة إلى التركيب أو التنفيذ الموقعي يوضح نطاق الطلب",
    suggestionDescription: "أضف وصفًا أوضح لفكرتك أو الهدف من الطلب للحصول على تحليل أدق",
  },
  de: {
    unknown: "nicht angegeben",
    summaryEmpty: "Die Analyse der Anfrage hat noch nicht begonnen.",
    summaryGeneric: "Einige grundlegende Informationen für diese Anfrage wurden eingegeben.",
    summaryWithType: "Aktuelle Anfrageart: {type}.",
    summaryWithSize: "Format/Maß wurde angegeben: {size}.",
    summaryWithQuantity: "Menge wurde angegeben: {quantity}.",
    summaryWithTypeAndSize: "Die Anfrage ist vom Typ {type} im Format/Maß {size}.",
    summaryWithTypeAndQuantity: "Die Anfrage ist vom Typ {type} mit Menge {quantity}.",
    summaryFull: "Die Anfrage ist vom Typ {type}, im Format/Maß {size}, mit Menge {quantity}.",

    missingRequired: "Einige grundlegende Pflichtfelder fehlen noch",
    missingDescription: "Beschreibung oder zusätzliche Details sind noch nicht ausreichend",
    missingDimensions: "Die Grundmaße sind noch nicht vollständig",
    missingQuantity: "Die Menge ist nicht angegeben",
    missingMaterial: "Das Material ist nicht klar angegeben",
    missingDesign: "Es ist nicht angegeben, ob ein fertiges Design vorhanden ist",
    missingInstallation: "Es ist nicht angegeben, ob Montage oder Vor-Ort-Ausführung benötigt wird",
    missingFiles: "Es wurde noch keine Referenzdatei oder kein Referenzbild hinzugefügt",

    suggestionReference: "Eine Referenzdatei oder ein Referenzbild hilft uns, die Anfrage genauer zu verstehen",
    suggestionDesignFile: "Wenn bereits ein fertiges Design vorhanden ist, beschleunigt das den Ablauf und die Kalkulation",
    suggestionSitePhoto: "Ein Foto vom Standort oder von der Fassade hilft bei der Einschätzung der Umsetzung",
    suggestionQuantity: "Eine genaue Mengenangabe verbessert Analyse und Preisfindung",
    suggestionDimensions: "Genaue Maße machen Analyse und Weiterleitung realistischer",
    suggestionMaterial: "Die Angabe des Materials hilft uns, die passende Lösung vorzuschlagen",
    suggestionInstallation: "Die Angabe, ob Montage nötig ist, klärt den Umfang der Anfrage",
    suggestionDescription: "Füge eine klarere Beschreibung deiner Idee oder deines Ziels hinzu, um eine genauere Analyse zu erhalten",
  },
  en: {
    unknown: "not specified",
    summaryEmpty: "The request analysis has not started yet.",
    summaryGeneric: "Some basic information has been entered for this request.",
    summaryWithType: "Current request type: {type}.",
    summaryWithSize: "Size/dimensions provided: {size}.",
    summaryWithQuantity: "Quantity provided: {quantity}.",
    summaryWithTypeAndSize: "The request is for {type} with size {size}.",
    summaryWithTypeAndQuantity: "The request is for {type} with quantity {quantity}.",
    summaryFull: "The request is for {type}, with size {size}, and quantity {quantity}.",

    missingRequired: "Some required core fields are still missing",
    missingDescription: "The description or additional details are still not sufficient",
    missingDimensions: "The core dimensions are incomplete",
    missingQuantity: "The quantity is not specified",
    missingMaterial: "The material is not clearly specified",
    missingDesign: "It is not specified whether a ready design exists",
    missingInstallation: "It is not specified whether installation or on-site execution is needed",
    missingFiles: "No reference file or image has been added yet",

    suggestionReference: "Adding a reference file or image helps us understand the request more accurately",
    suggestionDesignFile: "If you already have a ready design, attaching it speeds up review and pricing",
    suggestionSitePhoto: "Adding a site or facade photo helps us understand execution conditions better",
    suggestionQuantity: "Specifying the quantity clearly improves analysis and pricing direction",
    suggestionDimensions: "Providing exact dimensions makes the analysis and routing more realistic",
    suggestionMaterial: "Specifying the material helps us suggest the most suitable solution",
    suggestionInstallation: "Specifying whether installation is needed clarifies the scope of the request",
    suggestionDescription: "Add a clearer description of your idea or request goal for a more accurate analysis",
  },
};

function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(.*?)\}/g, (_, key) => values[key] ?? "");
}

function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function normalize(value: string | undefined) {
  return (value || "").trim().toLowerCase();
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
    "nicht sicher",
    "unbekannt",
    "keine",
    "ohne",
  ].includes(v);
}

function isMeaningfulValue(value: string | undefined) {
  return !isNegativeOrUnknownValue(value);
}

function isAffirmativeValue(value: string | undefined) {
  const v = normalize(value);

  return [
    "yes",
    "ja",
    "نعم",
    "true",
    "1",
    "vorhanden",
    "ready",
  ].includes(v);
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
  return (value || "").trim().length;
}

export function analyzeRequest(
  serviceId: string,
  data: Record<string, string>,
  lang: Language
): AnalysisResult {
  const t = text[lang];
  const missing: string[] = [];
  const suggestions: string[] = [];

  const typeValue = findFirstValue(data, [
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
  ]);

  const sizeValue = findFirstValue(data, [
    "size",
    "dimensions",
    "width",
    "height",
    "vehicleSize",
    "stampSize",
  ]);

  const quantityValue = findFirstValue(data, [
    "quantity",
    "qty",
    "numberOfPieces",
  ]);

  const materialValue = findFirstValue(data, [
    "material",
    "paperType",
    "fabricType",
  ]);

  const designReadyValue = findFirstValue(data, [
    "designReady",
    "hasReference",
  ]);

  const installationValue = findFirstValue(data, [
    "installation",
    "siteVisit",
    "needSiteVisit",
    "needMeasurements",
  ]);

  const descriptionValue = findFirstValue(data, [
    "notes",
    "vision",
    "textContent",
    "details",
    "message",
  ]);

  const hasReferenceFile = hasAnyField(data, [
    "referenceFile",
    "sitePhoto",
    "fileUpload",
  ]);

  let totalChecks = 0;
  let passedChecks = 0;

  const check = (condition: boolean, message?: string) => {
    totalChecks += 1;
    if (condition) {
      passedChecks += 1;
    } else if (message) {
      pushUnique(missing, message);
    }
  };

  const suggestIf = (condition: boolean, message: string) => {
    if (!condition) {
      pushUnique(suggestions, message);
    }
  };

  const filledCount = countFilled(data);
  const descriptionLength = getDescriptionLength(descriptionValue);

  if (filledCount === 0) {
    return {
      summary: t.summaryEmpty,
      missing: [],
      suggestions: [t.suggestionDescription],
      score: 0,
    };
  }

  check(filledCount >= 2, t.missingRequired);

  if (hasAnyField(data, ["width", "height", "size", "dimensions"])) {
    const dimensionsOk =
      (hasValue(data.width) && hasValue(data.height)) ||
      hasValue(data.size) ||
      hasValue(data.dimensions);
    check(dimensionsOk, t.missingDimensions);
  }

  if (hasAnyField(data, ["quantity", "qty", "numberOfPieces"])) {
    check(hasValue(quantityValue), t.missingQuantity);
  }

  if (hasAnyField(data, ["material", "paperType", "fabricType"])) {
    check(isMeaningfulValue(materialValue), t.missingMaterial);
  }

  if (hasAnyField(data, ["designReady", "hasReference"])) {
    check(hasValue(designReadyValue), t.missingDesign);
  }

  if (
    hasAnyField(data, [
      "installation",
      "siteVisit",
      "needSiteVisit",
      "needMeasurements",
    ])
  ) {
    check(hasValue(installationValue), t.missingInstallation);
  }

  if (hasAnyField(data, ["notes", "vision", "details", "message", "textContent"])) {
    check(descriptionLength >= 12, t.missingDescription);
  }

  if (hasAnyField(data, ["referenceFile", "sitePhoto", "fileUpload"])) {
    check(hasReferenceFile, t.missingFiles);
  }

  suggestIf(hasReferenceFile, t.suggestionReference);

  if (isAffirmativeValue(designReadyValue)) {
    suggestIf(
      hasAnyField(data, ["referenceFile", "fileUpload"]),
      t.suggestionDesignFile
    );
  }

  if (hasAnyField(data, ["siteVisit", "installation", "signType", "usagePlace"])) {
    suggestIf(hasValue(data.sitePhoto), t.suggestionSitePhoto);
  }

  if (hasAnyField(data, ["quantity", "qty", "numberOfPieces"]) && !hasValue(quantityValue)) {
    pushUnique(suggestions, t.suggestionQuantity);
  }

  if (
    hasAnyField(data, ["width", "height", "size", "dimensions"]) &&
    !(
      (hasValue(data.width) && hasValue(data.height)) ||
      hasValue(data.size) ||
      hasValue(data.dimensions)
    )
  ) {
    pushUnique(suggestions, t.suggestionDimensions);
  }

  if (
    hasAnyField(data, ["material", "paperType", "fabricType"]) &&
    !isMeaningfulValue(materialValue)
  ) {
    pushUnique(suggestions, t.suggestionMaterial);
  }

  if (
    hasAnyField(data, ["installation", "siteVisit", "needSiteVisit", "needMeasurements"]) &&
    !hasValue(installationValue)
  ) {
    pushUnique(suggestions, t.suggestionInstallation);
  }

  if (descriptionLength < 12) {
    pushUnique(suggestions, t.suggestionDescription);
  }

  if (serviceId === "signage" && isAffirmativeValue(data.lighting)) {
    check(hasValue(data.lightType), t.missingRequired);
  }

  if (serviceId === "open-request") {
    check((data.vision || "").trim().length >= 20, t.missingDescription);
  }

  if (totalChecks === 0) {
    totalChecks = Math.max(3, filledCount > 0 ? 3 : 1);
    passedChecks = Math.min(totalChecks, filledCount > 0 ? 1 : 0);
  }

  const score = Math.max(
    0,
    Math.min(100, Math.round((passedChecks / totalChecks) * 100))
  );

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

  return {
    summary,
    missing,
    suggestions,
    score,
  };
}