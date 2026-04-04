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
 * - Dynamic filtering
 * - Analytics tracking
 */

/**
 * Important:
 * We now use the NEW production category IDs:
 * smart
 * signage
 * surfaces
 * vehicle
 * printing
 * packaging
 * display
 * textile
 * fabrication
 * branding
 * marketing
 *
 * Some service files still carry older category IDs internally.
 * To avoid empty category pages and broken routing, we normalize them here.
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

const normalizeServiceCategory = (service: Service): Service => {
  const overriddenCategory = categoryOverrides[service.id];

  if (!overriddenCategory) {
    return service;
  }

  return {
    ...service,
    category: overriddenCategory,
  };
};

export const services: Service[] = [
  ...smartServices,
  ...signageServices,
  ...printingServices,
  ...packagingServices,
  ...textileServices,
  ...brandingServices,
  ...fabricationServices,
].map(normalizeServiceCategory);

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