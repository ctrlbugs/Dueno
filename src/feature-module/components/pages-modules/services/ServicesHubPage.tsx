import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import {
  DUENO_SERVICES,
  getDuenoServicePath,
  getDuenoServiceRequestPath,
} from "../../../../data/duenoServices";

const ServicesHubPage = () => {
  return (
    <div className="page-wrapper services-hub-page">
      <section className="services-hub-hero">
        <div className="container">
          <div className="section-heading-three text-center mb-0">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h1 className="mb-3">Our Services</h1>
            <p className="services-hub-hero__lead mx-auto mb-0">
              Everything you need for a seamless property experience across
              Nigeria — from sales and rentals to mortgages, artisans, moving,
              and cleaning.
            </p>
          </div>
        </div>
      </section>

      <section className="services-hub-grid-section">
        <div className="container">
          <div className="row g-4">
            {DUENO_SERVICES.map((service) => (
              <div key={service.slug} className="col-md-6 col-xl-4">
                <article className="services-hub-card h-100">
                  <Link
                    to={getDuenoServicePath(service.slug)}
                    className="services-hub-card__image"
                  >
                    <ImageWithBasePath
                      src={service.image}
                      alt={service.title}
                    />
                  </Link>
                  <div className="services-hub-card__body">
                    <h3>
                      <Link to={getDuenoServicePath(service.slug)}>
                        {service.title}
                      </Link>
                    </h3>
                    <p>{service.shortDescription}</p>
                    <div className="services-hub-card__actions">
                      <Link
                        to={getDuenoServiceRequestPath(service.slug)}
                        className="btn btn-primary btn-sm"
                      >
                        Request for Service Now
                      </Link>
                      <Link
                        to={getDuenoServicePath(service.slug)}
                        className="services-hub-card__link"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesHubPage;
