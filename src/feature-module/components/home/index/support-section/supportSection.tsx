import { Link } from "react-router";

const SupportSection = () => {
  return (
    <>
      {/* start support section */}
      <section className="home-support-section section-padding bg-light">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div
              className="col-lg-6 aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              {/* start title */}
              <div className="section-heading mb-3 mb-lg-0">
                <h2 className="mb-2 text-lg-start text-center">
                  Sign Up for Our Newsletter
                </h2>
                <p className="mb-0 text-lg-start text-center">
                  Receive news, stay updated, and special offers.
                </p>
              </div>
              {/* end title */}
            </div>
            {/* end col */}
            <div
              className="col-lg-6 aos"
              data-aos="fade-down"
              data-aos-duration={1500}
            >
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="position-relative support-custom-icons">
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control bg-white w-100"
                      placeholder="Enter Email Address"
                    />
                  </div>
                  <i className="material-icons-outlined text-dark z-2">email</i>
                </div>
                <Link to="#" className="btn btn-lg btn-primary">
                  Subscribe
                </Link>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end support section */}
    </>
  );
};

export default SupportSection;
