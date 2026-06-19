/** Canonical public site origin (apex — matches Vercel www → apex redirect). */
export const DEFAULT_SITE_URL = "https://duenoproperty.com";

/** Strip stray whitespace/newlines from env values (common Vercel paste issue). */
export const sanitizeSiteUrl = (
  raw: string | undefined,
  fallback = DEFAULT_SITE_URL,
): string => {
  const cleaned = (raw ?? fallback).trim().replace(/[\r\n\t]/g, "");
  return cleaned.replace(/\/$/, "");
};
