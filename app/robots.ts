import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vibeaudit.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/onboarding", "/scan", "/monitoring", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
