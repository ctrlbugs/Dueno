import type { EstateProperty } from "../data/estateProperties";
import {
  getDevPublishedListings,
  getPublicPublishedListings,
} from "../config/devPublishedListings";

const STORAGE_KEY = "_DUENO_PUBLISHED_LISTINGS";
const DELETED_STATIC_KEY = "_DUENO_DELETED_STATIC_IDS";

const writePublished = (listings: EstateProperty[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  window.dispatchEvent(new CustomEvent("dueno-published-updated"));
};

const mergeSeedPublished = (listings: EstateProperty[]): EstateProperty[] => {
  const seedIds = new Set<string>();
  const allSeeds = [...getPublicPublishedListings(), ...getDevPublishedListings()].filter(
    (seed) => {
      if (seedIds.has(seed.id)) return false;
      seedIds.add(seed.id);
      return true;
    },
  );
  if (allSeeds.length === 0) return listings;

  let changed = false;
  const merged = [...listings];

  for (const seed of allSeeds) {
    if (!merged.some((listing) => listing.id === seed.id)) {
      merged.push(seed);
      changed = true;
    }
  }

  if (changed) {
    writePublished(merged);
  }

  return merged;
};

const mergeDevSeedPublished = mergeSeedPublished;

const readPublished = (): EstateProperty[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return mergeDevSeedPublished([]);
  }
  try {
    return mergeDevSeedPublished(JSON.parse(raw) as EstateProperty[]);
  } catch {
    return mergeDevSeedPublished([]);
  }
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
