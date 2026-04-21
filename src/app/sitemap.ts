import type { MetadataRoute } from "next";

const baseUrl = "https://www.josephjwang.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/resume",
    "/services",
    "/case-studies",
    "/contact",
    "/about",
    "/demos",
    "/analyst",
    "/ecommerce",
    "/research",
  ];

  const now = new Date();
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
