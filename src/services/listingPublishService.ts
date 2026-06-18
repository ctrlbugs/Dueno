import type { EstateProperty } from "../data/estateProperties";
import { PROPERTY_LISTING_DATE } from "../data/estateProperties";
import type { ListingRecord } from "../types/listing";
import { getAgentById, getAgentAvatarUrl } from "./agentStore";
import { formatPropertyPrice } from "../utils/nairaPrice";
import {
  markStaticListingDeleted,
  removePublishedListing,
  upsertPublishedListing,
} from "./publishedListingsStore";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildListingSlug = (listing: ListingRecord) => {
  const base = slugify(listing.title) || "property";
  return `${base}-${listing.id.replace("listing-", "").slice(0, 8)}`;
};

const resolveCoverImage = (listing: ListingRecord) => {
  const cover =
    listing.images.find((image) => image.id === listing.coverImageId) ??
    listing.images[0];
  return cover?.dataUrl ?? "";
};

export const listingRecordToEstateProperty = (
  listing: ListingRecord,
): EstateProperty => {
  const agent = getAgentById(listing.agentId);
  const imageUrls = listing.images.map((image) => image.dataUrl);
  const cover = resolveCoverImage(listing);
  const publishedAt = listing.publishedAt ?? new Date().toISOString();
  const address =
    listing.address ||
    `${listing.city}, ${listing.state}, Nigeria`.replace(/,\s*,/g, ",");

  return {
    id: listing.id,
    slug: listing.slug ?? buildListingSlug(listing),
    imageFolder: "",
    images: imageUrls,
    cardImage: cover,
    title: listing.title,
    fullTitle: listing.title,
    address,
    badge: listing.category.split(" ")[0] ?? listing.category,
    badgeClass: listing.listingType === "sale" ? "bg-purple" : "bg-pink",
    listingType: listing.listingType === "sale" ? "For Sale" : "For Rent",
    category: listing.category,
    price: formatPropertyPrice(listing.price),
    priceLabel: listing.priceLabel,
    listedOn: new Date(publishedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    lastUpdated: new Date(publishedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    rating: 5,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    visits: 0,
    shortDescription: listing.shortDescription || listing.description.slice(0, 180),
    description: listing.description,
    descriptionExtra: listing.descriptionExtra,
    highlights: listing.highlights,
    features: listing.features,
    amenities: listing.amenities,
    agentAvatar:
      listing.agentAvatar ??
      getAgentAvatarUrl(agent) ??
      "assets/img/logo.svg",
    agentName: listing.agentName,
    agentId: listing.agentId,
    videoUrl: listing.videoUrl,
    nearbyLandmarks: listing.nearbyLandmarks,
    publishedAt,
    isUploaded: true,
    floorPlans: listing.floorPlans.map((plan) => ({
      label: plan.name,
      type: plan.type,
      imageUrl: plan.dataUrl,
    })),
    faqs: listing.faqs.map(({ question, answer }) => ({ question, answer })),
    ownerInfo: {
      phone: listing.ownerContact.phone ?? agent?.phone ?? "",
      email: listing.ownerContact.email ?? listing.agentEmail,
      whatsapp: listing.ownerContact.whatsapp,
      location:
        listing.ownerContact.location ??
        `${listing.city}, ${listing.state}`,
      lockedByAdmin: listing.ownerContact.lockedByAdmin,
      useCompanyDetails: listing.ownerContact.useCompanyDetails,
    },
    mapAddress: listing.mapAddress || address,
    sourceListingId: listing.id,
  };
};

export const publishListingRecord = (listing: ListingRecord) => {
  const published = listingRecordToEstateProperty({
    ...listing,
    publishedAt: new Date().toISOString(),
    slug: listing.slug ?? buildListingSlug(listing),
  });
  upsertPublishedListing(published);
  return published;
};

export const unpublishListing = (id: string, isStaticCatalogId?: boolean) => {
  if (isStaticCatalogId) {
    markStaticListingDeleted(id);
    return;
  }
  removePublishedListing(id);
};

export const formatListingDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const defaultListedOnLabel = () => PROPERTY_LISTING_DATE;

export const publishedPropertyToListingRecord = (
  property: EstateProperty,
): ListingRecord => {
  const images = property.images.map((dataUrl, index) => ({
    id: `img-${property.id}-${index}`,
    name: `photo-${index + 1}.jpg`,
    dataUrl,
  }));
  const coverImageId =
    images.find((image) => image.dataUrl === property.cardImage)?.id ??
    images[0]?.id ??
    "";

  return {
    id: property.id,
    title: property.title,
    agentId: property.agentId ?? "dueno-admin",
    agentName: property.agentName ?? "Dueno Property Team",
    agentEmail: property.ownerInfo?.email ?? "contact@duenoproperty.com",
    agentAvatar: property.agentAvatar,
    listingType: property.listingType === "For Sale" ? "sale" : "rent",
    category: property.category,
    city: property.address.split(",")[0]?.trim() ?? "",
    state: property.address.split(",")[1]?.trim() ?? "",
    address: property.address,
    price: property.price,
    priceLabel: property.priceLabel,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    description: property.description,
    shortDescription: property.shortDescription,
    descriptionExtra: property.descriptionExtra,
    images,
    coverImageId,
    highlights: property.highlights,
    features: property.features,
    amenities: property.amenities,
    floorPlans:
      property.floorPlans?.map((plan) => ({
        type: plan.type as ListingRecord["floorPlans"][number]["type"],
        name: plan.label,
        dataUrl: plan.imageUrl,
      })) ?? [],
    videoUrl: property.videoUrl,
    faqs:
      property.faqs?.map((faq) => ({
        id: crypto.randomUUID(),
        question: faq.question,
        answer: faq.answer,
      })) ?? [],
    mapAddress: property.mapAddress ?? property.address,
    ownerContact: {
      phone: property.ownerInfo?.phone,
      email: property.ownerInfo?.email,
      whatsapp: property.ownerInfo?.whatsapp,
      location: property.ownerInfo?.location,
      lockedByAdmin: property.ownerInfo?.lockedByAdmin,
      useCompanyDetails: property.ownerInfo?.useCompanyDetails,
    },
    nearbyLandmarks: property.nearbyLandmarks,
    status: "approved",
    submittedAt: property.publishedAt ?? new Date().toISOString(),
    publishedAt: property.publishedAt,
    slug: property.slug,
    createdBy: "admin",
  };
};
