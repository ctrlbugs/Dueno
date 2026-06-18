import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import type { EstateProperty } from "../../../../data/estateProperties";
import { getPropertyDetailsPath, getPropertyCardTypeLabel } from "../../../../data/estateProperties";

type FeaturedPropertyCardProps = {
  property: EstateProperty;
  avatarIndex?: number;
  layout?: "grid" | "carousel";
};

const FeaturedPropertyCard = ({
  property,
  avatarIndex = 1,
  layout = "grid",
}: FeaturedPropertyCardProps) => {
  const detailsPath = getPropertyDetailsPath(property);
  const avatarSrc = property.agentAvatar ?? `assets/img/users/user-0${avatarIndex}.jpg`;
  const wrapperClassName =
    layout === "carousel"
      ? "featured-property-slide-card d-flex h-100"
      : "col-xl-3 col-lg-4 col-md-6 d-flex";

  return (
    <div className={wrapperClassName}>
      <div
        className={`rent-property-item flex-fill${
          layout === "carousel" ? " featured-property-card" : ""
        }`}
      >
        <div className="property-img">
          <Link to={detailsPath}>
            <ImageWithBasePath src={property.cardImage} alt={property.title} />
          </Link>
          <div className="favourite">
            <Link to="#">
              <i className="material-icons-outlined">favorite_border</i>
            </Link>
          </div>
          <div className="d-flex align-items-center token-top">
            <span className="token bg-danger me-1">
              <i className="material-icons-outlined text-warning">
                generating_tokens
              </i>
            </span>
            <span className="token bg-orange">
              <i className="material-icons-outlined text-warning">loyalty</i>
            </span>
          </div>
          <span className="avatar avatar-md rounded-circle border-0 avatar-bottom property-agent-avatar">
            <ImageWithBasePath
              src={avatarSrc}
              className="img-fluid border border-white rounded-circle"
              alt="Agent"
            />
          </span>
        </div>
        <div className="rental-content">
          <div className="d-flex align-items-center justify-content-between mb-3 featured-card-meta">
            <span className={`badge ${property.badgeClass ?? "bg-secondary"}`}>
              {property.badge}
            </span>
            <span className="date text-truncate ms-2">
              Listed on : {property.listedOn}
            </span>
          </div>
          <div className="mb-3 featured-card-body">
            <p className="featured-card-location mb-1">
              <i className="material-icons-outlined me-1">location_on</i>
              <span
                className="featured-card-location-text"
                title={property.address}
              >
                {property.address}
              </span>
            </p>
            <h5 className="featured-card-title mb-0">
              <Link to={detailsPath}>{property.title}</Link>
            </h5>
          </div>
          {property.priceLabel ? (
            <p className="featured-card-price-label mb-1">{property.priceLabel}</p>
          ) : (
            layout === "carousel" && (
              <p className="featured-card-price-label mb-1" aria-hidden="true">
                &nbsp;
              </p>
            )
          )}
          <div className="d-flex align-items-center justify-content-between featured-card-price-row">
            <p className="rate-info mb-0">
              <span>{property.price}</span>
            </p>
            <div className="d-flex align-items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <i
                  key={index}
                  className="material-icons-outlined text-warning"
                >
                  star
                </i>
              ))}
              {property.rating}
            </div>
          </div>
          <div className="card-info d-flex align-items-center justify-content-between">
            <p>
              <span className="me-2">
                <i className="material-icons-outlined">bed</i>
              </span>
              <span className="card-info-label">{property.beds} Bed</span>
            </p>
            <p>
              <span className="me-2">
                <i className="material-icons-outlined">bathtub</i>
              </span>
              <span className="card-info-label">{property.baths} Bath</span>
            </p>
            <p>
              <span className="me-2">
                <i className="material-icons-outlined">home</i>
              </span>
              <span className="card-info-label">
                {getPropertyCardTypeLabel(property)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPropertyCard;
