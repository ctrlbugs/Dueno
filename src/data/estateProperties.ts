import {
  getDeletedStaticIds,
  getPublishedListings,
} from "../services/publishedListingsStore";
import { formatPropertyPrice } from "../utils/nairaPrice";
import { resolvePropertyAgentAvatar } from "../utils/propertyDisplay";

export type EstateProperty = {
  id: string;
  slug: string;
  imageFolder: string;
  images: string[];
  cardImage: string;
  title: string;
  fullTitle: string;
  address: string;
  badge: string;
  badgeClass?: string;
  listingType: "For Sale" | "For Rent";
  category: string;
  price: string;
  priceLabel?: string;
  listedOn: string;
  lastUpdated: string;
  rating: number;
  beds: number;
  baths: number;
  sqft: string;
  visits?: number;
  shortDescription: string;
  description: string;
  descriptionExtra: string;
  highlights: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    parking: string;
    balcony: string;
    smartHome: string;
    generator: string;
    solar: string;
    bq: string;
    intercom: string;
    outdoorKitchen: string;
    laundry: string;
    furnishing: string;
  };
  amenities: string[];
  sourceUrl?: string;
  agentAvatar?: string;
  agentName?: string;
  agentId?: string;
  videoUrl?: string;
  nearbyLandmarks: string[];
  /** ISO timestamp — used for 48h "New" badge on uploaded listings */
  publishedAt?: string;
  isUploaded?: boolean;
  mapAddress?: string;
  floorPlans?: {
    label: string;
    type: string;
    imageUrl: string;
  }[];
  faqs?: { question: string; answer: string }[];
  ownerInfo?: {
    phone: string;
    email: string;
    whatsapp?: string;
    location?: string;
    lockedByAdmin?: boolean;
    useCompanyDetails?: boolean;
  };
  sourceListingId?: string;
};

const ASOSKO_ESTATE_FOLDER = "Asosko Estate";
const NAV_ESTATE_FOLDER = "Nav Estate";
const ADMIRALTY_ROAD_FOLDER = "Admiralty Road";
const CHEVRON_TOLL_GATE_FOLDER = "Chevron Toll Gate";
const AWKAKA_ESTATE_FOLDER = "Awkaka Estate";
const CORNERSTONE_ESTATE_FOLDER = "Cornerstone Estate";
const IKOYI_ESTATE_FOLDER = "Ikoyi Estate";
const IKATE_CHISCO_FOLDER = "Ikate Chisco";
const ROYAL_ESTATE_FOLDER = "Royal Estate";
const OBIRI_IKWERRE_FOLDER = "Obiri Ikwerre";
const AMINO_KANO_FOLDER = "Amino Kano";
const VON_AXIS_FOLDER = "Von Axis";
const GUZAPE_DISTRICT_FOLDER = "Guzape District";

/** Update when refreshing listing dates across properties. */
export const PROPERTY_LISTING_DATE = "1 Jun 2026";

const estateImagePath = (folder: string, fileName: string) =>
  `assets/img/Estate-img/${folder}/${fileName}`;

const estateImagesFromFiles = (folder: string, files: string[]) =>
  files.map((fileName) => estateImagePath(folder, fileName));

const folderImages = (
  folder: string,
  from: number,
  to: number,
  ext = "jpg",
) =>
  Array.from({ length: to - from + 1 }, (_, index) => {
    const num = from + index;
    return estateImagePath(folder, `${num}.${ext}`);
  });

const asoskoEstateImages = folderImages(ASOSKO_ESTATE_FOLDER, 1, 15);
const navEstateImages = folderImages(NAV_ESTATE_FOLDER, 101, 124);
const admiraltyRoadImages = folderImages(ADMIRALTY_ROAD_FOLDER, 1, 11);
const chevronTollGateImages = folderImages(CHEVRON_TOLL_GATE_FOLDER, 1, 19);
const awkakaEstateImages = folderImages(AWKAKA_ESTATE_FOLDER, 1, 14);
const cornerstoneEstateImages = folderImages(CORNERSTONE_ESTATE_FOLDER, 1, 12);
const ikoyiEstateImages = folderImages(IKOYI_ESTATE_FOLDER, 1, 12);
const ikateChiscoImages = folderImages(IKATE_CHISCO_FOLDER, 1, 10, "jpeg");
const royalEstateImages = estateImagesFromFiles(ROYAL_ESTATE_FOLDER, [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "11.jpg",
  "12.jpg",
  "19.jpg",
]);
const obiriIkwerreImages = folderImages(OBIRI_IKWERRE_FOLDER, 1, 11);
const aminoKanoImages = folderImages(AMINO_KANO_FOLDER, 1, 16, "jpeg");
const vonAxisImages = folderImages(VON_AXIS_FOLDER, 1, 12, "jpeg");
const guzapeDistrictImages = folderImages(GUZAPE_DISTRICT_FOLDER, 1, 7);

const defaultFeatures = {
  bedrooms: 4,
  bathrooms: 4,
  parking: "Yes",
  balcony: "Yes",
  smartHome: "Yes",
  generator: "Stand-by",
  solar: "Optional",
  bq: "Yes",
  intercom: "Yes",
  outdoorKitchen: "No",
  laundry: "Yes",
  furnishing: "Unfurnished",
};

