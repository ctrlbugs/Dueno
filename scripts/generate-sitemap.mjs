import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const sanitizeSiteUrl = (raw) => {
  const fallback = "https://duenoproperty.com";
  const cleaned = (raw ?? fallback).trim().replace(/[\r\n\t]/g, "");
  return cleaned.replace(/\/$/, "");
};

const siteUrl = sanitizeSiteUrl(process.env.VITE_SITE_URL);

const STATIC_PATHS = [
  "/",
  "/home",
  "/buy-property",
  "/rent-property",
  "/services",
  "/about-us",
  "/contact-us",
  "/agent-list",
  "/blog-grid",
  "/faq",
  "/terms-condition",
  "/privacy-policy",
];

const SERVICE_SLUGS = [
  "property-sales",
  "property-rentals",
  "mortgages",
  "artisan-services",
  "moving-services",
  "property-cleaning",
];

const AGENT_IDS = ["agent-2", "agent-3"];

/** Static + showcase property detail pages (buy-details / rent-details). */
const PROPERTY_PAGES = [
  { prefix: "buy", slug: "wells-carlton-abuja" },
  { prefix: "buy", slug: "naf-valley-estate" },
  { prefix: "buy", slug: "lekki-phase-1-terrace" },
  { prefix: "buy", slug: "chevron-toll-gate-lekki" },
  { prefix: "buy", slug: "awkaka-estate-port-harcourt" },
  { prefix: "buy", slug: "cornerstone-estate-port-harcourt" },
  { prefix: "buy", slug: "yona-residences-guzape" },
  { prefix: "buy", slug: "festac-amuwo-odofin-lagos-sale" },
  { prefix: "rent", slug: "ikoyi-terrace-lagos" },
  { prefix: "rent", slug: "ikate-chisco-lekki" },
  { prefix: "rent", slug: "royal-estate-port-harcourt" },
  { prefix: "rent", slug: "obiri-ikwerre-port-harcourt" },
  { prefix: "rent", slug: "amino-kano-wuse-2" },
  { prefix: "rent", slug: "von-axis-lugbe" },
  { prefix: "rent", slug: "4-bedroom-semi-detached-duplex-rent" },
];

const buildPaths = () => {
  const paths = new Set(STATIC_PATHS);

  for (const slug of SERVICE_SLUGS) {
    paths.add(`/services/${slug}`);
  }

  for (const id of AGENT_IDS) {
    paths.add(`/dueno-agent/${id}`);
  }

  for (const { prefix, slug } of PROPERTY_PAGES) {
    paths.add(`/${prefix}-details/${slug}`);
  }

  return [...paths];
};

const lastmod = new Date().toISOString().slice(0, 10);

const buildSitemap = () => {
  const urls = buildPaths()
    .map(
      (path) => `  <url>
    <loc>${siteUrl}${path === "/" ? "/" : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${path === "/" || path === "/home" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" || path === "/home" ? "1.0" : path.includes("-details/") ? "0.8" : "0.7"}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

const buildRobots = () => `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /agent/
Disallow: /signin
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemapPath = join(publicDir, "sitemap.xml");
const robotsPath = join(publicDir, "robots.txt");

writeFileSync(sitemapPath, buildSitemap(), "utf8");
writeFileSync(robotsPath, buildRobots(), "utf8");

console.log(`Generated ${sitemapPath} (${buildPaths().length} URLs)`);
console.log(`Generated ${robotsPath}`);
