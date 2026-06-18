import { Helmet } from "react-helmet";
import { useLocation } from "react-router";
import { getDuenoServiceBySlug } from "../../data/duenoServices";
import { getEstatePropertyByRef } from "../../data/estateProperties";
import {
  PAGE_META_BY_PATH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  resolvePageMeta,
} from "../../data/siteMeta";
import { authRoutes, publicRoutes } from "./router.link";

type RouteWithMeta = {
  path: string;
  meta_title?: string;
};

const allRoutes = [...publicRoutes, ...authRoutes] as RouteWithMeta[];

const getPropertyMeta = (pathname: string) => {
  const match = pathname.match(/^\/(buy|rent)-details\/([^/]+)$/);
  if (!match?.[2]) return null;

  const property = getEstatePropertyByRef(match[2]);
  if (!property) return null;

  return resolvePageMeta({
    title: property.fullTitle,
    description: `${property.fullTitle} in ${property.address}. ${property.listingType} on Dueno Property — verified listing with agent support and transparent details.`,
    path: pathname,
  });
};

const getServiceMeta = (pathname: string) => {
  const match = pathname.match(/^\/services\/([^/]+)$/);
  if (!match?.[1]) return null;

  const service = getDuenoServiceBySlug(match[1]);
  if (!service) return null;

  return resolvePageMeta({
    title: service.heroTitle,
    description: service.heroDescription,
    path: pathname,
  });
};

export default function SiteMeta() {
  const location = useLocation();

  const meta = (() => {
    const propertyMeta = getPropertyMeta(location.pathname);
    if (propertyMeta) return propertyMeta;

    const serviceMeta = getServiceMeta(location.pathname);
    if (serviceMeta) return serviceMeta;

    const staticMeta = PAGE_META_BY_PATH[location.pathname];
    if (staticMeta) return resolvePageMeta(staticMeta);

    const currentRoute = allRoutes.find(
      (route) => route.path === location.pathname,
    );
    if (currentRoute?.meta_title) {
      return resolvePageMeta({
        title: currentRoute.meta_title.replace(/\s*\|\s*Dueno Property\s*$/i, ""),
        description: SITE_DEFAULT_DESCRIPTION,
        path: location.pathname,
      });
    }

    return resolvePageMeta({ path: location.pathname });
  })();

  const noIndex =
    PAGE_META_BY_PATH[location.pathname]?.noIndex ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/agent");

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <link rel="canonical" href={meta.url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} logo on black background`} />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} logo on black background`} />

      <meta name="theme-color" content="#000000" />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <link rel="image_src" href={meta.image} />
      <meta itemProp="name" content={meta.title} />
      <meta itemProp="description" content={meta.description} />
      <meta itemProp="image" content={meta.image} />
    </Helmet>
  );
}

export { SITE_OG_IMAGE_PATH };
