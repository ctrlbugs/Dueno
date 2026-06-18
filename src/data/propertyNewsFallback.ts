import type { PropertyNewsArticle } from "../types/propertyNews";

/** Remote-only stock images used only when no cached live image exists yet. */
export const REMOTE_STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605276374104-de8862ebb770?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
];

const daysAgoIso = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

/** Text fallback when API and cache are both unavailable. Images are always remote. */
export const getPropertyNewsSeed = (): PropertyNewsArticle[] => [
  {
    id: "seed-1",
    title: "Top 10 Tips for First-Time Homebuyers in Nigeria",
    description:
      "Buying your first home? Learn how to budget, choose the right location, and avoid common mistakes in Lagos, Abuja, and beyond.",
    imageUrl: REMOTE_STOCK_IMAGES[0],
    category: "Property Sales",
    publishedAt: daysAgoIso(2),
    sourceUrl: "#",
    sourceName: "Dueno Property",
  },
  {
    id: "seed-2",
    title: "Best Emerging Locations to Invest in African Real Estate",
    description:
      "Discover fast-growing areas across Nigeria and Africa offering strong returns on property investments this year.",
    imageUrl: REMOTE_STOCK_IMAGES[1],
    category: "Invest",
    publishedAt: daysAgoIso(4),
    sourceUrl: "#",
    sourceName: "Dueno Property",
  },
  {
    id: "seed-3",
    title: "Renting vs. Buying: Which Is Right for You?",
    description:
      "A practical guide to help you decide whether to rent or buy based on your lifestyle, finances, and the Nigerian property market.",
    imageUrl: REMOTE_STOCK_IMAGES[2],
    category: "Renting",
    publishedAt: daysAgoIso(6),
    sourceUrl: "#",
    sourceName: "Dueno Property",
  },
];
