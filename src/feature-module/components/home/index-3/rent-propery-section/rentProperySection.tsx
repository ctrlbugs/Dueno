import { useEffect, useState } from "react";
import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { getFeaturedSaleProperties } from "../../../../../data/estateProperties";
import EstatePropertyCarousel from "../../../listing-modules/shared/EstatePropertyCarousel";

const RentProperySection = () => {
  const [, refresh] = useState(0);

  useEffect(() => {
    const handler = () => refresh((value) => value + 1);
    window.addEventListener("dueno-published-updated", handler);
    return () => window.removeEventListener("dueno-published-updated", handler);
  }, []);

  const properties = getFeaturedSaleProperties();

  return (
    <>
      <section className="rent-propery-section">
        <div className="container">
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Featured Properties For Sale</h2>
            <p>
              Discover Exclusive Listings of Premium Properties Available for
              Purchase
            </p>
          </div>
          <EstatePropertyCarousel properties={properties} />
          <div className="text-center mt-4 pt-3">
            <Link
              to={all_routes.buyProperty}
              className="btn btn-dark d-inline-flex align-items-center"
            >
              View More
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RentProperySection;
