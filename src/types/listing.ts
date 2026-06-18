import type { EstateProperty } from "../data/estateProperties";
import type { ListingImage } from "./user";

export type FloorPlanType =
  | "balcony"
  | "front_hall"
  | "kitchen"
  | "full_building";

export type FloorPlanImage = {
  type: FloorPlanType;
  name: string;
  dataUrl: string;
};

export type ListingFAQ = {
  id: string;
  question: string;
  answer: string;
};

export type ListingOwnerContact = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  location?: string;
  lockedByAdmin?: boolean;
  useCompanyDetails?: boolean;
};

export type ListingFeatureValues = EstateProperty["features"];

export const PROPERTY_CATEGORIES = [
  "Detached Duplex",
  "Semi-Detached Duplex",
  "Terraced Duplex",
  "Flat / Apartment",
  "Terrace",
  "Condo",
  "Suite",
] as const;

export const ABOUT_HIGHLIGHT_OPTIONS = [
  "Gated and secure estate",
  "Serene, well-organised environment",
  "Tarred access road",
  "Reliable Band A power supply",
  "POP ceiling finish",
  "Spacious compound with ample parking",
  "Prepaid meter (PPM)",
  "Fully fitted kitchen with cabinets and pantry",
  "Well-crafted wardrobes",
  "Elegant chandeliers and TV console setup",
  "Modern fittings throughout",
  "Prime location",
  "24/7 security",
  "Backup generator",
] as const;

export const AMENITY_OPTIONS = [
  "Gated Estate",
  "Band A Power",
  "Prepaid Meter",
  "Fitted Kitchen",
  "Wardrobes",
  "POP Ceiling",
  "Parking",
  "Secure Environment",
  "Swimming Pool",
  "Gym",
  "Elevator",
  "CCTV",
  "Intercom",
  "BQ",
] as const;

export const FAQ_TEMPLATES: Omit<ListingFAQ, "id">[] = [
  {
    question: "Is the property available for viewing?",
    answer:
      "Yes. Contact the listing agent to schedule a private viewing at a convenient time.",
  },
  {
    question: "Is there a service charge or estate levy?",
    answer:
      "Service charges vary by estate. Full details are provided during enquiry.",
  },
  {
    question: "Are pets allowed?",
    answer: "Pet policy depends on the estate rules. Please confirm with the agent.",
  },
  {
    question: "Is parking available?",
    answer:
      "Parking availability is listed under property features. Most listings include dedicated parking.",
  },
  {
    question: "What documents are required to proceed?",
    answer:
      "Typically proof of identity, payment evidence, and a signed offer letter. Your agent will guide you.",
  },
  {
    question: "Is the property negotiable?",
    answer:
      "Price guidance is shown on the listing. Serious offers can be discussed with the listing owner.",
  },
];

export const FLOOR_PLAN_LABELS: Record<FloorPlanType, string> = {
  balcony: "Balcony Plan",
  front_hall: "Front Hall",
  kitchen: "Kitchen",
  full_building: "Full Building Plan",
};

export const defaultListingFeatures = (): ListingFeatureValues => ({
  bedrooms: 3,
  bathrooms: 3,
  parking: "Yes",
  balcony: "Yes",
  smartHome: "No",
  generator: "Stand-by",
  solar: "Optional",
  bq: "No",
  intercom: "No",
  outdoorKitchen: "No",
  laundry: "Yes",
  furnishing: "Unfurnished",
});

export type ListingRecord = {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  agentAvatar?: string;
  listingType: "sale" | "rent";
  category: string;
  city: string;
  state: string;
  address: string;
  price: string;
  priceLabel?: string;
  beds: number;
  baths: number;
  sqft: string;
  description: string;
  shortDescription: string;
  descriptionExtra: string;
  images: ListingImage[];
  coverImageId: string;
  highlights: string[];
  features: ListingFeatureValues;
  amenities: string[];
  floorPlans: FloorPlanImage[];
  videoUrl?: string;
  videoDataUrl?: string;
  faqs: ListingFAQ[];
  mapAddress: string;
  ownerContact: ListingOwnerContact;
  nearbyLandmarks: string[];
  status: "pending_review" | "approved" | "rejected" | "draft";
  submittedAt: string;
  publishedAt?: string;
  slug?: string;
  createdBy: "agent" | "admin";
};

export type ListingFormInput = Omit<
  ListingRecord,
  "id" | "status" | "submittedAt" | "publishedAt" | "slug"
>;
