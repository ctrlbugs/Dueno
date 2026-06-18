import { all_routes } from "../feature-module/routes/all_routes";

/**
 * Upload images to: public/assets/img/services/
 *
 * Recommended size (one file per service, used for hero + cards):
 *   1920 x 900 px  — landscape hero (16:7.5)
 *   or 1920 x 1080 px — 16:9
 *
 * Optional separate card crop: 960 x 640 px (3:2)
 *
 * Format: JPG or WebP · keep file under ~500 KB
 * Keep faces/subjects out of the bottom-left corner (text overlay sits there).
 */
export const DUENO_SERVICES_IMAGE_FOLDER = "assets/img/services";

export type DuenoServiceSlug =
  | "property-sales"
  | "property-rentals"
  | "mortgages"
  | "artisan-services"
  | "moving-services"
  | "property-cleaning";

export type DuenoService = {
  slug: DuenoServiceSlug;
  title: string;
  shortDescription: string;
  menuDescription: string;
  heroTitle: string;
  heroDescription: string;
  /** Hero background — upload to public/assets/img/services/ */
  image: string;
  /** Homepage carousel card image (unchanged assets) */
  cardImage: string;
  /** Services mega menu thumbnail */
  megaMenuImage: string;
  features: string[];
  count?: number;
  listingRoute?: string;
};

const serviceImage = (filename: string) =>
  `${DUENO_SERVICES_IMAGE_FOLDER}/${filename}`;

export const DUENO_SERVICES: DuenoService[] = [
  {
    slug: "property-sales",
    title: "Property Sales",
    shortDescription:
      "Buy and sell verified properties with confidence across Nigeria.",
    menuDescription:
      "Buy and sell verified properties with confidence. Transparent pricing, trusted agents, and secure transactions.",
    heroTitle: "Property Sales with Dueno",
    heroDescription:
      "List, market, and close verified property sales with transparent pricing, trusted agents, and secure transactions built for the Nigerian market.",
    image: serviceImage("property-sales.jpg"),
    cardImage: "assets/img/Sales-service.png",
    megaMenuImage: "assets/img/Property-Sales.png",
    count: 288,
    listingRoute: all_routes.buyProperty,
    features: [
      "Verified listings with clear pricing and documentation",
      "Dedicated agent support from enquiry to handover",
      "Marketing reach across high-intent buyers nationwide",
    ],
  },
  {
    slug: "property-rentals",
    title: "Property Rentals",
    shortDescription:
      "Explore verified rentals with honest fees and virtual tours.",
    menuDescription:
      "Explore verified rental listings with virtual tours, clear fee breakdowns, and honest pricing.",
    heroTitle: "Property Rentals Made Simple",
    heroDescription:
      "Find or advertise rental homes with upfront fee breakdowns, verified landlords and agents, and a smoother move-in experience.",
    image: serviceImage("property-rentals.jpg"),
    cardImage: "assets/img/Rentals-services.png",
    megaMenuImage: "assets/img/Property-Rentals.png",
    count: 300,
    listingRoute: all_routes.rentProperty,
    features: [
      "Verified rental listings with clear annual pricing",
      "Virtual tours and detailed property specifications",
      "Support for tenants, landlords, and partner agents",
    ],
  },
  {
    slug: "mortgages",
    title: "Mortgages",
    shortDescription:
      "Compare financing options and get pre-qualified faster.",
    menuDescription:
      "Access trusted mortgage providers, compare financing options, and get pre-qualified faster.",
    heroTitle: "Mortgage Solutions for Your Next Home",
    heroDescription:
      "Connect with trusted mortgage partners, understand your options, and move from pre-qualification to approval with Dueno guiding the process.",
    image: serviceImage("mortgages.jpg"),
    cardImage: "assets/img/Mortgages-services.png",
    megaMenuImage: "assets/img/Mortgages.png",
    features: [
      "Access to vetted mortgage providers",
      "Guidance on documentation and eligibility",
      "Support aligned to your purchase timeline",
    ],
  },
  {
    slug: "artisan-services",
    title: "Artisan Services",
    shortDescription:
      "Vetted plumbers, electricians, painters, and more.",
    menuDescription:
      "Connect with vetted plumbers, electricians, painters, tilers, and other skilled professionals.",
    heroTitle: "Trusted Artisan Services",
    heroDescription:
      "Book skilled artisans for repairs, finishing, and property upgrades — vetted professionals you can rely on before and after move-in.",
    image: serviceImage("artisan-services.jpg"),
    cardImage: "assets/img/Artisan-services.png",
    megaMenuImage: "assets/img/Artisan.png",
    features: [
      "Plumbers, electricians, painters, tilers, and more",
      "Background-checked service partners",
      "Scheduling and follow-up through Dueno",
    ],
  },
  {
    slug: "moving-services",
    title: "Moving Services",
    shortDescription:
      "Reliable relocation experts for a stress-free move.",
    menuDescription:
      "Book reliable relocation experts to make your move smooth, safe, and stress-free.",
    heroTitle: "Moving Services You Can Trust",
    heroDescription:
      "From packing to delivery, our moving partners help you relocate safely — whether you are moving across town or into a new city.",
    image: serviceImage("moving-services.jpg"),
    cardImage: "assets/img/Move-services.png",
    megaMenuImage: "assets/img/Moving-Services.png",
    features: [
      "Residential and commercial relocation support",
      "Insured handling of furniture and valuables",
      "Flexible scheduling around your handover date",
    ],
  },
  {
    slug: "property-cleaning",
    title: "Property Cleaning",
    shortDescription:
      "Post-construction and pre-move cleaning, move-in ready.",
    menuDescription:
      "Professional post-construction and pre-move cleaning services to get your property move-in ready.",
    heroTitle: "Professional Property Cleaning",
    heroDescription:
      "Deep cleaning for new purchases, post-construction sites, and pre-move turnovers so your property is spotless before keys are handed over.",
    image: serviceImage("property-cleaning.jpg"),
    cardImage: "assets/img/Cleaning-services.png",
    megaMenuImage: "assets/img/Property-Cleaning.png",
    features: [
      "Post-construction and pre-move deep cleans",
      "Eco-friendly products available on request",
      "Ideal for landlords, agents, and new homeowners",
    ],
  },
];

export const getDuenoServiceBySlug = (slug: string) =>
  DUENO_SERVICES.find((service) => service.slug === slug);

export const getDuenoServicePath = (slug: DuenoServiceSlug) =>
  `/services/${slug}`;

export const getDuenoServiceRequestPath = (slug: DuenoServiceSlug) =>
  `${all_routes.contactUs}?service=${encodeURIComponent(slug)}`;

export const isServiceDetailPath = (pathname: string) =>
  /^\/services\/[^/]+$/.test(pathname);
