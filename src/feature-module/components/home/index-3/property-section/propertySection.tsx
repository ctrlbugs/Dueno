import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import {
  RECOMMENDED_LOCATIONS,
  type RecommendedLocationSlug,
  countPropertiesByLocationSlug,
  getAllLiveProperties,
} from "../../../../../data/estateProperties";

const LOCATION_CARDS: {
  slug: RecommendedLocationSlug;
  image: string;
  colClass: string;
}[] = [
  { slug: "lagos", image: "location-01.jpg", colClass: "col-lg-4" },
  { slug: "abuja", image: "location-02.jpg", colClass: "col-lg-4" },
  { slug: "port-harcourt", image: "location-03.jpg", colClass: "col-lg-4" },
  { slug: "ibadan", image: "location-04.jpg", colClass: "col-lg-6" },
  { slug: "owerri", image: "location-05.jpg", colClass: "col-lg-6" },
];

const PropertySection = () => {
  const allProperties = getAllLiveProperties();

  return (
    <>
      {/* Property Section Start */}
      <section className="property-section">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Recommended Properties</h2>
            <p>
              Discover our top service areas, where quality meets convenience.
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row gy-4 justify-content-center">
            {LOCATION_CARDS.map(({ slug, image, colClass }) => {
              const { label } = RECOMMENDED_LOCATIONS[slug];
              const count = countPropertiesByLocationSlug(allProperties, slug);
              const href = `${all_routes.buyProperty}?location=${slug}`;

              return (
                <div
                  key={slug}
                  className={colClass}
                  data-aos="fade-up"
                  data-aos-duration={1200}
                  data-aos-delay={200}
                >
                  <div className="location-item">
                    <div className="location-img">
                      <Link to={href}>
                        <ImageWithBasePath
                          src={`assets/img/home-3/location/${image}`}
                          alt={label}
                        />
                      </Link>
                      <div className="bottom-text">
                        <div className="location-name">
                          <h5>{label}</h5>
                          <p>
                            {count} {count === 1 ? "Property" : "Properties"}
                          </p>
                        </div>
                        <div className="arrow-overlay">
                          <Link to={href}>
                            <i className="material-icons-outlined">north_east</i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* end row */}
          <div className="text-center mt-4 pt-3">
            <Link
              to={all_routes.buyProperty}
              className="btn btn-dark btn-lg d-inline-flex align-items-center"
            >
              View More Locations
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
      {/* Property Section End */}
    </>
  );
};

export default PropertySection;