export const ESTATE_PROPERTIES: EstateProperty[] = [
  {
    id: "1",
    slug: "wells-carlton-abuja",
    imageFolder: ASOSKO_ESTATE_FOLDER,
    images: asoskoEstateImages,
    cardImage: estateImagePath(ASOSKO_ESTATE_FOLDER, "1.jpg"),
    title: "6 bedroom detached duplex for sale",
    fullTitle: "6 Bedroom Detached Duplex for Sale at Wells Carlton Apartments",
    address: "Wells Carlton Apartments, Abuja, Nigeria",
    badge: "Condo",
    badgeClass: "bg-secondary",
    listingType: "For Sale",
    category: "Detached Duplex",
    price: "₦2,500,000,000",
    listedOn: PROPERTY_LISTING_DATE,
    lastUpdated: PROPERTY_LISTING_DATE,
    rating: 5.0,
    beds: 6,
    baths: 6,
    sqft: "6,500 Sq Ft",
    visits: 38,
    shortDescription:
      "6 bedroom detached duplex for sale at Wells Carlton Apartments, Abuja.",
    description:
      "Premium 6-bedroom detached duplex for sale at Wells Carlton Apartments, Abuja. This residence offers generous living spaces, modern finishes, and a prestigious address suited for luxury family living or executive accommodation.",
    descriptionExtra:
      "Located in one of Abuja's sought-after residential areas with excellent access to business districts, schools, and lifestyle amenities.",
    highlights: [
      "6 spacious en-suite bedrooms",
      "Premium finishes throughout",
      "Secure estate environment",
      "Ample parking space",
      "Ideal for luxury family living",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 6,
      bathrooms: 6,
      parking: "Multi",
    },
    amenities: [
      "Secure Estate",
      "Parking",
      "Modern Kitchen",
      "En-Suite Bedrooms",
      "Power Backup",
    ],
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Transcorp Hilton Abuja",
      "Silverbird Cinemas, Abuja",
      "Millennium Park Abuja",
      "Abuja National Mosque",
    ],
  },
  {
    id: "2",
    slug: "naf-valley-estate",
    imageFolder: NAV_ESTATE_FOLDER,
    images: navEstateImages,
    cardImage: estateImagePath(NAV_ESTATE_FOLDER, "101.jpg"),
    title: "5 bedroom detached duplex for sale",
    fullTitle:
      "Brand New Luxury 5 Bedroom Detached House + BQ at NAF Valley Estate",
    address: "NAF Valley Estate, Asokoro, Abuja, Nigeria",
    badge: "Suite",
    badgeClass: "bg-pink",
    listingType: "For Sale",
    category: "Detached Duplex",
    price: "₦1,500,000,000",
    listedOn: PROPERTY_LISTING_DATE,
    lastUpdated: PROPERTY_LISTING_DATE,
    rating: 5.0,
    beds: 5,
    baths: 5,
    sqft: "",
    visits: 45,
    shortDescription:
      "5 bedroom detached duplex for sale at NAF Valley Estate, Asokoro, Abuja.",
    description: `FOR SALE: Brand New, Magnificent, Fully Automated, Luxury 5 Bedroom Detached House + 2 room BQ, Maid Room, Stand-by Generator at NAF Valley Estate, Asokoro, Abuja.

FOR THE DISCERNING FEW: A PRIVATE MASTERPIECE OF PRESTIGE AND INTELLIGENCE

In a market filled with ordinary luxury, this residence stands in a class of its own. Designed for high-net-worth individuals who value privacy, innovation, and timeless architectural excellence, this exceptional property delivers a rare blend of sophistication and smart living.

This brand new, fully automated 5-bedroom detached duplex is a bold expression of status, precision, and refined taste.`,
    descriptionExtra: `This residence is more than a home; it is a strategic acquisition for those who appreciate legacy assets, superior design, and uncompromising quality.

For individuals who understand that true luxury is not loud, but unmistakable.`,
    highlights: [
      "Advanced Smart Home Integration: Seamless control of lighting, security, and ambiance",
      "Grand Living Spaces: Thoughtfully designed interiors with premium finishes and bespoke detailing",
      "5 Luxurious En-Suite Bedrooms: Each space curated for comfort, privacy, and elegance",
      "Partly Furnished with High-End Fixtures: Ready for immediate, upscale living",
      "2-Room Boys' Quarters + Dedicated Maid's Room: Discreet and functional service areas",
      "Already installed high capacity solar and inverter",
      "Balconies in all the bedrooms",
      "Already wired intercom connections in all the rooms",
      "Private Laundry Suite",
      "Outdoor Kitchen & Entertainment Area: Ideal for hosting exclusive gatherings",
      "Soundproof Generator House: Absolute comfort with uninterrupted power",
      "Architectural Carport: A statement structure for your prized vehicles",
    ],
    features: {
      bedrooms: 5,
      bathrooms: 5,
      parking: "Carport",
      balcony: "All rooms",
      smartHome: "Automated",
      generator: "Stand-by",
      solar: "Installed",
      bq: "2-Room BQ",
      intercom: "Yes",
      outdoorKitchen: "Yes",
      laundry: "Private",
      furnishing: "Partial",
    },
    amenities: [
      "Smart Home System",
      "Stand-by Generator",
      "Solar & Inverter",
      "Outdoor Kitchen",
      "Intercom",
      "Private Laundry",
      "Maid's Room",
      "Boys' Quarters",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/detached-duplexes/abuja/asokoro-district/3441652-brand-new-magnificent-fully-automated-5-bedrooms-house-bq-gen",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Aso Rock Presidential Villa",
      "National Children's Park & Zoo",
      "Millennium Park Abuja",
      "Asokoro Layout Roundabout",
    ],
  },
  {
    id: "3",
    slug: "lekki-phase-1-terrace",
    imageFolder: ADMIRALTY_ROAD_FOLDER,
    images: admiraltyRoadImages,
    cardImage: estateImagePath(ADMIRALTY_ROAD_FOLDER, "1.jpg"),
    title: "4 bedroom terrace for sale",
    fullTitle:
      "Exclusive 4 Bedroom Terrace Plus BQ in a Self Compound, Lekki Phase 1",
    address: "Lekki Phase 1, Lagos, Nigeria",
    badge: "Terrace",
    badgeClass: "bg-primary",
    listingType: "For Sale",
    category: "Terraced Duplex",
    price: "₦600,000,000",
    listedOn: "23 Apr 2026",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 4,
    baths: 4,
    sqft: "",
    visits: 29,
    shortDescription:
      "4 bedroom terrace plus BQ for sale in a self compound, Lekki Phase 1, Lagos.",
    description: `For Sale: Exclusive 4 bedroom terrace plus BQ in a self compound, close to the express at Lekki Phase 1, Lagos.

Price: ₦600,000,000
Title: Governor's Consent

This terraced duplex offers ensuite bedrooms, fully fitted kitchen and bathrooms, ample parking, 24/7 security, and a serene environment in one of Lekki's most sought-after neighbourhoods.`,
    descriptionExtra:
      "Property Ref: 3448435. Market Status: Available. Type: Terraced Duplex. Bedrooms: 4. Bathrooms: 4. Toilets: 5. Parking Spaces: 3.",
    highlights: [
      "Ensuite bedrooms",
      "Fully fitted kitchen",
      "Fully fitted bathrooms",
      "Ample parking space",
      "24/7 security",
      "Serene environment",
      "Self compound with BQ",
      "Close to the express",
      "Governor's Consent",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 4,
      parking: "3 spaces",
      bq: "Yes",
      smartHome: "No",
      generator: "Optional",
      solar: "Optional",
      intercom: "No",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Fitted",
      balcony: "Terrace",
    },
    amenities: [
      "Ensuite Bedrooms",
      "Fitted Kitchen",
      "Fitted Bathrooms",
      "Parking",
      "24/7 Security",
      "Boys' Quarters",
      "Self Compound",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/terraced-duplexes/lagos/lekki/lekki-phase-1/3448435-exclusive-4-bedrooms-terrace-plus-bq-in-a-self-compund",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Admiralty Way, Lekki",
      "Lekki-Ikoyi Link Bridge",
      "Palms Shopping Mall",
      "Lekki Conservation Centre",
    ],
  },
  {
    id: "4",
    slug: "chevron-toll-gate-lekki",
    imageFolder: CHEVRON_TOLL_GATE_FOLDER,
    images: chevronTollGateImages,
    cardImage: estateImagePath(CHEVRON_TOLL_GATE_FOLDER, "1.jpg"),
    title: "4 bedroom semi-detached duplex for sale",
    fullTitle:
      "Newly Built 4 Bedroom Semi-Detached Self Compound Duplex with BQ, Pool & Gym",
    address: "Chevron Toll Gate, Orchid, Lekki, Lagos, Nigeria",
    badge: "Suite",
    badgeClass: "bg-pink",
    listingType: "For Sale",
    category: "Semi-Detached Duplex",
    price: "₦220,000,000",
    listedOn: "15 Mar 2026",
    lastUpdated: "15 Mar 2026",
    rating: 5.0,
    beds: 4,
    baths: 4,
    sqft: "",
    visits: 36,
    shortDescription:
      "4 bedroom semi-detached duplex with BQ, pool and gym in a secured estate, Chevron Toll Gate, Lekki.",
    description: `For Sale: Newly built 4 bedroom semi-detached self compound duplex with BQ, swimming pool and gym in a secured estate at Chevron Toll Gate, Orchid, Lekki.

Price: ₦220,000,000
Title: Governor's Consent

Features include BQ, swimming pool, ensuite rooms, aesthetic POP ceilings, spot lighting, chandelier, sound system, spacious living room, CCTV cameras, clean water, top quality tiles, pantry, island countertop, master's suite with walk-in closet, walk-in shower, Jacuzzi, custom vanity, good access roads, and a flood-free location.`,
    descriptionExtra: `Property Ref: 3390070. Market Status: Available. Type: Semi-Detached Duplex. Bedrooms: 4. Bathrooms: 4. Toilets: 5. Parking Spaces: 3.

Source listing enquiries: Stephen — WhatsApp 08171969365, Phone 08136522011 / 09155232992, Email idealplaceprop@gmail.com`,
    highlights: [
      "BQ with self compound layout",
      "Swimming pool and gym",
      "Ensuite bedrooms",
      "Aesthetic POP ceilings and spot lighting",
      "Chandelier and sound system",
      "Spacious living room",
      "CCTV cameras and clean water supply",
      "Pantry with island countertop",
      "Master's suite with walk-in closet",
      "Walk-in shower, Jacuzzi and custom vanity",
      "Good access roads — flood free",
      "Governor's Consent",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 4,
      parking: "3 spaces",
      bq: "Yes",
      smartHome: "CCTV",
      generator: "Stand-by",
      solar: "Optional",
      intercom: "No",
      outdoorKitchen: "No",
      laundry: "Pantry",
      furnishing: "Fitted",
      balcony: "Yes",
    },
    amenities: [
      "Swimming Pool",
      "Gym",
      "Boys' Quarters",
      "CCTV",
      "Ensuite Bedrooms",
      "Master's Suite",
      "Secure Estate",
      "Parking",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/semi-detached-duplexes/lagos/lekki/3390070-luxury-4-bedroom-semi-detached-duplex-with-bq-pool-gym",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Chevron Toll Gate",
      "Orchid Road, Lekki",
      "Lekki Phase 1",
      "Novare Mall, Lekki",
    ],
  },
  {
    id: "5",
    slug: "awkaka-estate-port-harcourt",
    imageFolder: AWKAKA_ESTATE_FOLDER,
    images: awkakaEstateImages,
    cardImage: estateImagePath(AWKAKA_ESTATE_FOLDER, "1.jpg"),
    title: "4 bedroom detached duplex for sale",
    fullTitle:
      "Executive Luxury 4 Bedroom Detached Duplex with Self-Contain BQ",
    address: "Akwaka Estate, Rumuodomaya, Port Harcourt, Nigeria",
    badge: "Duplex",
    badgeClass: "bg-secondary",
    listingType: "For Sale",
    category: "Detached Duplex",
    price: "₦200,000,000",
    listedOn: "2 Jun 2026",
    lastUpdated: "2 Jun 2026",
    rating: 5.0,
    beds: 4,
    baths: 4,
    sqft: "289 sqm",
    visits: 22,
    shortDescription:
      "4 bedroom detached duplex with self-contain BQ for sale at Akwaka Estate, Rumuodomaya, Port Harcourt.",
    description: `Beautifully finished 4-bedroom detached duplex with a self-contain boys' quarters at Akwaka Estate, Rumuodomaya, Port Harcourt.

Land Size: 289 sqm
Price: ₦200,000,000

Whether you're looking for your dream home or a premium real estate investment, this property offers comfort, security, and modern living in one of Port Harcourt's fastest growing residential estates.`,
    descriptionExtra: `Property Ref: 3508201. Market Status: Available. Type: Detached Duplex. Bedrooms: 4. Bathrooms: 4. Toilets: 5. Parking Spaces: 4. Total Area: 289 sqm. Covered Area: 212 sqm.`,
    highlights: [
      "All rooms ensuite",
      "Self-contain boys' quarters",
      "Fitted kitchen with pantry",
      "Water heaters throughout",
      "POP ceiling with luxury chandeliers",
      "Interlock flooring",
      "Electric fence",
      "Tarred roads and good drainage",
      "Constant electricity supply",
      "Highly secured neighbourhood",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 4,
      parking: "4 spaces",
      bq: "Self-Contain BQ",
      smartHome: "No",
      generator: "Optional",
      solar: "Optional",
      intercom: "No",
      outdoorKitchen: "No",
      laundry: "Pantry",
      furnishing: "Finished",
      balcony: "Yes",
    },
    amenities: [
      "Ensuite Bedrooms",
      "Boys' Quarters",
      "Fitted Kitchen",
      "Pantry",
      "Water Heaters",
      "POP Ceiling",
      "Electric Fence",
      "Secure Estate",
      "Parking",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/detached-duplexes/rivers/port-harcourt/rumuodomaya/3508201-executive-luxury-4-bedroom-duplex-with-self-contain",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Port Harcourt Mall",
      "University of Port Harcourt",
      "Rivers State University",
      "Rumuokoro Market",
    ],
  },
  {
    id: "6",
    slug: "cornerstone-estate-port-harcourt",
    imageFolder: CORNERSTONE_ESTATE_FOLDER,
    images: cornerstoneEstateImages,
    cardImage: estateImagePath(CORNERSTONE_ESTATE_FOLDER, "1.jpg"),
    title: "5 bedroom detached duplex for sale",
    fullTitle: "Exotic 5 Bedroom Duplex with Quality Finishing",
    address: "Cornerstone Estate, Off NTA Road, Port Harcourt, Nigeria",
    badge: "Luxury",
    badgeClass: "bg-pink",
    listingType: "For Sale",
    category: "Detached Duplex",
    price: "₦210,000,000",
    listedOn: "2 Jun 2026",
    lastUpdated: "2 Jun 2026",
    rating: 5.0,
    beds: 5,
    baths: 4,
    sqft: "777 sqm",
    visits: 31,
    shortDescription:
      "5 bedroom luxury detached duplex on 777 sqm at Cornerstone Estate, Off NTA Road, Port Harcourt.",
    description: `Imagine owning a luxury 5-bedroom duplex sitting on 777 sqm in one of the most secured and fast-rising areas off NTA Road, Port Harcourt.

This is not just a house — it's a statement of class, comfort and investment.

Cornerstone Estate, Off NTA Road, Port Harcourt
Price: ₦210,000,000

Perfect for families, executives, Airbnb investment, and smart investors seeking a premium address in a fast-rising Port Harcourt neighbourhood.`,
    descriptionExtra: `Property Ref: 3507180. Market Status: Available. Type: Detached Duplex. Bedrooms: 5. Bathrooms: 4. Toilets: 6. Parking Spaces: 6. Total Area: 777 sqm. Covered Area: 386 sqm.`,
    highlights: [
      "Fully fitted kitchen",
      "Air-conditioners in all rooms",
      "CCTV security",
      "Massive compound with car port",
      "Gate house and power room",
      "Family lounge and office space",
      "Kids playground and sit-out area",
      "Stunning chandeliers and POP finishing",
      "777 sqm land in a secured estate",
      "Ideal for family living or investment",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 5,
      bathrooms: 4,
      parking: "6 spaces",
      bq: "Gate House",
      smartHome: "CCTV",
      generator: "Power Room",
      solar: "Optional",
      intercom: "No",
      outdoorKitchen: "Sit-Out",
      laundry: "Yes",
      furnishing: "Fitted",
      balcony: "Yes",
    },
    amenities: [
      "Fitted Kitchen",
      "Air-Conditioning",
      "CCTV Security",
      "Car Port",
      "Gate House",
      "Family Lounge",
      "Office Space",
      "Kids Playground",
      "POP Ceiling",
      "Secure Estate",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/detached-duplexes/rivers/port-harcourt/ozuoba/3507180-exotic-5-bedroom-duplex-with-quality-finishing",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "NTA Road, Port Harcourt",
      "Ozuoba, Port Harcourt",
      "University of Port Harcourt",
      "Port Harcourt Mall",
    ],
  },
  {
    id: "7",
    slug: "ikoyi-terrace-lagos",
    imageFolder: IKOYI_ESTATE_FOLDER,
    images: ikoyiEstateImages,
    cardImage: estateImagePath(IKOYI_ESTATE_FOLDER, "1.jpg"),
    title: "4 bedroom terraced duplex for rent",
    fullTitle: "Four Bedroom Terrace with Two Rooms BQ, Ikoyi, Lagos",
    address: "Ikoyi, Lagos, Nigeria",
    badge: "Terrace",
    badgeClass: "bg-primary",
    listingType: "For Rent",
    category: "Terraced Duplex",
    price: "₦75,000,000",
    priceLabel: "per annum",
    listedOn: "18 May 2026",
    lastUpdated: "18 May 2026",
    rating: 5.0,
    beds: 4,
    baths: 5,
    sqft: "",
    visits: 27,
    shortDescription:
      "4 bedroom terraced duplex with two-room BQ for rent in Ikoyi, Lagos.",
    description: `For rent: a refined 4-bedroom terraced duplex with two-room boys' quarters in Ikoyi, Lagos — one of the city's most prestigious and secure residential addresses.

Annual Rent: ₦75,000,000 per annum

This home is suited for executives, diplomatic families, and premium tenants seeking privacy, comfort, and proximity to Lagos Island's business and leisure districts. Ikoyi offers excellent road networks, upscale shopping on Awolowo Road, fine dining, and access to leading schools and corporate hubs.

The layout provides generous ensuite accommodation, dedicated service quarters, ample parking, and a polished interior finish ideal for long-term luxury rental living.`,
    descriptionExtra: `Property Ref: 3485625. Market Status: Available. Type: Terraced Duplex. Bedrooms: 4. Bathrooms: 5. Toilets: 5. Parking Spaces: 3.`,
    highlights: [
      "4 ensuite bedrooms",
      "Two-room boys' quarters",
      "Terraced duplex in Ikoyi",
      "Premium Lagos address",
      "3 parking spaces",
      "Ideal for executives and families",
      "Close to Awolowo Road and Lagos Island",
      "Secure, upscale neighbourhood",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 5,
      parking: "3 spaces",
      bq: "2-Room BQ",
      smartHome: "No",
      generator: "Optional",
      solar: "Optional",
      intercom: "Optional",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Unfurnished",
      balcony: "Terrace",
    },
    amenities: [
      "Ensuite Bedrooms",
      "Boys' Quarters",
      "Parking",
      "Terraced Duplex",
      "Secure Neighbourhood",
      "Ikoyi Location",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/houses/terraced-duplexes/lagos/ikoyi/3485625-four-bedroom-terrace-with-two-rooms-bq",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Awolowo Road, Ikoyi",
      "National Museum, Onikan",
      "Parkview Estate, Ikoyi",
      "Lekki-Ikoyi Link Bridge",
    ],
  },
  {
    id: "8",
    slug: "ikate-chisco-lekki",
    imageFolder: IKATE_CHISCO_FOLDER,
    images: ikateChiscoImages,
    cardImage: estateImagePath(IKATE_CHISCO_FOLDER, "1.jpeg"),
    title: "2 bedroom flat / apartment for rent",
    fullTitle: "Serviced 2 Bedroom Apartment with AC and Swimming Pool, Ikate Lekki",
    address: "Ikate Chisco, Ikate, Lekki, Lagos, Nigeria",
    badge: "Apartment",
    badgeClass: "bg-secondary",
    listingType: "For Rent",
    category: "Flat / Apartment",
    price: "₦7,000,000",
    priceLabel: "per annum",
    listedOn: "3 Jun 2026",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 2,
    baths: 2,
    sqft: "Ground Floor",
    visits: 19,
    shortDescription:
      "Ground floor serviced 2 bedroom apartment with AC and swimming pool for rent at Ikate Chisco, Lekki.",
    description: `FOR RENT — GROUND FLOOR

Well maintained serviced 2-bedroom apartment with air-conditioners and swimming pool at Ikate Chisco, Ikate, Lekki, Lagos.

Annual Rent: ₦7,000,000 per annum
Agency / Legal Commission (A/L/C): 10%
Service Charge: ₦800,000 per annum
Electricity: ₦300 per kilowatt (light)

This ground-floor unit offers comfortable serviced living in a well-maintained Ikate development, with pool access and AC throughout — ideal for professionals and small families seeking a ready-to-move Lekki address.

Note: A logistic fee of ₦10,000 applies. Kindly take note before sending a message for inspection.`,
    descriptionExtra: `Property Ref: 3509670. Market Status: Available. Type: Flat / Apartment. Bedrooms: 2. Bathrooms: 2. Toilets: 3. Servicing: Serviced. Service Charge: ₦800,000 per annum.`,
    highlights: [
      "Ground floor serviced apartment",
      "Air-conditioners in unit",
      "Swimming pool access",
      "Well maintained development",
      "Ikate Chisco, Lekki location",
      "Service charge: ₦800,000 per annum",
      "Ideal for professionals and small families",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 2,
      bathrooms: 2,
      parking: "Yes",
      bq: "No",
      smartHome: "No",
      generator: "Serviced",
      solar: "No",
      intercom: "Optional",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Serviced",
      balcony: "Ground Floor",
    },
    amenities: [
      "Swimming Pool",
      "Air-Conditioning",
      "Serviced Apartment",
      "Ground Floor Unit",
      "Secure Estate",
      "Ikate Lekki Location",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/flats-apartments/lagos/lekki/ikate/3509670-serviced-2bedroom-apartment",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Ikate Elegushi, Lekki",
      "Lekki Phase 1",
      "Chevron Toll Gate",
      "Novare Mall, Lekki",
    ],
  },
  {
    id: "9",
    slug: "royal-estate-port-harcourt",
    imageFolder: ROYAL_ESTATE_FOLDER,
    images: royalEstateImages,
    cardImage: estateImagePath(ROYAL_ESTATE_FOLDER, "1.jpg"),
    title: "3 bedroom flat / apartment for rent",
    fullTitle: "Luxury 3 Bedroom Duplex with Study and Federal Light, Royal Estate",
    address: "Royal Estate, SARS Road, Rukpokwu, Port Harcourt, Nigeria",
    badge: "Apartment",
    badgeClass: "bg-secondary",
    listingType: "For Rent",
    category: "Flat / Apartment",
    price: "₦6,000,000",
    priceLabel: "per annum",
    listedOn: "3 Jun 2026",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 3,
    baths: 3,
    sqft: "",
    visits: 24,
    shortDescription:
      "Modern 3 bedroom duplex with library room for rent at Royal Estate, SARS Road, Rukpokwu, Port Harcourt.",
    description: `Modern 3-bedroom duplex with a library room for rent at Royal Estate, SARS Road, Rukpokwu, Port Harcourt.

Annual Rent: ₦6,000,000 per annum

This contemporary home combines comfort and smart finishing in a well-located Royal Estate address — ideal for families and professionals seeking reliable power, secure access, and modern amenities in Port Harcourt.

Features include federal light system, dedicated library room, gas cooker with oven, camera and fingerprint-sensored door, ample parking, personal water tanks, LED sensor lighting, chandeliers, walk-in closet, fridge, dressing mirrors, and kitchen store.`,
    descriptionExtra: `Property Ref: 3507148. Market Status: Available. Location: SARS Road, Port Harcourt, Rukpokwu.`,
    highlights: [
      "Federal light system",
      "Library / study room",
      "Gas cooker with oven",
      "Camera and fingerprint-sensored door",
      "Ample parking space",
      "Personal water tanks",
      "LED sensor lighting and chandeliers",
      "Walk-in closet",
      "Fridge and dressing mirrors",
      "Kitchen store",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 3,
      bathrooms: 3,
      parking: "Ample",
      bq: "No",
      smartHome: "Fingerprint Door",
      generator: "Federal Light",
      solar: "No",
      intercom: "CCTV",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Fitted",
      balcony: "Yes",
    },
    amenities: [
      "Federal Light System",
      "Library Room",
      "Fingerprint Door",
      "CCTV Security",
      "Parking",
      "Walk-in Closet",
      "Fitted Kitchen",
      "Water Tanks",
      "Royal Estate Location",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/flats-apartments/rivers/port-harcourt/rukpokwu/3507148-luxury-3-bedroom-duplex-with-study-and-federal-light",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "SARS Road, Port Harcourt",
      "Rukpokwu, Port Harcourt",
      "Port Harcourt Mall",
      "University of Port Harcourt",
    ],
  },
  {
    id: "10",
    slug: "obiri-ikwerre-port-harcourt",
    imageFolder: OBIRI_IKWERRE_FOLDER,
    images: obiriIkwerreImages,
    cardImage: estateImagePath(OBIRI_IKWERRE_FOLDER, "1.jpg"),
    title: "2 bedroom detached duplex for rent",
    fullTitle: "Verified Modern 2 Bedroom Duplex, Obiri Ikwerre Road",
    address: "Off Obiri Ikwerre Road, Port Harcourt, Nigeria",
    badge: "Duplex",
    badgeClass: "bg-pink",
    listingType: "For Rent",
    category: "Detached Duplex",
    price: "₦4,000,000",
    priceLabel: "per annum",
    listedOn: "25 May 2026",
    lastUpdated: "25 May 2026",
    rating: 5.0,
    beds: 2,
    baths: 3,
    sqft: "",
    visits: 21,
    shortDescription:
      "Brand new 2 bedroom detached duplex for rent off Obiri Ikwerre Road, Port Harcourt.",
    description: `Brand new 2-bedroom detached duplex for rent off Obiri Ikwerre Road, Port Harcourt.

Annual Rent: ₦4,000,000 per annum

This verified modern duplex sits in a gated and secure estate with a serene, well-organised environment and tarred access road — ideal for professionals and small families seeking comfort, reliable power, and contemporary finishing in Port Harcourt.`,
    descriptionExtra: `Property Ref: 3489216. Market Status: Available. Type: Detached Duplex. Bedrooms: 2. Bathrooms: 3. Toilets: 3. Parking Spaces: 2.`,
    highlights: [
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
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 2,
      bathrooms: 3,
      parking: "2 spaces",
      bq: "No",
      smartHome: "No",
      generator: "Band A Power",
      solar: "No",
      intercom: "No",
      outdoorKitchen: "No",
      laundry: "Pantry",
      furnishing: "Fitted",
      balcony: "Yes",
    },
    amenities: [
      "Gated Estate",
      "Band A Power",
      "Prepaid Meter",
      "Fitted Kitchen",
      "Wardrobes",
      "POP Ceiling",
      "Parking",
      "Secure Environment",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/houses/detached-duplexes/rivers/port-harcourt/3489216-verified-modern-2-bedroom-duplex",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Obiri Ikwerre Road, Port Harcourt",
      "Rumuokoro, Port Harcourt",
      "Port Harcourt International Airport",
      "University of Port Harcourt",
    ],
  },
  {
    id: "11",
    slug: "amino-kano-wuse-2",
    imageFolder: AMINO_KANO_FOLDER,
    images: aminoKanoImages,
    cardImage: estateImagePath(AMINO_KANO_FOLDER, "1.jpeg"),
    title: "3 bedroom terraced duplex for rent",
    fullTitle: "Luxury Spacious 3 Bedroom Terraced Duplex with BQ, Wuse 2",
    address: "Off Amino Kano, Wuse 2, Abuja, Nigeria",
    badge: "Terrace",
    badgeClass: "bg-primary",
    listingType: "For Rent",
    category: "Terraced Duplex",
    price: "₦20,000,000",
    priceLabel: "per annum",
    listedOn: "3 Jun 2026",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 3,
    baths: 3,
    sqft: "Mini Estate",
    visits: 26,
    shortDescription:
      "3 bedroom terraced duplex with BQ for rent off Amino Kano, Wuse 2, Abuja.",
    description: `TO LET — A well finished 3-bedroom terraced duplex with servant quarters in a mini estate, off Amino Kano, Wuse 2, Abuja.

Annual Rent: ₦20,000,000 per annum
Caution Deposit: ₦2,000,000
Agency Fee: 10%
Legal Fee: 10%
VAT: 6.976% of fees

All rooms are ensuite with guest toilet, spacious bedrooms, and a fitted kitchen with modern facilities. This home offers premium Abuja living in one of Wuse 2's most accessible corridors — ideal for executives, diplomats, and families seeking a secure mini-estate address.`,
    descriptionExtra: `Property Ref: 3509731. Market Status: Available. Type: Terraced Duplex. Bedrooms: 3. Bathrooms: 3. Toilets: 4. Parking Spaces: 4. Location: Wuse 2 Main.`,
    highlights: [
      "3-bedroom terraced duplex with BQ",
      "Mini estate setting",
      "All rooms ensuite",
      "Guest toilet",
      "Spacious bedrooms",
      "Fitted kitchen with modern facilities",
      "Wuse 2 main location",
      "4 parking spaces",
      "Ideal for executives and families",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 3,
      bathrooms: 3,
      parking: "4 spaces",
      bq: "Servant Quarters",
      smartHome: "No",
      generator: "Optional",
      solar: "Optional",
      intercom: "Optional",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Finished",
      balcony: "Terrace",
    },
    amenities: [
      "Ensuite Bedrooms",
      "Boys' Quarters",
      "Fitted Kitchen",
      "Guest Toilet",
      "Mini Estate",
      "Parking",
      "Wuse 2 Location",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/houses/terraced-duplexes/abuja/wuse-2/3509731-luxury-spacious-3-bedroom-duplex-with-bq",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Amino Kano Crescent, Wuse 2",
      "Banex Plaza, Abuja",
      "Millennium Park Abuja",
      "Transcorp Hilton Abuja",
    ],
  },
  {
    id: "12",
    slug: "von-axis-lugbe",
    imageFolder: VON_AXIS_FOLDER,
    images: vonAxisImages,
    cardImage: estateImagePath(VON_AXIS_FOLDER, "1.jpeg"),
    title: "4 bedroom semi-detached duplex for rent",
    fullTitle: "Standard 4 Bedroom Semi-Detached Duplex, Von Axis Lugbe",
    address: "Von Axis, Lugbe District, Abuja, Nigeria",
    badge: "Semi-Detached",
    badgeClass: "bg-pink",
    listingType: "For Rent",
    category: "Semi-Detached Duplex",
    price: "₦6,000,000",
    priceLabel: "per annum",
    listedOn: "3 Jun 2026",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 4,
    baths: 4,
    sqft: "Estate",
    visits: 23,
    shortDescription:
      "4 bedroom semi-detached duplex for rent at Von Axis, Lugbe, Abuja — close to the express.",
    description: `Standard and well-built 4-bedroom semi-detached duplex for rent in an estate close to the express at Von Axis, Lugbe, Abuja.

Annual Rent: ₦6,000,000 per annum
Service Charge: ₦200,000
Refundable Caution Fee: ₦300,000
Agency / Legal (A/L): 25%
Inspection Fee: ₦15,000

This home offers practical family living in a secure Lugbe estate with good access to the Abuja express corridor — suited for tenants seeking space, value, and a well-organised neighbourhood.`,
    descriptionExtra: `Property Ref: 3509560. Market Status: Available. Type: Semi-Detached Duplex. Bedrooms: 4. Bathrooms: 4. Toilets: 5.`,
    highlights: [
      "4-bedroom semi-detached duplex",
      "Secure estate close to the express",
      "Standard, well-built finish",
      "Von Axis, Lugbe location",
      "Service charge: ₦200,000",
      "Refundable caution fee: ₦300,000",
      "Ideal for family rental living",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 4,
      parking: "Yes",
      bq: "Optional",
      smartHome: "No",
      generator: "Optional",
      solar: "Optional",
      intercom: "No",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Standard",
      balcony: "Yes",
    },
    amenities: [
      "Ensuite Bedrooms",
      "Secure Estate",
      "Express Access",
      "Semi-Detached Layout",
      "Parking",
      "Lugbe Location",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-rent/houses/semi-detached-duplexes/abuja/lugbe-district/3509560-standard-4-bedroom-duplex",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "Von Axis, Lugbe",
      "Abuja Airport Road",
      "Galadimawa, Abuja",
      "Games Village, Abuja",
    ],
  },
  {
    id: "13",
    slug: "yona-residences-guzape",
    imageFolder: GUZAPE_DISTRICT_FOLDER,
    images: guzapeDistrictImages,
    cardImage: estateImagePath(GUZAPE_DISTRICT_FOLDER, "1.jpg"),
    title: "4 bedroom semi-detached duplex for sale",
    fullTitle:
      "YONA Residences — 4 Bedroom Luxury Semi-Detached Duplex with BQ, Guzape Hills",
    address:
      "Behind NNPC Filling Station, Guzape District, Abuja, Nigeria",
    badge: "Semi-Detached",
    badgeClass: "bg-pink",
    listingType: "For Sale",
    category: "Semi-Detached Duplex",
    price: "₦650,000,000",
    listedOn: "23 Jan 2025",
    lastUpdated: "3 Jun 2026",
    rating: 5.0,
    beds: 4,
    baths: 5,
    sqft: "250 sqm",
    visits: 33,
    shortDescription:
      "Premium 4-bedroom semi-detached duplex at YONA Residences, Guzape Hills, Abuja.",
    description: `YONA RESIDENCES — Premium 4-Bedroom Semi-Detached Duplexes in Guzape Hills, Abuja

Location: Guzape Hills, directly behind the NNPC Filling Station, Abuja
Price: ₦650,000,000

Development Type: Off-Plan Residential Project
Delivery Timeline: 6 Months
Payment Plan: Flexible and convenient installment options available

Introducing YONA Residences, an exclusive collection of elegantly designed 4-bedroom semi-detached duplexes in the highly sought-after Guzape Hills district — combining sophistication, functionality, and modern comfort for discerning homeowners and investors.

Each residence features four spacious ensuite bedrooms, a grand main living room, private family lounge, fully fitted kitchen, dedicated dining area, private study/home office, three-car private garage, and premium quality finishes throughout.

Exclusive amenities include fibre-to-the-home internet, estate swimming pool, lawn tennis court, residents' clubhouse, and professionally managed estate infrastructure in a secure, serene environment.`,
    descriptionExtra: `Property Ref: 2678553. Market Status: Available. Type: Semi-Detached Duplex. Bedrooms: 4. Bathrooms: 5. Toilets: 5. Parking Spaces: 3. Furnishing: Furnished. Total Area: 250 sqm. Covered Area: 250 sqm. Approximate travel times: 5–10 minutes to leading international schools; 8–15 minutes to major hospitals; 11 minutes to ECOWAS Headquarters; 16 minutes to Abuja CBD; 41 minutes to Nnamdi Azikiwe International Airport.`,
    highlights: [
      "YONA Residences off-plan development",
      "Four spacious ensuite bedrooms with BQ",
      "Grand living room and family lounge",
      "Fully fitted kitchen and dining area",
      "Private study / home office",
      "Three-car private garage",
      "Estate pool, tennis court and clubhouse",
      "FTTH high-speed internet",
      "6-month delivery timeline",
      "Flexible payment plan available",
      "Prime Guzape Hills location",
    ],
    features: {
      ...defaultFeatures,
      bedrooms: 4,
      bathrooms: 5,
      parking: "3-car garage",
      bq: "Yes",
      smartHome: "FTTH Internet",
      generator: "Estate",
      solar: "Optional",
      intercom: "Yes",
      outdoorKitchen: "No",
      laundry: "Yes",
      furnishing: "Furnished",
      balcony: "Yes",
    },
    amenities: [
      "Swimming Pool",
      "Tennis Court",
      "Clubhouse",
      "FTTH Internet",
      "Ensuite Bedrooms",
      "Boys' Quarters",
      "Secure Estate",
      "Parking",
    ],
    sourceUrl:
      "https://nigeriapropertycentre.com/for-sale/houses/semi-detached-duplexes/abuja/guzape-district/2678553-4-bedrooms-luxury-semi-detached-duplex-and-a-bq",
    agentAvatar: "assets/img/logo.svg",
    agentName: "Dueno Property Team",
    nearbyLandmarks: [
      "NNPC Filling Station, Guzape",
      "Guzape Hills, Abuja",
      "ECOWAS Headquarters",
      "Abuja Central Business District",
    ],
  },
];

