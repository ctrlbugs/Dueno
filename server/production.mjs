/**
 * Dueno production server
 * Serves the Vite build (dist/) and proxies news APIs so keys stay server-side.
 *
 * Usage:
 *   npm run build
 *   npm run start
 *
 * Requires Node 20+ (--env-file loads .env automatically).
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createApiRouter } from "./api/router.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const appendQueryParam = (search, key, value) => {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.set(key, value);
  const query = params.toString();
  return query ? `?${query}` : "";
};

const proxyConfigs = [
  {
    prefix: "/api/property-news",
    targetBase: "https://newsapi.org/v2",
    apiKeyEnv: "VITE_NEWS_API_KEY",
    apiKeyParam: "apiKey",
  },
  {
    prefix: "/api/gnews",
    targetBase: "https://gnews.io/api/v4",
    apiKeyEnv: "VITE_GNEWS_API_KEY",
    apiKeyParam: "apikey",
  },
  {
    prefix: "/api/newsdata",
    targetBase: "https://newsdata.io/api/1",
    apiKeyEnv: "VITE_NEWSDATA_API_KEY",
    apiKeyParam: "apikey",
  },
];

const proxyRequest = async (req, res, config) => {
  const apiKey = process.env[config.apiKeyEnv];
  if (!apiKey) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: `${config.apiKeyEnv} is not set on the server`,
      }),
    );
    return;
  }

  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const upstreamPath = requestUrl.pathname.replace(config.prefix, "") || "/";
  const upstreamSearch = appendQueryParam(
    requestUrl.search,
    config.apiKeyParam,
    apiKey,
  );
  const upstreamUrl = `${config.targetBase}${upstreamPath}${upstreamSearch}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "DuenoProperty/1.0",
      },
    });

    const body = await upstreamResponse.text();
    res.writeHead(upstreamResponse.status, {
      "Content-Type":
        upstreamResponse.headers.get("content-type") || "application/json",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "News proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
};

const serveStatic = (req, res) => {
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  let filePath = join(DIST_DIR, pathname);

  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST_DIR, "index.html");
  }

  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = readFileSync(filePath);

  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
};

let dbPool = null;
if (process.env.DATABASE_URL) {
  try {
    const { default: pg } = await import("pg");
    dbPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    console.log("Postgres pool configured (DATABASE_URL)");
  } catch (error) {
    console.warn(
      "DATABASE_URL is set but pg is not installed. Run: npm install pg",
    );
    console.warn(error instanceof Error ? error.message : error);
  }
}

const handleApi = createApiRouter({ pool: dbPool });

const server = createServer(async (req, res) => {
  const requestUrl = req.url ?? "/";
  const matchedProxy = proxyConfigs.find((config) =>
    requestUrl.startsWith(config.prefix),
  );

  if (matchedProxy) {
    await proxyRequest(req, res, matchedProxy);
    return;
  }

  if (requestUrl.startsWith("/api/v1")) {
    await handleApi(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Dueno server running at http://${HOST}:${PORT}`);
  console.log("News API proxies active:");
  proxyConfigs.forEach((config) => {
    console.log(`  ${config.prefix} -> ${config.targetBase}`);
  });
  console.log("API routes: /api/v1/health");
});
