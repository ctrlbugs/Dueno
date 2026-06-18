import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import {
  getDuenoServiceBySlug,
  getDuenoServiceRequestPath,
} from "../../../../data/duenoServices";
import { all_routes } from "../../../routes/all_routes";

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const service = serviceSlug ? getDuenoServiceBySlug(serviceSlug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [serviceSlug]);

  if (!service) {
    return <Navigate to={all_routes.services} replace />;
  }

  const requestPath = getDuenoServiceRequestPath(service.slug);

  return (
    <div className="page-wrapper service-detail-page">
      <section className="service-hero">
        <div className="service-hero__media">
          <ImageWithBasePath
            src={service.image}
            alt={service.title}
            className="service-hero__img"
          />
        </div>
        <div className="service-hero__overlay" />
        <div className="container service-hero__container">
          <div className="service-hero__content">
            <p className="service-hero__eyebrow">Dueno Services</p>
            <h1>{service.heroTitle}</h1>
            <p className="service-hero__lead">{service.heroDescription}</p>
            <div className="service-hero__actions">
              <Link
                to={requestPath}
                className="btn btn-primary service-hero__cta"
              >
                Request for Service Now
                <i className="material-icons-outlined">arrow_forward</i>
              </Link>
              {service.listingRoute ? (
                <Link
                  to={service.listingRoute}
                  className="service-hero__secondary"
                >
                  Browse listings
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="service-detail-body">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <h2 className="service-detail-body__title">
                Why choose Dueno for {service.title.toLowerCase()}?
              </h2>
              <p className="text-muted mb-0">{service.shortDescription}</p>
            </div>
            <div className="col-lg-7">
              <ul className="service-detail-features">
                {service.features.map((feature) => (
                  <li key={feature}>
                    <span className="service-detail-features__icon">
                      <i className="material-icons-outlined">check_circle</i>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="service-detail-cta">
        <div className="container">
          <div className="service-detail-cta__card">
            <div>
              <h3 className="mb-2">Ready to get started?</h3>
              <p className="mb-0 text-muted">
                Tell us what you need and our team will connect you with the
                right Dueno service partner.
              </p>
            </div>
            <Link to={requestPath} className="btn btn-dark service-detail-cta__btn">
              Request for Service Now
              <i className="material-icons-outlined">north_east</i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
