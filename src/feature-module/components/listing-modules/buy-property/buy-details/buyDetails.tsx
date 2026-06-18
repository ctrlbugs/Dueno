import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import BuyGalleryItem from "./buyGalleryItem";
import PropertyVideoPlayer from "./propertyVideoPlayer";
import BuyLeftForm from "./buyLeftForm";
import PropertyFloorPlans from "./PropertyFloorPlans";
import PropertyFaqs from "./PropertyFaqs";
import RelatedPropertiesCarousel from "./relatedPropertiesCarousel";
import PropertyReviewsSection, {
  PropertyRatingDisplay,
} from "../../../../../shared/components/PropertyReviewsSection";
import PropertyHeaderEngagement from "../../../../../shared/components/PropertyHeaderEngagement";
import { incrementPropertyVisit, getPropertyVisitCount } from "../../../../../services/propertyReviewStore";
import { resolvePropertyPrice } from "../../../../../utils/propertyDisplay";
import { all_routes } from "../../../../routes/all_routes";
import { getEstatePropertyByRef, getGoogleMapsSearchUrl, getPropertyDetailsPath, getPropertyVideoUrl, type EstateProperty } from "../../../../../data/estateProperties";

type SliderType = Slider;

type PropertyFeatureItem = {
  icon: string;
  label: string;
  value: keyof EstateProperty["features"];
};

const PROPERTY_FEATURE_COLUMNS: PropertyFeatureItem[][] = [
  [
    { icon: "bed", label: "Beds", value: "bedrooms" },
    { icon: "smart_toy", label: "Smart Home", value: "smartHome" },
    { icon: "wb_sunny", label: "Solar", value: "solar" },
  ],
  [
    { icon: "bathtub", label: "Baths", value: "bathrooms" },
    { icon: "home", label: "BQ", value: "bq" },
    { icon: "power", label: "Generator", value: "generator" },
  ],
  [
    { icon: "directions_car_filled", label: "Parking", value: "parking" },
    { icon: "tv", label: "Intercom", value: "intercom" },
    { icon: "kitchen", label: "Out. Kitchen", value: "outdoorKitchen" },
  ],
  [
    { icon: "corporate_fare", label: "Balcony", value: "balcony" },
    { icon: "local_laundry_service", label: "Laundry", value: "laundry" },
    { icon: "checkroom", label: "Furnishing", value: "furnishing" },
  ],
];

