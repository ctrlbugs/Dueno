import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const appendApiKey = (path: string, key: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}apikey=${key}`;
};

const SMTP_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "CONTACT_TO_EMAIL",
] as const;

const applySmtpEnv = (env: Record<string, string>) => {
  for (const key of SMTP_ENV_KEYS) {
    const value = env[key]?.trim();
    if (value) {
      process.env[key] = value;
    }
  }
};

const contactApiDevPlugin = (env: Record<string, string>): Plugin => ({
  name: "contact-api-dev",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url !== "/api/contact") {
        next();
        return;
      }

      applySmtpEnv(env);

      const { handleContactRequest } = await import(
        "./server/contact/handler.mjs"
      );
      await handleContactRequest(req, res);
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://duenoproperty.com").replace(
    /\/$/,
    "",
  );

  return {
    plugins: [
      react(),
      contactApiDevPlugin(env),
      {
        name: "html-site-url",
        transformIndexHtml(html) {
          return html.replaceAll("https://duenoproperty.com", siteUrl);
        },
      },
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // Admin theme + Bootstrap 5 still use legacy @import Sass APIs.
          quietDeps: true,
          silenceDeprecations: [
            "import",
            "global-builtin",
            "color-functions",
            "if-function",
          ],
        },
      },
    },
    resolve: {
      alias: {
        "@dashboard-ui": path.resolve(__dirname, "src/dashboard-ui"),
        "@": path.resolve(__dirname, "src/dashboard-ui"),
      },
    },
    define: { "process.env": {} },
    server: {
      proxy: {
        "/api/property-news": {
          target: "https://newsapi.org/v2",
          changeOrigin: true,
          rewrite: (path) => {
            const apiPath = path.replace(/^\/api\/property-news/, "");
            const separator = apiPath.includes("?") ? "&" : "?";
            return `${apiPath}${separator}apiKey=${env.VITE_NEWS_API_KEY ?? ""}`;
          },
        },
        "/api/gnews": {
          target: "https://gnews.io/api/v4",
          changeOrigin: true,
          rewrite: (path) => {
            const apiPath = path.replace(/^\/api\/gnews/, "");
            return appendApiKey(apiPath, env.VITE_GNEWS_API_KEY ?? "");
          },
        },
        "/api/newsdata": {
          target: "https://newsdata.io/api/1",
          changeOrigin: true,
          rewrite: (path) => {
            const apiPath = path.replace(/^\/api\/newsdata/, "");
            return appendApiKey(apiPath, env.VITE_NEWSDATA_API_KEY ?? "");
          },
        },
      },
    },
  };
});