const getMergedProperties = (): EstateProperty[] => {
  const deleted = new Set(getDeletedStaticIds());
  const catalog = ESTATE_PROPERTIES.filter((property) => !deleted.has(property.id));
  const published = getPublishedListings();
  const catalogSlugs = new Set(catalog.map((property) => property.slug));
  const uniquePublished = published.filter(
    (property) => !catalogSlugs.has(property.slug),
  );
  return [...catalog, ...uniquePublished].map(normalizeLiveProperty);
};

const normalizeLiveProperty = (property: EstateProperty): EstateProperty => ({
  ...property,
  price: formatPropertyPrice(property.price),
  agentAvatar: resolvePropertyAgentAvatar(property),
});

export const FEATURED_SALE_PROPERTY_IDS = ["1", "2", "3", "4", "5", "6", "13"] as const;
export const FEATURED_RENT_PROPERTY_IDS = ["7", "8", "9", "10", "11", "12"] as const;

const PROPERTY_CARD_TYPE_LABELS: Record<string, string> = {
  "Detached Duplex": "Duplex",
  "Terraced Duplex": "Terrace",
  "Semi-Detached Duplex": "Semi-Detached",
  "Flat / Apartment": "Apartment",
};

/** Short property type shown on listing cards (Bed · Bath · Type). */
export const getPropertyCardTypeLabel = (property: EstateProperty) =>
  PROPERTY_CARD_TYPE_LABELS[property.category] ?? property.category;

