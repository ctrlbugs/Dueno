/**
 * Minimal /api/v1 router. Extend with auth, listings, uploads, etc.
 */

import { handleHealth } from "./health.mjs";

const JSON_404 = JSON.stringify({ error: "Not found" });

export const createApiRouter = (deps = {}) => {
  const routes = [
    { method: "GET", path: "/api/v1/health", handler: (req, res) => handleHealth(req, res, deps) },
  ];

  return async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const match = routes.find(
      (route) => route.method === req.method && route.path === url.pathname,
    );

    if (!match) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON_404);
      return true;
    }

    await match.handler(req, res);
    return true;
  };
};
