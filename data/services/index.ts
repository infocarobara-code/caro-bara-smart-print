import type { Service } from "@/types/service";

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

export const services: Service[] = [
  ...signageServices,
  ...printingServices,
  ...packagingServices,
  ...textileServices,
  ...brandingServices,
  ...fabricationServices,
];

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