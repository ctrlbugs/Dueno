import { DEFAULT_SITE_URL, sanitizeSiteUrl } from "../utils/siteUrl";

export const SITE_NAME = "Dueno Property";

export const SITE_DEFAULT_TITLE =
  "Dueno Property | Verified Real Estate Sales & Rentals in Nigeria";

export const SITE_DEFAULT_DESCRIPTION =
  "Browse verified property sales and rentals across Nigeria with Dueno Property. Trusted agents, transparent listings, mortgages, moving, cleaning, and artisan services — starting in Abuja.";

export const SITE_KEYWORDS = [
  "Dueno Property",
  "Nigeria real estate",
  "Abuja property",
  "buy property Nigeria",
  "rent property Abuja",
  "verified property listings",
  "real estate agents Nigeria",
  "property for sale Abuja",
  "property for rent Nigeria",
  "real estate services Nigeria",
].join(", ");

export const SITE_OG_IMAGE_PATH = "/assets/img/og/dueno-og.png";
/** Source logo: public/assets/img/logo-white.svg — regenerate PNG with `npm run og:image` */
export const SITE_LOGO_WHITE_PATH = "/assets/img/logo-white.svg";

export const getSiteUrl = () =>
  sanitizeSiteUrl(import.meta.env.VITE_SITE_URL as string | undefined);

export const getAbsoluteUrl = (path = "") => {
  const base = getSiteUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getOgImageUrl = () => getAbsoluteUrl(SITE_OG_IMAGE_PATH);

export type PageMeta = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export const resolvePageMeta = (meta: PageMeta = {}) => {
  const title = meta.title?.includes(SITE_NAME)
    ? meta.title
    : meta.title
      ? `${meta.title} | ${SITE_NAME}`
      : SITE_DEFAULT_TITLE;

  const description = meta.description ?? SITE_DEFAULT_DESCRIPTION;
  const url = getAbsoluteUrl(meta.path ?? "");
  const image = getOgImageUrl();

  return { title, description, url, image };
};

export const PAGE_META_BY_PATH: Record<string, PageMeta> = {
  "/home": {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    path: "/home",
  },
  "/buy-property": {
    title: "Properties for Sale",
    description:
      "Explore verified homes and commercial properties for sale in Nigeria. Filter by location, price, and property type on Dueno Property.",
    path: "/buy-property",
  },
  "/rent-property": {
    title: "Properties for Rent",
    description:
      "Find verified rental listings across Nigeria with clear pricing, trusted agents, and detailed property information on Dueno Property.",
    path: "/rent-property",
  },
  "/services": {
    title: "Real Estate Services",
    description:
      "Property sales, rentals, mortgages, moving, cleaning, and artisan services — everything you need for a seamless property experience with Dueno.",
    path: "/services",
  },
  "/contact-us": {
    title: "Contact Dueno Property",
    description:
      "Get in touch with Dueno Property for listings, partnerships, and service requests. Our team is ready to help in Abuja and across Nigeria.",
    path: "/contact-us",
  },
  "/about-us": {
    title: "About Dueno Property",
    description:
      "Learn about Dueno Property — a modern Nigerian real estate platform connecting buyers, renters, and agents with verified listings and trusted services.",
    path: "/about-us",
  },
  "/agent-list": {
    title: "Find an Agent",
    description:
      "Browse Dueno partner agents across Nigeria. Connect with experienced professionals for property sales, rentals, and local market guidance.",
    path: "/agent-list",
  },
  "/blog-grid": {
    title: "Property News & Insights",
    description:
      "Read the latest property news, market insights, and real estate tips from Dueno Property.",
    path: "/blog-grid",
  },
  "/signin": {
    title: "Sign In",
    description: "Sign in to your Dueno Property account to save listings and track enquiries.",
    path: "/signin",
    noIndex: true,
  },
  "/signup": {
    title: "Create Account",
    description:
      "Create a Dueno Property account to save favourites, send enquiries, and partner as an agent.",
    path: "/signup",
    noIndex: true,
  },
};
