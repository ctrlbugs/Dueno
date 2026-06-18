const appendApiKey = (search, key, value) => {
  const params = new URLSearchParams(search || "");
  params.set(key, value);
  return `?${params.toString()}`;
};

const proxyJson = async (res, targetUrl) => {
  const upstream = await fetch(targetUrl, {
    headers: { Accept: "application/json", "User-Agent": "DuenoProperty/1.0" },
  });
  const body = await upstream.text();
  res.status(upstream.status).set("Cache-Control", "no-store").send(body);
};

export default async function handler(req, res) {
  const apiKey = process.env.VITE_NEWSDATA_API_KEY;
  if (!apiKey) {
    return res
      .status(502)
      .json({ error: "VITE_NEWSDATA_API_KEY is not configured" });
  }

  const slug = req.query.slug;
  const path = Array.isArray(slug) ? slug.join("/") : slug || "";
  const { slug: _omit, ...query } = req.query;
  const search = appendApiKey(
    new URLSearchParams(query).toString()
      ? `?${new URLSearchParams(query).toString()}`
      : "",
    "apikey",
    apiKey,
  );

  const targetUrl = `https://newsdata.io/api/1/${path}${search}`;
  return proxyJson(res, targetUrl);
}
