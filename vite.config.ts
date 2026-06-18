import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const appendApiKey = (path: string, key: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}apikey=${key}`;
};

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
