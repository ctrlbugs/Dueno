import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import CustomerAvatarStack from "../shared/CustomerAvatarStack";

const HowWorkSection = () => {
  return (
    <>
      {/* How it Work Section End */}
      <section className="how-it-work-section">
        <div className="section-bg">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-05.png"
            className="bg-1"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/shape-01.svg"
            className="bg-2"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/shape-02.svg"
            className="bg-3"
            alt="image"
          />
        </div>
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="work-sec-img">
                <div>
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/sec-bg-04.png"
                    alt="image"
                  />
                </div>
                <div className="banner-users section-users d-flex align-items-center flex-wrap gap-3">
                  <CustomerAvatarStack />
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <h6 className="mb-0 me-2 fs-14 fw-semibold text-white">
                        Ratings 5.0
                      </h6>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                    <p className="mb-0 text-white">Trusted By 1000+ Client</p>
                  </div>
                </div>
                <div className="shape-3">
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/shape-03.svg"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-5">
              <div>
                <div className="section-headings mb-4">
                  <span className="text-primary d-block mb-3">
                    Explore Dueno Property
                  </span>
                  <div className="sec-line-three justify-content-start">
                    <span className="sec-line1" />
                    <span className="sec-line2" />
                  </div>
                  <h2 className="mb-3 text-white">
                    Your Next Home, Office, or Investment Starts Here
                  </h2>
                </div>
                <div>
                  <div className="work-steps mb-4">
                    <span className="d-block mb-2 text-orange">Step 1</span>
                    <h6 className="mb-2 text-white">Search by Location</h6>
                    <p className="text-white">
                      Explore verified properties across Lagos, Abuja, and Port
                      Harcourt. Filter by location, budget, property type, and
                      amenities to find the perfect match for your lifestyle or
                      investment goals.
                    </p>
                  </div>
                  <div className="work-steps mb-4">
                    <span className="d-block mb-2 text-pink">Step 2</span>
                    <h6 className="mb-2 text-white">Select Your Ideal Property</h6>
                    <p className="text-white">
                      Choose from luxury apartments, family homes, serviced
                      residences, office spaces, commercial properties, and land
                      listings carefully curated to meet your needs.
                    </p>
                  </div>
                  <div className="work-steps mb-0 work-steps-three">
                    <span className="d-block mb-2 text-teal">Step 3</span>
                    <h6 className="mb-2 text-white">
                      Schedule a Viewing or Secure Your Property
                    </h6>
                    <p className="text-white mb-0">
                      Book a property viewing, connect directly with our team,
                      and take the next step toward owning or renting your
                      preferred property with confidence.
                    </p>
                    <div className="how-work-mobile-shape d-lg-none" aria-hidden="true">
                      <ImageWithBasePath
                        src="assets/img/home-3/bg/shape-02.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* How it Work Section End */}
    </>
  );
};

export default HowWorkSection;
