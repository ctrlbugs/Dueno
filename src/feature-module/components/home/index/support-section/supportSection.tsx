import NewsletterSubscribeForm from "../../../../../shared/components/NewsletterSubscribeForm";

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
              <NewsletterSubscribeForm variant="support" source="support" />
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
