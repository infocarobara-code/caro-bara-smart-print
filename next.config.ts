import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
  ],

  outputFileTracingIncludes: {
    "/api/submit-request": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
    "/api/**/*": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },
};

export default nextConfig;