export const getEstatePropertyById = (id: string) =>
  getMergedProperties().find((property) => property.id === id);

/** Resolve a property by URL slug or legacy numeric id. */
export const getEstatePropertyByRef = (ref: string) =>
  getMergedProperties().find(
    (property) => property.slug === ref || property.id === ref,
  );

export const getRelatedProperties = (excludeId: string) =>
  getMergedProperties().filter((property) => property.id !== excludeId);

const resolvePropertyRef = (
  ref: EstateProperty | string,
): EstateProperty | undefined =>
  typeof ref === "string" ? getEstatePropertyByRef(ref) : ref;

export const getBuyDetailsPath = (ref: EstateProperty | string) => {
  const property = resolvePropertyRef(ref);
  return property
    ? `/buy-details/${property.slug}`
    : `/buy-details/${typeof ref === "string" ? ref : ""}`;
};

export const getRentDetailsPath = (ref: EstateProperty | string) => {
  const property = resolvePropertyRef(ref);
  return property
    ? `/rent-details/${property.slug}`
    : `/rent-details/${typeof ref === "string" ? ref : ""}`;
};

export const getPropertyDetailsPath = (property: EstateProperty) =>
  property.listingType === "For Sale"
    ? getBuyDetailsPath(property)
    : getRentDetailsPath(property);

