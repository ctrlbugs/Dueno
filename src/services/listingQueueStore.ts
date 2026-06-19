import {
  getDevApprovedAgentEmail,
  getDevSammyAgentEmail,
  isDevSeedEnabled,
} from "../config/devAccounts";
import type { PendingListing } from "../types/user";
import type { ListingFormInput } from "../types/listing";
import {
  defaultListingFeatures,
} from "../types/listing";
import {
  publishListingRecord,
  publishedPropertyToListingRecord,
  unpublishListing,
} from "./listingPublishService";
import { subscribePublishedListings, getPublishedListingById, getPublishedListings } from "./publishedListingsStore";

const STORAGE_KEY = "_DUENO_PENDING_LISTINGS";

const defaultOwnerContact = (): PendingListing["ownerContact"] => ({
  useCompanyDetails: false,
  lockedByAdmin: false,
});

const normalizeListing = (listing: Partial<PendingListing> & { id: string }): PendingListing => ({
  id: listing.id,
  title: listing.title ?? "",
  agentId: listing.agentId ?? "",
  agentName: listing.agentName ?? "",
  agentEmail: listing.agentEmail ?? "",
  agentAvatar: listing.agentAvatar,
  listingType: listing.listingType ?? "sale",
  category: listing.category ?? "Detached Duplex",
  city: listing.city ?? "",
  state: listing.state ?? "",
  address: listing.address ?? "",
  price: listing.price ?? "",
  priceLabel: listing.priceLabel,
  beds: listing.beds ?? 3,
  baths: listing.baths ?? 3,
  sqft: listing.sqft ?? "—",
  description: listing.description ?? "",
  shortDescription: listing.shortDescription ?? "",
  descriptionExtra: listing.descriptionExtra ?? "",
  images: listing.images ?? [],
  coverImageId: listing.coverImageId ?? listing.images?.[0]?.id ?? "",
  highlights: listing.highlights ?? [],
  features: listing.features ?? defaultListingFeatures(),
  amenities: listing.amenities ?? [],
  floorPlans: listing.floorPlans ?? [],
  videoUrl: listing.videoUrl,
  videoDataUrl: listing.videoDataUrl,
  faqs: listing.faqs ?? [],
  mapAddress: listing.mapAddress ?? listing.address ?? "",
  ownerContact: listing.ownerContact ?? defaultOwnerContact(),
  nearbyLandmarks: listing.nearbyLandmarks ?? [],
  status: listing.status ?? "pending_review",
  submittedAt: listing.submittedAt ?? new Date().toISOString(),
  publishedAt: listing.publishedAt,
  slug: listing.slug,
  createdBy: listing.createdBy ?? "agent",
});

const DEV_SEED_QUEUE_IDS = new Set([
  "listing-1",
  "listing-2",
  "listing-agent-2-rent-duplex",
  "listing-agent-3-festac-sale",
  "listing-agent-3-pending-ikoyi",
]);

const DEV_SEED_SUBMITTED_AT = {
  emekaRent: "2026-05-15T10:00:00.000Z",
  emekaMaitama: "2026-05-28T09:00:00.000Z",
  emekaLekki: "2026-05-27T11:00:00.000Z",
  sammyFestac: "2026-05-18T10:00:00.000Z",
  sammyIkoyi: "2026-05-30T14:00:00.000Z",
} as const;

const DEV_SEED_PUBLISHED_AT = {
  emekaRent: "2026-05-25T10:00:00.000Z",
  sammyFestac: "2026-05-26T10:00:00.000Z",
} as const;

const seedListingNeedsUpdate = (
  current: PendingListing,
  seed: PendingListing,
) =>
  current.status !== seed.status ||
  current.title !== seed.title ||
  current.agentId !== seed.agentId ||
  current.price !== seed.price;

