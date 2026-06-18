import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const WorkSection = () => {
  return (
    <>
      {/* start how it works section */}
      <section className="how-work-section section-padding">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">How It Works</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              Follow these 3 steps to book your place
            </p>
          </div>
          {/* end title */}
          {/* start row */}
          <div className="row">
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-up"
              data-aos-duration={500}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className="mb-3 bg-secondary avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-1.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">01. Search for Location</h5>
                <p className="mb-0">
                  Find properties by location quickly, matching your lifestyle
                  and preferences easily.
                </p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className=" mb-3 bg-danger avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-2.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">02. Select Property Type</h5>
                <p className="mb-0">
                  Choose your ideal property type easily, from apartments to
                  villas.
                </p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-up"
              data-aos-duration={500}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className="mb-3 bg-success avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-3.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">03. Book Your Property</h5>
                <p className="mb-0">
                  Secure your dream property quickly with a simple, hassle-free
                  booking process.
                </p>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end how it works section */}
    </>
  );
};

export default WorkSection;
