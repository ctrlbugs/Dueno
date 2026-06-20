import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import {
  getHeroFeaturedProperties,
  getPropertyDetailsPath,
  type EstateProperty,
} from "../../../../../data/estateProperties";
import { resolvePropertyPrice } from "../../../../../utils/propertyDisplay";

const ROTATION_MS = 20_000;
const FADE_MS = 650;

const formatPriceSuffix = (property: EstateProperty) => {
  if (property.priceLabel) {
    return ` / ${property.priceLabel}`;
  }

  if (property.listingType === "For Rent") {
    return " / per annum";
  }

  return "";
};

type BannerCardContentProps = {
  property: EstateProperty;
  isActive: boolean;
};

const BannerCardContent = ({ property, isActive }: BannerCardContentProps) => {
  const detailsPath = getPropertyDetailsPath(property);
  const displayPrice = resolvePropertyPrice(property.price);

  return (
    <div
      className={`banner-card__content ${
        isActive ? "banner-card__content--active" : "banner-card__content--inactive"
      }`}
      aria-hidden={!isActive}
    >
      <div className="card-img">
        <Link to={detailsPath} tabIndex={isActive ? 0 : -1}>
          <ImageWithBasePath
            src={property.cardImage}
            className="banner-card__image"
            alt={property.title}
          />
        </Link>
      </div>
      <div className="banner-card__body">
        <h6 className="text-white mb-1">
          <Link
            to={detailsPath}
            className="text-white banner-card__title"
            tabIndex={isActive ? 0 : -1}
          >
            {property.title}
          </Link>
        </h6>
        <span
          className="text-white mb-1 d-block banner-card__address"
          title={property.address}
        >
          {property.address}
        </span>
        <p className="rate-info mb-3">
          <span>{displayPrice}</span>
          {formatPriceSuffix(property)}
        </p>
        <div className="d-flex align-items-center card-info">
          <p className="me-3">
            <span className="me-2">
              <i className="material-icons-outlined">bed</i>
            </span>
            {property.beds} Bedroom
          </p>
          <p>
            <span className="me-2">
              <i className="material-icons-outlined">bathtub</i>
            </span>
            {property.baths} Bath
          </p>
        </div>
      </div>
    </div>
  );
};

const HeroFeaturedPropertyCard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const properties = useMemo(
    () => getHeroFeaturedProperties(),
    [refreshKey],
  );
  const [visibleSlot, setVisibleSlot] = useState(0);
  const [slotIndices, setSlotIndices] = useState<[number, number]>([0, 1]);
  const activeIndexRef = useRef(0);
  const visibleSlotRef = useRef(0);

  useEffect(() => {
    const handler = () => setRefreshKey((value) => value + 1);
    window.addEventListener("dueno-published-updated", handler);
    return () => window.removeEventListener("dueno-published-updated", handler);
  }, []);

  useEffect(() => {
    activeIndexRef.current = 0;
    visibleSlotRef.current = 0;
    setVisibleSlot(0);
    setSlotIndices([0, properties.length > 1 ? 1 : 0]);
  }, [properties.length, refreshKey]);

  useEffect(() => {
    if (properties.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % properties.length;
      const hiddenSlot = visibleSlotRef.current === 0 ? 1 : 0;

      setSlotIndices((current) => {
        const next = [...current] as [number, number];
        next[hiddenSlot] = nextIndex;
        return next;
      });

      visibleSlotRef.current = hiddenSlot;
      activeIndexRef.current = nextIndex;
      setVisibleSlot(hiddenSlot);
    }, ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [properties.length, refreshKey]);

  if (properties.length === 0) {
    return null;
  }

  const safeSlotIndices: [number, number] = [
    Math.min(slotIndices[0], properties.length - 1),
    Math.min(slotIndices[1], properties.length - 1),
  ];

  return (
    <div
      className="banner-card-rotator"
      aria-live="polite"
      aria-atomic="true"
      style={{ ["--banner-card-fade-ms" as string]: `${FADE_MS}ms` }}
    >
      <article className="banner-card">
        <div className="banner-card__stage">
          {properties.length === 1 ? (
            <BannerCardContent property={properties[0]} isActive />
          ) : (
            <>
              <BannerCardContent
                property={properties[safeSlotIndices[0]]}
                isActive={visibleSlot === 0}
              />
              <BannerCardContent
                property={properties[safeSlotIndices[1]]}
                isActive={visibleSlot === 1}
              />
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default HeroFeaturedPropertyCard;
