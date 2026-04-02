import type { Service } from "@/types/service";

import { signageServices } from "./signage";
import { printingServices } from "./printing";
import { packagingServices } from "./packaging";
import { textileServices } from "./textile";
import { brandingServices } from "./branding";
import { fabricationServices } from "./fabrication";

export const services: Service[] = [
  ...signageServices,
  ...printingServices,
  ...packagingServices,
  ...textileServices,
  ...brandingServices,
  ...fabricationServices,
];