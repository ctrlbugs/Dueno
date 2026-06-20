import type { EstateProperty } from "../data/estateProperties";
import { PROPERTY_LISTING_DATE } from "../data/estateProperties";
import { isDevSeedEnabled } from "./devAccounts";

const estateImagePath = (folder: string, fileName: string) =>
  `assets/img/Estate-img/${folder}/${fileName}`;

const defaultFeatures = {
  bedrooms: 4,
  bathrooms: 4,
  parking: "Yes",
  balcony: "Yes",
  smartHome: "No",
  generator: "Stand-by",
  solar: "No",
  bq: "Yes",
  intercom: "Yes",
  outdoorKitchen: "No",
  laundry: "Yes",
  furnishing: "Unfurnished",
};

const buildSeedListing = (
  partial: Pick<
    EstateProperty,
    | "id"
    | "slug"
    | "title"
    | "fullTitle"
    | "address"
    | "listingType"
    | "category"
    | "price"
    | "priceLabel"
    | "beds"
    | "baths"
    | "sqft"
    | "shortDescription"
    | "description"
    | "agentId"
    | "agentName"
    | "cardImage"
    | "images"
    | "imageFolder"
  > &
    Partial<EstateProperty>,
): EstateProperty => {
  const publishedAt =
    partial.publishedAt ?? new Date(Date.now() - 86400000 * 5).toISOString();

  return {
    badge: partial.badge ?? "Duplex",
    badgeClass: partial.badgeClass ?? "bg-purple",
    listedOn: partial.listedOn ?? PROPERTY_LISTING_DATE,
    lastUpdated: partial.lastUpdated ?? PROPERTY_LISTING_DATE,
    rating: partial.rating ?? 5,
    visits: partial.visits ?? 0,
    descriptionExtra: partial.descriptionExtra ?? "",
    highlights: partial.highlights ?? [],
    features: partial.features ?? defaultFeatures,
    amenities: partial.amenities ?? ["24/7 Security", "Parking", "Power Backup"],
    nearbyLandmarks: partial.nearbyLandmarks ?? [],
    publishedAt,
    isUploaded: true,
    ...partial,
  };
};

export const getPublicPublishedListings = (): EstateProperty[] => {
  const lagosSaleImages = [
    estateImagePath("Ikate Chisco", "1.jpeg"),
    estateImagePath("Ikate Chisco", "2.jpeg"),
    estateImagePath("Ikate Chisco", "3.jpeg"),
  ];
  const abujaRentImages = [
    estateImagePath("Von Axis", "1.jpeg"),
    estateImagePath("Von Axis", "2.jpeg"),
    estateImagePath("Von Axis", "3.jpeg"),
  ];

  return [
    buildSeedListing({
      id: "listing-agent-3-festac-sale",
      slug: "festac-amuwo-odofin-lagos-sale",
      imageFolder: "Ikate Chisco",
      images: lagosSaleImages,
      cardImage: lagosSaleImages[0],
      title: "festac Omowu Odofin Lagos",
      fullTitle: "Festac, Amuwo Odofin, Lagos — Residential Property for Sale",
      address: "Festac, Amuwo Odofin, Lagos, Nigeria",
      listingType: "For Sale",
      category: "Semi-Detached Duplex",
      price: "₦25,000,000",
      beds: 4,
      baths: 4,
      sqft: "220 sqm",
      shortDescription:
        "Well-located property for sale in Festac, Amuwo Odofin, Lagos.",
      description:
        "Verified listing in Festac, Amuwo Odofin, Lagos. Ideal for families seeking a secure neighbourhood with good road access and nearby amenities.",
      agentId: "agent-3",
      agentName: "Sammy Akindele",
      agentAvatar: "assets/img/logo.svg",
      badge: "Semi-Detached",
    }),
    buildSeedListing({
      id: "listing-agent-2-rent-duplex",
      slug: "4-bedroom-semi-detached-duplex-rent",
      imageFolder: "Von Axis",
      images: abujaRentImages,
      cardImage: abujaRentImages[0],
      title: "4 bedroom semi-detached duplex for rent",
      fullTitle: "4 Bedroom Semi-Detached Duplex for Rent",
      address: "Lugbe, Abuja, Nigeria",
      listingType: "For Rent",
      category: "Semi-Detached Duplex",
      price: "₦3,000,000",
      priceLabel: "per annum",
      beds: 4,
      baths: 4,
      sqft: "240 sqm",
      shortDescription:
        "Standard 4-bedroom semi-detached duplex for rent in a secured estate.",
      description:
        "Spacious 4-bedroom semi-detached duplex available for rent. Features include ensuite rooms, a boys' quarter, and dedicated parking.",
      agentId: "agent-2",
      agentName: "Emeka Nwosu",
      agentAvatar: "assets/img/logo.svg",
      badge: "Semi-Detached",
      badgeClass: "bg-pink",
    }),
  ];
};

export const getDevPublishedListings = (): EstateProperty[] => {
  if (!isDevSeedEnabled()) return [];
  return getPublicPublishedListings();
};
