import type { EstateProperty } from "../data/estateProperties";

const STORAGE_KEY = "_DUENO_PUBLISHED_LISTINGS";
const DELETED_STATIC_KEY = "_DUENO_DELETED_STATIC_IDS";

const readPublished = (): EstateProperty[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EstateProperty[];
  } catch {
    return [];
  }
};

const writePublished = (listings: EstateProperty[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  window.dispatchEvent(new CustomEvent("dueno-published-updated"));
};

const readDeletedStatic = (): Set<string> => {
  const raw = localStorage.getItem(DELETED_STATIC_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
};

const writeDeletedStatic = (ids: Set<string>) => {
  localStorage.setItem(DELETED_STATIC_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent("dueno-published-updated"));
};

export const getPublishedListings = (): EstateProperty[] => readPublished();

export const getPublishedListingById = (id: string) =>
  readPublished().find((listing) => listing.id === id);

export const getPublishedListingBySlug = (slug: string) =>
  readPublished().find((listing) => listing.slug === slug);

export const upsertPublishedListing = (listing: EstateProperty) => {
  const listings = readPublished();
  const index = listings.findIndex((item) => item.id === listing.id);
  if (index === -1) {
    writePublished([listing, ...listings]);
    return listing;
  }
  listings[index] = listing;
  writePublished(listings);
  return listing;
};

export const removePublishedListing = (id: string) => {
  writePublished(readPublished().filter((listing) => listing.id !== id));
};

export const markStaticListingDeleted = (id: string) => {
  const deleted = readDeletedStatic();
  deleted.add(id);
  writeDeletedStatic(deleted);
};

export const restoreStaticListing = (id: string) => {
  const deleted = readDeletedStatic();
  deleted.delete(id);
  writeDeletedStatic(deleted);
};

export const getDeletedStaticIds = (): string[] => [...readDeletedStatic()];

export const subscribePublishedListings = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-published-updated", handler);
  return () => window.removeEventListener("dueno-published-updated", handler);
};
