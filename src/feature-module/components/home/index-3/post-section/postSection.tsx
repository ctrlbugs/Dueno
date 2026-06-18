import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const PostSection = () => {
  return (
    <>
      {/* Post Property Section Start */}
      <section className="post-propert-section">
        <div className="sec-img">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-03.png"
            className="bg-1"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-09.png"
            className="bg-2"
            alt="image"
          />
        </div>
        <div className="container">
          {/* start row */}
          <div className="row">
            <div className="col-lg-6">
              {/* Section Title Start */}
              <div className="section-headings">
                <div className="sec-line-three justify-content-start mb-3">
                  <span className="sec-line1" />
                  <span className="sec-line2" />
                </div>
                <h2 className="text-white mb-3">
                  Grow Your Real Estate Business with Dueno...
                </h2>
                <p className="text-white mb-4">
                  Join our network of trusted agents and property professionals.
                  Advertise listings
                </p>
                <Link
                  to={all_routes.signup}
                  className="btn btn-primary d-inline-flex"
                >
                  Become a Partner Agent
                </Link>
              </div>
              {/* Section Title End */}
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* Post Property Section End */}
    </>
  );
};

export default PostSection;