const writeListings = (listings: PendingListing[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch {
    throw new Error(
      "Storage limit reached. Remove some photos or use fewer images.",
    );
  }
  window.dispatchEvent(new CustomEvent("dueno-listings-updated"));
};

const seedListings = (): PendingListing[] => {
  if (!isDevSeedEnabled()) return [];

  const emekaEmail = getDevApprovedAgentEmail();
  const sammyEmail = getDevSammyAgentEmail();
  const seeds: PendingListing[] = [];

  if (emekaEmail) {
    seeds.push(
      normalizeListing({
        id: "listing-agent-2-rent-duplex",
        title: "4 bedroom semi-detached duplex for rent",
        agentId: "agent-2",
        agentName: "Emeka Nwosu",
        agentEmail: emekaEmail,
        listingType: "rent",
        category: "Semi-Detached Duplex",
        city: "Lugbe",
        state: "FCT",
        address: "Lugbe, Abuja, Nigeria",
        price: "₦3,000,000",
        priceLabel: "per annum",
        description:
          "Spacious 4-bedroom semi-detached duplex available for rent in a secured estate.",
        shortDescription:
          "Standard 4-bedroom semi-detached duplex for rent in a secured estate.",
        images: [],
        status: "approved",
        publishedAt: DEV_SEED_PUBLISHED_AT.emekaRent,
        submittedAt: DEV_SEED_SUBMITTED_AT.emekaRent,
        slug: "4-bedroom-semi-detached-duplex-rent",
        createdBy: "agent",
      }),
      normalizeListing({
        id: "listing-1",
        title: "4-Bed Duplex in Maitama",
        agentId: "agent-2",
        agentName: "Emeka Nwosu",
        agentEmail: emekaEmail,
        listingType: "sale",
        city: "Abuja",
        state: "FCT",
        address: "Maitama, Abuja, Nigeria",
        price: "₦450,000,000",
        description: "Luxury duplex in a prime Maitama location.",
        shortDescription: "Luxury duplex in a prime Maitama location.",
        images: [],
        status: "pending_review",
        submittedAt: DEV_SEED_SUBMITTED_AT.emekaMaitama,
        createdBy: "agent",
      }),
      normalizeListing({
        id: "listing-2",
        title: "3-Bed Terrace in Lekki Phase 1",
        agentId: "agent-2",
        agentName: "Emeka Nwosu",
        agentEmail: emekaEmail,
        listingType: "rent",
        city: "Lagos",
        state: "Lagos",
        address: "Lekki Phase 1, Lagos, Nigeria",
        price: "₦8,500,000",
        priceLabel: "per annum",
        description: "Serviced terrace with backup power and security.",
        shortDescription: "Serviced terrace with backup power and security.",
        images: [],
        status: "rejected",
        submittedAt: DEV_SEED_SUBMITTED_AT.emekaLekki,
        createdBy: "agent",
      }),
    );
  }

  if (sammyEmail) {
    seeds.push(
      normalizeListing({
        id: "listing-agent-3-festac-sale",
        title: "festac Omowu Odofin Lagos",
        agentId: "agent-3",
        agentName: "Sammy Akindele",
        agentEmail: sammyEmail,
        listingType: "sale",
        category: "Semi-Detached Duplex",
        city: "Lagos",
        state: "Lagos",
        address: "Festac, Amuwo Odofin, Lagos, Nigeria",
        price: "₦25,000,000",
        description:
          "Verified listing in Festac, Amuwo Odofin, Lagos. Ideal for families seeking a secure neighbourhood.",
        shortDescription:
          "Well-located property for sale in Festac, Amuwo Odofin, Lagos.",
        images: [],
        status: "approved",
        publishedAt: DEV_SEED_PUBLISHED_AT.sammyFestac,
        submittedAt: DEV_SEED_SUBMITTED_AT.sammyFestac,
        slug: "festac-amuwo-odofin-lagos-sale",
        createdBy: "agent",
      }),
      normalizeListing({
        id: "listing-agent-3-pending-ikoyi",
        title: "2-Bed Apartment in Ikoyi",
        agentId: "agent-3",
        agentName: "Sammy Akindele",
        agentEmail: sammyEmail,
        listingType: "rent",
        category: "Flat / Apartment",
        city: "Lagos",
        state: "Lagos",
        address: "Ikoyi, Lagos, Nigeria",
        price: "₦12,000,000",
        priceLabel: "per annum",
        description: "Serviced 2-bedroom apartment with river views in Ikoyi.",
        shortDescription: "Serviced 2-bedroom apartment with river views in Ikoyi.",
        images: [],
        status: "pending_review",
        submittedAt: DEV_SEED_SUBMITTED_AT.sammyIkoyi,
        createdBy: "agent",
      }),
    );
  }

  return seeds;
};

const mergeDevSeedListings = (listings: PendingListing[]): PendingListing[] => {
  const seeds = seedListings();
  if (seeds.length === 0) return listings;

  let changed = false;
  const merged = [...listings];

  for (const seed of seeds) {
    const index = merged.findIndex((listing) => listing.id === seed.id);
    if (index === -1) {
      merged.push(seed);
      changed = true;
    } else if (
      DEV_SEED_QUEUE_IDS.has(seed.id) &&
      seedListingNeedsUpdate(merged[index], seed)
    ) {
      merged[index] = seed;
      changed = true;
    }
  }

  if (changed) {
    writeListings(merged);
  }

  return merged;
};

const readListings = (): PendingListing[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedListings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return mergeDevSeedListings(seeded);
  }
  try {
    return mergeDevSeedListings(
      (JSON.parse(raw) as Partial<PendingListing>[]).map((listing) =>
        normalizeListing(listing as PendingListing),
      ),
    );
  } catch {
    const seeded = seedListings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return mergeDevSeedListings(seeded);
  }
};

export const getPendingListings = (): PendingListing[] => readListings();

export const getListingById = (id: string): PendingListing | undefined =>
  readListings().find((listing) => listing.id === id);