export const DEFAULT_SALE_PROPERTY_SLUG = "wells-carlton-abuja";
export const DEFAULT_RENT_PROPERTY_SLUG = "ikoyi-terrace-lagos";

export const FEATURED_CAROUSEL_LIMIT = 12;

export const getFeaturedProperties = (ids: readonly string[]) =>
  ids
    .map((id) => getEstatePropertyById(id))
    .filter((property): property is EstateProperty => Boolean(property));

const mergeFeaturedProperties = (
  listingType: EstateProperty["listingType"],
  staticIds: readonly string[],
): EstateProperty[] => {
  const seen = new Set<string>();
  const result: EstateProperty[] = [];

  const agentListings = getMergedProperties()
    .filter(
      (property) =>
        property.listingType === listingType &&
        Boolean(property.agentId) &&
        Boolean(property.publishedAt),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

  for (const property of agentListings) {
    if (!seen.has(property.id)) {
      result.push(property);
      seen.add(property.id);
    }
  }

  for (const id of staticIds) {
    const property = getEstatePropertyById(id);
    if (
      property &&
      property.listingType === listingType &&
      !seen.has(property.id)
    ) {
      result.push(property);
      seen.add(property.id);
    }
  }

  return result.slice(0, FEATURED_CAROUSEL_LIMIT);
};

export const getFeaturedSaleProperties = () =>
  mergeFeaturedProperties("For Sale", FEATURED_SALE_PROPERTY_IDS);

export const getFeaturedRentProperties = () =>
  mergeFeaturedProperties("For Rent", FEATURED_RENT_PROPERTY_IDS);

export const getSaleProperties = () =>
  getMergedProperties().filter((property) => property.listingType === "For Sale");

export const getRentProperties = () =>
  getMergedProperties().filter((property) => property.listingType === "For Rent");

export const getAllLiveProperties = () => getMergedProperties();

export const RECOMMENDED_LOCATION_SLUGS = [
  "lagos-ikoyi",
  "lagos-ikeja",
  "abuja",
  "port-harcourt",
  "ibadan",
] as const;

export type RecommendedLocationSlug =
  (typeof RECOMMENDED_LOCATION_SLUGS)[number];

type RecommendedLocationConfig = {
  label: string;
  matchers: RegExp[];
};

export const RECOMMENDED_LOCATIONS: Record<
  RecommendedLocationSlug,
  RecommendedLocationConfig
> = {
  "lagos-ikoyi": {
    label: "Lagos, Ikoyi",
    matchers: [/\bikoyi\b/i],
  },
  "lagos-ikeja": {
    label: "Lagos, Ikeja",
    matchers: [/\bikeja\b/i],
  },
  abuja: {
    label: "Abuja",
    matchers: [/\babuja\b/i],
  },
  "port-harcourt": {
    label: "Port Harcourt",
    matchers: [/port\s*harcourt/i],
  },
  ibadan: {
    label: "Ibadan",
    matchers: [/\bibadan\b/i],
  },
};

const LOCATION_SLUG_ALIASES: Record<string, RecommendedLocationSlug> = {
  ikoyi: "lagos-ikoyi",
  "lagos, ikoyi": "lagos-ikoyi",
  "lagos ikoyi": "lagos-ikoyi",
  ikeja: "lagos-ikeja",
  "lagos, ikeja": "lagos-ikeja",
  "lagos ikeja": "lagos-ikeja",
  abuja: "abuja",
  "port harcourt": "port-harcourt",
  ibadan: "ibadan",
};

const getPropertyLocationText = (property: EstateProperty) =>
  `${property.address} ${property.fullTitle} ${property.title}`.toLowerCase();

export const isRecommendedLocationSlug = (
  slug: string | null | undefined,
): slug is RecommendedLocationSlug =>
  Boolean(slug && slug in RECOMMENDED_LOCATIONS);

export const normalizeLocationSlug = (
  raw: string | null | undefined,
): RecommendedLocationSlug | null => {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (isRecommendedLocationSlug(trimmed)) return trimmed;
  return LOCATION_SLUG_ALIASES[trimmed] ?? null;
};

export const propertyMatchesLocationSlug = (
  property: EstateProperty,
  slug: string | null | undefined,
): boolean => {
  const normalized = normalizeLocationSlug(slug);
  if (!normalized) return true;
  const text = getPropertyLocationText(property);
  return RECOMMENDED_LOCATIONS[normalized].matchers.some((matcher) =>
    matcher.test(text),
  );
};

export const filterPropertiesByLocationSlug = (
  properties: EstateProperty[],
  slug: string | null | undefined,
) => properties.filter((property) => propertyMatchesLocationSlug(property, slug));

export const getLocationFilterLabel = (slug: string | null | undefined) => {
  const normalized = normalizeLocationSlug(slug);
  return normalized ? RECOMMENDED_LOCATIONS[normalized].label : null;
};

export const countPropertiesByLocationSlug = (
  properties: EstateProperty[],
  slug: RecommendedLocationSlug,
) => filterPropertiesByLocationSlug(properties, slug).length;

export const getPropertiesByAgentId = (agentId: string) =>
  getMergedProperties().filter((property) => property.agentId === agentId);

export const DEFAULT_PROPERTY_VIDEO_URL =
  "https://youtube.com/shorts/4C1r0i287wc?si=cF-72bkt7Rl1pPi2";

export const getYoutubeEmbedUrl = (url: string) => {
  const shortsMatch = url.match(/shorts\/([^?&/]+)/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  const watchMatch = url.match(/[?&]v=([^?&/]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const embedMatch = url.match(/embed\/([^?&/]+)/);
  if (embedMatch?.[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  return url;
};

export const getPropertyVideoUrl = (property: EstateProperty) =>
  getYoutubeEmbedUrl(property.videoUrl ?? DEFAULT_PROPERTY_VIDEO_URL);

export const getGoogleMapsEmbedUrl = (address: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const getGoogleMapsSearchUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
