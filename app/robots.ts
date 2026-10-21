import type { MetadataRoute } from "next";

const sitemap = "https://www.abhishekpanda.com/sitemap.xml";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap,
    host: "https://www.abhishekpanda.com",
  };
}
