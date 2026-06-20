import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import type { EstateProperty } from "../../../../data/estateProperties";
import {
  getPropertyCardTypeLabel,
  getPropertyDetailsPath,
} from "../../../../data/estateProperties";
import { isListingNew } from "../../../../utils/listingBadge";
import PropertyCardAgentBadge from "../../../../shared/components/PropertyCardAgentBadge";
import { resolvePropertyPrice } from "../../../../utils/propertyDisplay";
import { estateCarouselInteractionRef } from "./estatePropertyCarouselSettings";

type EstatePropertyCarouselCardProps = {
  property: EstateProperty;
};

const DRAG_THRESHOLD = 8;

const EstatePropertyCarouselCard = ({
  property,
}: EstatePropertyCarouselCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const pointerStart = useRef({ x: 0, y: 0, moved: false });
  const detailsPath = getPropertyDetailsPath(property);
  const displayPrice = resolvePropertyPrice(property.price);
  const showNewBadge = isListingNew(property.publishedAt, property.listedOn);

  const resetPointer = () => {
    pointerStart.current = { x: 0, y: 0, moved: false };
  };

  const markPointerStart = (clientX: number, clientY: number) => {
    pointerStart.current = { x: clientX, y: clientY, moved: false };
  };

  const markPointerMove = (clientX: number, clientY: number) => {
    const { x, y, moved } = pointerStart.current;
    if (moved) {
      return;
    }

    if (
      Math.abs(clientX - x) > DRAG_THRESHOLD ||
      Math.abs(clientY - y) > DRAG_THRESHOLD
    ) {
      pointerStart.current.moved = true;
    }
  };

  const openPropertyDetails = () => {
    if (estateCarouselInteractionRef.dragging || pointerStart.current.moved) {
      resetPointer();
      return;
    }

    navigate(detailsPath);
    resetPointer();
  };

  return (
    <div
      className="property-card mb-0 flex-fill h-100 related-property-card"
      role="link"
      tabIndex={0}
      onMouseDown={(event) =>
        markPointerStart(event.clientX, event.clientY)
      }
      onMouseMove={(event) => markPointerMove(event.clientX, event.clientY)}
      onClick={openPropertyDetails}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) {
          markPointerStart(touch.clientX, touch.clientY);
        }
      }}
      onTouchMove={(event) => {
        const touch = event.touches[0];
        if (touch) {
          markPointerMove(touch.clientX, touch.clientY);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(detailsPath);
        }
      }}
    >
      <div className="property-listing-item p-0 mb-0 shadow-none h-100">
        <div className="buy-grid-img mb-0 rounded-0">
          <ImageWithBasePath
            className="img-fluid"
            src={property.cardImage}
            alt={property.title}
          />
          <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 px-3 py-2 z-1">
            <div className="d-flex align-items-center gap-2">
              {showNewBadge && (
                <div className="badge badge-sm bg-danger d-flex align-items-center custom-badge">
                  <i className="material-icons-outlined">offline_bolt</i>
                </div>
              )}
              <div className="badge badge-sm bg-orange d-flex align-items-center custom-badge">
                <i className="material-icons-outlined">loyalty</i>
              </div>
            </div>
            <button
              type="button"
              className={`favourite border-0 bg-transparent p-0 ${
                isFavorite ? "selected" : ""
              }`}
              aria-label="Save property"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setIsFavorite((prev) => !prev);
              }}
            >
              <i
                className={`material-icons-outlined ${
                  isFavorite ? "filled" : ""
                }`}
              >
                {isFavorite ? "favorite" : "favorite_border"}
              </i>
            </button>
          </div>
          <div className="d-flex align-items-center justify-content-start position-absolute bottom-0 end-0 start-0 p-3 z-1">
            <PropertyCardAgentBadge property={property} />
          </div>
        </div>
        <div className="buy-grid-content">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className={`badge ${property.badgeClass ?? "bg-secondary"}`}>
              {property.badge}
            </span>
            <span className="ms-1 fs-14 text-truncate">
              Listed on : {property.listedOn}
            </span>
          </div>
          <div className="mb-3 carousel-card-body">
            <h6 className="title mb-1 carousel-card-title">{property.title}</h6>
            <p className="d-flex align-items-center fs-14 mb-0 gap-1 carousel-card-location">
              <i className="material-icons-outlined me-1 ms-0 flex-shrink-0">
                location_on
              </i>
              <span className="carousel-card-location-text" title={property.address}>
                {property.address}
              </span>
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mt-auto">
            <h6 className="text-primary mb-0 ms-1 carousel-card-price">
              {displayPrice}
              {property.priceLabel ? (
                <span className="fw-normal fs-14">
                  {" "}
                  / {property.priceLabel}
                </span>
              ) : null}
            </h6>
            <div className="d-flex align-items-center justify-content-center flex-shrink-0">
              {Array.from({ length: 5 }).map((_, index) => (
                <i
                  key={index}
                  className="material-icons-outlined text-warning"
                >
                  star
                </i>
              ))}
              <span className="ms-1 fs-14">{property.rating}</span>
            </div>
          </div>
          <ul className="d-flex buy-grid-details justify-content-between align-items-center flex-wrap gap-1 border-top border-light-100 pt-3 mt-3">
            <li className="d-flex align-items-center gap-1">
              <i className="material-icons-outlined bg-light text-dark">bed</i>
              {property.beds} Bedroom
            </li>
            <li className="d-flex align-items-center gap-1">
              <i className="material-icons-outlined bg-light text-dark">
                bathtub
              </i>
              {property.baths} Bath
            </li>
            <li className="d-flex align-items-center gap-1">
              <i className="material-icons-outlined bg-light text-dark">home</i>
              {getPropertyCardTypeLabel(property)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EstatePropertyCarouselCard;
