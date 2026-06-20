import { useEffect, useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import type { EstateProperty } from "../../../../data/estateProperties";
import { getPropertyDetailsPath } from "../../../../data/estateProperties";
import {
  getVisitorId,
  isPropertySaved,
  subscribePropertyReviews,
  togglePropertySaved,
} from "../../../../services/propertyReviewStore";
import { isListingNew } from "../../../../utils/listingBadge";
import PropertyCardAgentBadge from "../../../../shared/components/PropertyCardAgentBadge";
import {
  resolvePropertyPrice,
} from "../../../../utils/propertyDisplay";

type BuyGridPropertyCardProps = {
  property: EstateProperty;
  layout?: "grid" | "carousel";
};

const BuyGridPropertyCard = ({
  property,
  layout = "grid",
}: BuyGridPropertyCardProps) => {
  const userId = getVisitorId();
  const [saved, setSaved] = useState(() =>
    isPropertySaved(property.id, userId),
  );
  const detailsPath = getPropertyDetailsPath(property);
  const displayPrice = resolvePropertyPrice(property.price);
  const showNewBadge = isListingNew(property.publishedAt, property.listedOn);

  useEffect(() => {
    const refresh = () => setSaved(isPropertySaved(property.id, userId));
    refresh();
    return subscribePropertyReviews(refresh);
  }, [property.id, userId]);

  return (
    <div
      className={
        layout === "carousel"
          ? "buy-grid-card-slide d-flex w-100"
          : "col-12 col-md-6 col-xl-4 d-flex"
      }
    >
      <div className="property-card flex-fill">
        <div className="property-listing-item p-0 mb-0 shadow-none">
          <div className="buy-grid-img mb-0 rounded-0">
            <Link to={detailsPath}>
              <ImageWithBasePath
                className="img-fluid"
                src={property.cardImage}
                alt={property.title}
              />
            </Link>
            <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3 z-1">
              <div className="d-flex align-items-center gap-2">
                {showNewBadge && (
                  <div className="badge badge-sm bg-danger d-flex align-items-center">
                    <i className="material-icons-outlined">offline_bolt</i>
                    New
                  </div>
                )}
                <div className="badge badge-sm bg-orange d-flex align-items-center">
                  <i className="material-icons-outlined">loyalty</i>
                  Featured
                </div>
              </div>
              <button
                type="button"
                className={`favourite border-0 bg-transparent p-0 ${
                  saved ? "selected" : ""
                }`}
                aria-label={saved ? "Remove from saved" : "Save property"}
                onClick={() => setSaved(togglePropertySaved(property.id, userId))}
              >
                <i
                  className={`material-icons-outlined ${
                    saved ? "filled" : ""
                  }`}
                >
                  {saved ? "favorite" : "favorite_border"}
                </i>
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
              <h6 className="text-white mb-0">{displayPrice}</h6>
              <PropertyCardAgentBadge property={property} />
            </div>
          </div>
          <div className="buy-grid-content">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center justify-content-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i
                    key={index}
                    className="material-icons-outlined text-warning"
                  >
                    star
                  </i>
                ))}
                <span className="ms-1 fs-14">{property.rating} (Verified)</span>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3 w-100">
              <div className="w-100 min-w-0">
                <h6 className="title mb-1 text-truncate">
                  <Link to={detailsPath}>{property.title}</Link>
                </h6>
                <p className="property-location-line fs-14 mb-0">
                  <i className="material-icons-outlined">location_on</i>
                  <span className="property-location-text" title={property.address}>
                    {property.address}
                  </span>
                </p>
              </div>
            </div>
            <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
              <li className="d-flex align-items-center gap-1">
                <i className="material-icons-outlined bg-white text-secondary">
                  bed
                </i>
                {property.beds} Bed
              </li>
              <li className="d-flex align-items-center gap-1">
                <i className="material-icons-outlined bg-white text-secondary">
                  bathtub
                </i>
                {property.baths} Bath
              </li>
              <li className="d-flex align-items-center gap-1">
                <i className="material-icons-outlined bg-white text-secondary">
                  wb_sunny
                </i>
                {property.features.solar}
              </li>
            </ul>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
              <p className="fs-14 fw-medium text-dark mb-0">
                Listed on :
                <span className="fw-medium text-body"> {property.listedOn}</span>
              </p>
              <p className="fs-14 fw-medium text-dark mb-0">
                Category :
                <span className="fw-medium text-body"> {property.category}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyGridPropertyCard;
