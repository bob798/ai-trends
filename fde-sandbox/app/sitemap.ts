import type { MetadataRoute } from "next";
import { SCENARIOS } from "@/lib/scenarios";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/sandbox`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/learn`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/market`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/jobs`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/interview`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, priority: 0.3 },
  ];
  const levels: MetadataRoute.Sitemap = SCENARIOS.map((s) => ({
    url: `${SITE_URL}/sandbox/${s.id}`,
    lastModified: now,
    priority: 0.7,
  }));
  return [...statics, ...levels];
}
