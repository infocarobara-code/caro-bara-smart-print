import type { MetadataRoute } from "next";
import { seoSite } from "@/data/seoSite";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${seoSite.url}/sitemap.xml`,
  };
}