export const getListingsByAgentId = (agentId: string): PendingListing[] => {
  const queued = readListings().filter((listing) => listing.agentId === agentId);
  const queuedIds = new Set(queued.map((listing) => listing.id));

  const fromPublished = getPublishedListings()
    .filter(
      (property) =>
        property.agentId === agentId &&
        property.isUploaded &&
        !queuedIds.has(property.id),
    )
    .map(publishedPropertyToListingRecord);

  return [...queued, ...fromPublished].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
};

export type AgentListingStats = {
  total: number;
  pending: number;
  published: number;
  rejected: number;
};

export const getAgentListingStats = (agentId: string): AgentListingStats => {
  const listings = getListingsByAgentId(agentId);
  return {
    total: listings.length,
    pending: listings.filter((listing) => listing.status === "pending_review")
      .length,
    published: listings.filter((listing) => listing.status === "approved")
      .length,
    rejected: listings.filter((listing) => listing.status === "rejected").length,
  };
};

export const getPendingListingsByStatus = (
  status: PendingListing["status"],
): PendingListing[] =>
  readListings().filter((listing) => listing.status === status);

export const saveListing = (
  input: ListingFormInput & {
    id?: string;
    status?: PendingListing["status"];
    publishedAt?: string;
  },
): PendingListing => {
  const listings = readListings();
  const existingIndex = input.id
    ? listings.findIndex((listing) => listing.id === input.id)
    : -1;

  const listing = normalizeListing({
    ...input,
    id: input.id ?? `listing-${crypto.randomUUID()}`,
    status:
      input.status ??
      (existingIndex >= 0 ? listings[existingIndex].status : "pending_review"),
    submittedAt:
      existingIndex >= 0
        ? listings[existingIndex].submittedAt
        : new Date().toISOString(),
    publishedAt: input.publishedAt ?? listings[existingIndex]?.publishedAt,
  });

  if (existingIndex >= 0) {
    listings[existingIndex] = listing;
    writeListings(listings);
    return listing;
  }

  writeListings([listing, ...listings]);
  return listing;
};

export const submitAgentListing = (
  input: ListingFormInput,
): PendingListing =>
  saveListing({ ...input, status: "pending_review" });

export const updateListingStatus = (
  id: string,
  status: PendingListing["status"],
): PendingListing | undefined => {
  const listings = readListings();
  const index = listings.findIndex((listing) => listing.id === id);
  if (index === -1) return undefined;

  const updated = { ...listings[index], status };
  if (status === "approved") {
    updated.publishedAt = new Date().toISOString();
    publishListingRecord(updated);
  }
  if (status === "rejected") {
    unpublishListing(id);
  }

  listings[index] = updated;
  writeListings(listings);
  return updated;
};

export const deleteListing = (id: string) => {
  writeListings(readListings().filter((listing) => listing.id !== id));
  unpublishListing(id);
};

export const deleteListingByAgent = (id: string, agentId: string) => {
  const listing = getListingById(id);
  if (!listing || listing.agentId !== agentId) {
    throw new Error("You can only delete your own listings.");
  }
  deleteListing(id);
};

export const deleteAnyListing = (
  id: string,
  options?: { isStaticCatalog?: boolean },
) => {
  if (options?.isStaticCatalog) {
    unpublishListing(id, true);
    return;
  }
  deleteListing(id);
};

export const updateListingOwnerContact = (
  id: string,
  ownerContact: PendingListing["ownerContact"],
) => {
  const listings = readListings();
  const index = listings.findIndex((listing) => listing.id === id);
  if (index === -1) return undefined;
  listings[index] = { ...listings[index], ownerContact };
  writeListings(listings);
  const updated = listings[index];
  if (updated.status === "approved") {
    publishListingRecord(updated);
  }
  return updated;
};

export const subscribeListings = (callback: () => void) => {
  const listingHandler = () => callback();
  const publishedHandler = () => callback();
  window.addEventListener("dueno-listings-updated", listingHandler);
  const unsubscribePublished = subscribePublishedListings(publishedHandler);
  return () => {
    window.removeEventListener("dueno-listings-updated", listingHandler);
    unsubscribePublished();
  };
};

export const adminSaveListing = (
  input: ListingFormInput & { id?: string },
  options?: { publish?: boolean },
): PendingListing => {
  const existing = input.id ? getListingById(input.id) : undefined;
  const shouldPublish = options?.publish !== false;
  const listing = saveListing({
    ...input,
    id: input.id,
    createdBy: input.createdBy ?? "admin",
    status: shouldPublish ? "approved" : "pending_review",
    publishedAt:
      existing?.publishedAt ??
      (shouldPublish ? new Date().toISOString() : undefined),
  });

  if (listing.status === "approved") {
    publishListingRecord({
      ...listing,
      publishedAt: listing.publishedAt ?? new Date().toISOString(),
    });
  }

  return listing;
};

export const getListingForEdit = (id: string): PendingListing | undefined => {
  const queued = getListingById(id);
  if (queued) return queued;

  const published = getPublishedListingById(id);
  if (!published?.isUploaded) return undefined;

  return publishedPropertyToListingRecord(published);
};
