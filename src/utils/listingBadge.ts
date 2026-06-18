const NEW_LISTING_MS = 48 * 60 * 60 * 1000;

export const isListingNew = (publishedAt?: string, listedOn?: string): boolean => {
  const source = publishedAt ?? listedOn;
  if (!source) return false;

  const parsed = Date.parse(source);
  if (Number.isNaN(parsed)) {
    const fallback = new Date(source);
    if (Number.isNaN(fallback.getTime())) return false;
    return Date.now() - fallback.getTime() < NEW_LISTING_MS;
  }

  return Date.now() - parsed < NEW_LISTING_MS;
};
