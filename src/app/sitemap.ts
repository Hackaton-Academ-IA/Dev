import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://academia-app.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: APP_URL,                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${APP_URL}/login`,                   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/signup`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/legal/cgu`,               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${APP_URL}/legal/confidentialite`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${APP_URL}/legal/mentions`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${APP_URL}/legal/cookies`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
