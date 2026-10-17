import type { MetadataRoute } from "next";
import { seoSite } from "@/data/seoSite";
import { services } from "@/data/services";
import { categories } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/request", "/about", "/offers", "/guide", "/booking", "/sign-studio",
    ...categories.filter(category => services.some(service => service.category === category.id))
      .map(category => `/request/category/${encodeURIComponent(category.id)}`),
    ...services.map(service => `/request/service/${encodeURIComponent(service.id)}`),
  ];
  return [...new Set(paths)].map(path => ({ url: `${seoSite.url}${path}` }));
}
