import type { Service } from "@/types/service";

import { smartServices } from "./smart";
import { signageServices } from "./signage";
import { printingServices } from "./printing";
import { packagingServices } from "./packaging";
import { textileServices } from "./textile";
import { brandingServices } from "./branding";
import { fabricationServices } from "./fabrication";

/**
 * Central Services Registry
 * ----------------------------------
 * This file aggregates all services across categories.
 * Future-ready for:
 * - SEO routing
 * - AI processing
 * - Smart search
 * - Voice search
 * - Analytics tracking
 */

/**
 * CATEGORY NORMALIZATION
 */
const categoryOverrides: Record<string, string> = {
  "open-request": "smart",

  signage: "signage",
  "sign-installation-maintenance": "signage",

  "window-graphics": "surfaces",

  "vehicle-branding": "vehicle",

  "commercial-printing": "printing",
  "business-printing": "printing",
  stamps: "printing",

  "stickers-labels": "packaging",
  packaging: "packaging",

  "banners-rollups-flags": "display",
  "event-printing": "display",

  "textile-printing": "textile",
  "promotional-items": "textile",

  "custom-fabrication": "fabrication",
  "shop-setup-decor": "fabrication",

  "branding-design": "branding",
  "logo-design-only": "branding",

  "marketing-solutions": "marketing",
};

/**
 * Normalize category
 */
const normalizeServiceCategory = (service: Service): Service => {
  const overriddenCategory = categoryOverrides[service.id];

  if (!overriddenCategory) return service;

  return {
    ...service,
    category: overriddenCategory,
  };
};

/**
 * Inject SEARCH TEXT (SEO + AI)
 */
const enhanceServiceSearch = (service: Service): Service => {
  const collect = (obj: any): string[] => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj.flatMap(collect);
    if (typeof obj === "object") return Object.values(obj).flatMap(collect);
    if (typeof obj === "string") return [obj];
    return [];
  };

  const seo = (service as any).seo || {};
  const searchProfile = (service as any).searchProfile || {};

  const allText = [
    ...collect(service.title),
    ...collect(service.description),
    ...collect(service.intro),

    ...collect(seo.keywords),
    ...collect(seo.internalLinkTerms),

    ...collect(searchProfile.aliases),
    ...collect(searchProfile.voicePhrases),
    ...collect(searchProfile.seoKeywords),

    ...collect(
      (searchProfile.naturalQueries || []).map((q: any) => [
        q.ar,
        q.de,
        q.en,
      ])
    ),
  ];

  return {
    ...service,
    searchableText: allText.join(" ").toLowerCase(),
  };
};

/**
 * BUILD SERVICES ARRAY
 */
export const services: Service[] = [
  ...smartServices,
  ...signageServices,
  ...printingServices,
  ...packagingServices,
  ...textileServices,
  ...brandingServices,
  ...fabricationServices,
]
  .map(normalizeServiceCategory)
  .map(enhanceServiceSearch);

/**
 * Helper: Get service by ID
 */
export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id);
};

/**
 * Helper: Get services by category
 */
export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter((service) => service.category === categoryId);
};

/**
 * 🔥 NEW: Smart Search (Text + Voice)
 */
export const searchServices = (query: string): Service[] => {
  const q = query.toLowerCase();

  return services
    .map((service) => {
      const text = (service as any).searchableText || "";

      let score = 0;

      if (text.includes(q)) score += 10;

      const words = q.split(" ");
      for (const w of words) {
        if (text.includes(w)) score += 2;
      }

      const boost =
        (service as any)?.searchProfile?.searchableTextBoost || 1;

      return {
        service,
        score: score * boost,
      };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.service);
};