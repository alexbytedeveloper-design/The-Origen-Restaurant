import type { MetadataRoute } from "next";
import { Environment } from "@/server/config/environment";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/qr/", "/*/gracias"],
      },
    ],
    sitemap: `${Environment.siteUrl}/sitemap.xml`,
    host: Environment.siteUrl,
  };
}