const BuyDetails = () => {
  const { propertySlug } = useParams<{ propertySlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isRentPage = location.pathname.includes("/rent-details");
  const property = getEstatePropertyByRef(propertySlug ?? "");

  const [mainSlider, setMainSlider] = useState<SliderType | undefined>(
    undefined
  );
  const [thumbSlider, setThumbSlider] = useState<SliderType | undefined>(
    undefined
  );

  const mainRef = useRef<SliderType>(null);
  const thumbRef = useRef<SliderType>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    infinite: true,
    asNavFor: thumbSlider,
    afterChange: (index: number) => setCurrentSlide(index),
  };

  const thumbSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: mainSlider,
    focusOnSelect: true,
    arrows: true,
    infinite: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
    ],
  };

  useEffect(() => {
    setMainSlider(mainRef.current ?? undefined);
    setThumbSlider(thumbRef.current ?? undefined);
    setCurrentSlide(0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [propertySlug]);

  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (property?.id) {
      incrementPropertyVisit(property.id);
      setVisitCount(getPropertyVisitCount(property.id));
    }
  }, [property?.id]);

  useEffect(() => {
    if (!property || !propertySlug || propertySlug === property.slug) {
      return;
    }

    navigate(getPropertyDetailsPath(property), { replace: true });
  }, [property, propertySlug, navigate]);

  if (!property) {
    return (
      <Navigate
        to={isRentPage ? all_routes.rentProperty : all_routes.buyProperty}
        replace
      />
    );
  }

  const mapSearchUrl = getGoogleMapsSearchUrl(property.address);

  const galleryImages = property.images;
  const videoEmbedUrl = getPropertyVideoUrl(property);
  const videoPoster = property.cardImage || property.images[0];

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        <div className="buy-details-header-item">
          {/* Start Breadscrumb */}
          <div className="breadcrumb-bar custom-breadcrumb-bar">
            <div className="container">
              <div className="row align-items-center text-center position-relative z-1">
                <div className="col-xl-8">
                  <div className="d-flex align-center gap-2 mb-2">
                    <span className="badge bg-primary">{property.category}</span>
                    <span className="badge bg-secondary">{property.listingType}</span>
                  </div>
                  <h1 className="breadcrumb-title text-start ">
                    {property.fullTitle}
                  </h1>
                  <div className="d-flex align-items-center gap-2 flex-wrap gap-1 mb-xl-0 mb-4">
                    <PropertyRatingDisplay
                      propertyId={property.id}
                      fallbackRating={property.rating}
                    />
                    <i className="fa-solid fa-circle text-body" />
                    <div className="fs-14 mb-0 text-white d-flex align-items-center flex-wrap gap-1 custom-address-item">
                      <i className="material-icons-outlined text-white me-1">
                        location_on
                      </i>
                      {property.address}
                      <a
                        href={mapSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary fs-14 text-decoration-underline ms-1"
                      >
                        View Location
                      </a>
                    </div>
                    <i className="fa-solid fa-circle text-body" />
                    <p className="fs-14 mb-0 text-white">
                      Last Updated on : {property.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="col-xl-4 d-flex d-xl-block align-items-center flex-wrap gap-3">
                  <PropertyHeaderEngagement propertyId={property.id} />
                  <h4 className="mb-0 text-primary text-xl-end text-start">
                    {resolvePropertyPrice(property.price)}
                    {isRentPage && property.priceLabel && (
                      <span className="fs-14 fw-normal text-white">
                        {" "}
                        / {property.priceLabel}
                      </span>
                    )}
                  </h4>
                  {isRentPage && (
                    <Link
                      to={all_routes.rentBooking}
                      className="btn btn-primary btn-lg d-flex align-items-center mt-xl-3"
                    >
                      <i className="material-icons-outlined rounded me-1">
                        calendar_today
                      </i>
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* End Breadscrumb */}
        </div>
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-xl-8">
                <div className="mb-4 d-inline-flex align-center justify-content-between w-100 flex-wrap gap-1">
                  <div className="d-inline-flex align-center gap-2">
                    <span className="badge bg-danger d-flex align-items-center">
                      <i className="material-icons-outlined fs-14 me-1">
                        generating_tokens
                      </i>
                      Trending
                    </span>
                    <span className="badge bg-orange d-flex align-items-center">
                      <i className="material-icons-outlined  fs-14 me-1">
                        loyalty
                      </i>
                      Featured
                    </span>
                  </div>
                  <p className="mb-0 text-dark">Total No of Visits : {visitCount}</p>
                </div>
                {/* start slider */}
                <div className="slider-card service-slider-card mb-4">
                  <div className="slide-part mb-4 position-relative">
                    <span className="property-gallery-count">
                      {currentSlide + 1} of {galleryImages.length}
                    </span>
                    <Slider
                      {...mainSettings}
                      ref={mainRef}
                      className="slider service-slider"
                    >
                      {galleryImages.map((image, index) => (
                        <div className="service-img-wrap" key={`${image}-${index}`}>
                          <ImageWithBasePath
                            src={image}
                            className="img-fluid"
                            alt={`${property.title} - ${index + 1}`}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <Slider
                    {...thumbSettings}
                    ref={thumbRef}
                    className="slider slider-nav-thumbnails"
                  >
                    {galleryImages.map((image, index) => (
                      <div className="slide-img" key={`thumb-${image}-${index}`}>
                        <ImageWithBasePath
                          src={image}
                          className="img-fluid"
                          alt={`${property.title} thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
                {/* End slider */}
                {/* items-2*/}
                <div className="accordion accordions-items-seperate">
                  {/* descritpion items */}
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-1"
                        aria-expanded="true"
                      >
                        Description
                      </button>
                    </div>
                    <div
                      id="accordion-1"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <p>{property.shortDescription}</p>
                        <p style={{ whiteSpace: "pre-line" }} className="mb-2">
                          {property.description}
                        </p>
                        <p style={{ whiteSpace: "pre-line" }} className="mb-0">
                          {property.descriptionExtra}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Property items */}
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-2"
                        aria-expanded="true"
                      >
                        Property Features
                      </button>
                    </div>
                    <div
                      id="accordion-2"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="row row-gap-4">
                          {PROPERTY_FEATURE_COLUMNS.map((column, columnIndex) => (
                            <div
                              className="col-lg-3 col-md-6"
                              key={`feature-column-${columnIndex}`}
                            >
                              <div className="buy-property-items">
                                {column.map((item, itemIndex) => (
                                  <p
                                    key={item.value}
                                    className={
                                      itemIndex === column.length - 1
                                        ? "mb-lg-0 mb-0"
                                        : undefined
                                    }
                                  >
                                    <i className="material-icons-outlined">
                                      {item.icon}
                                    </i>
                                    <span className="feature-text">
                                      {item.label}:{" "}
                                      {property.features[item.value]}
                                    </span>
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* about property items */}
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-3"
                        aria-expanded="true"
                      >
                        About Property
                      </button>
                    </div>
                    <div
                      id="accordion-3"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        {property.highlights.map((highlight) => (
                          <p className="mb-2" key={highlight}>
                            <i className="fa-solid fa-circle-check text-success me-2 fs-18" />
                            {highlight}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* amenities items */}
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-4"
                        aria-expanded="true"
                      >
                        Amenities
                      </button>
                    </div>
                    <div
                      id="accordion-4"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="row row-gap-3">
                          {property.amenities.map((amenity) => (
                            <div className="col-lg-3 col-md-6" key={amenity}>
                              <div className="buy-property-items">
                                <p className="mb-0">
                                  <i className="material-icons-outlined">
                                    check_circle
                                  </i>
                                  {amenity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <PropertyFloorPlans floorPlans={property.floorPlans} />
                  {/* gallery items */}
                  <BuyGalleryItem images={galleryImages} alt={property.title} />
                  {/* video items */}
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-7"
                        aria-expanded="true"
                      >
                        Video
                      </button>
                    </div>
                    <div
                      id="accordion-7"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <PropertyVideoPlayer
                          key={property.id}
                          embedUrl={videoEmbedUrl}
                          poster={videoPoster}
                          title={property.title}
                        />
                      </div>
                    </div>
                  </div>
                  <PropertyFaqs faqs={property.faqs} />
                  <PropertyReviewsSection
                    propertyId={property.id}
                    fallbackRating={property.rating}
                  />
                </div>
              </div>
              <BuyLeftForm
                propertyId={property.id}
                propertyTitle={property.title}
                agentId={property.agentId}
                address={property.mapAddress ?? property.address}
                nearbyLandmarks={property.nearbyLandmarks}
                agentName={property.agentName}
                agentAvatar={property.agentAvatar}
                ownerInfo={property.ownerInfo}
              />
            </div>
            {/* end row */}
            <RelatedPropertiesCarousel currentPropertyId={property.id} />
          </div>
        </div>
        {/* End Content */}

      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default BuyDetails;
