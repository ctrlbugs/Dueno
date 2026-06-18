/**
 * Health check handler — mount at GET /api/v1/health
 * Returns 200 when optional DATABASE_URL is reachable, 200 with degraded flag if not configured.
 */

export const handleHealth = async (_req, res, { pool } = {}) => {
  const payload = {
    ok: true,
    service: "dueno-api",
    database: "not_configured",
    timestamp: new Date().toISOString(),
  };

  if (!pool) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
    return;
  }

  try {
    await pool.query("SELECT 1");
    payload.database = "connected";
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  } catch (error) {
    payload.ok = false;
    payload.database = "error";
    payload.message = error instanceof Error ? error.message : "Database error";
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  }
};
