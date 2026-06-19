import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import NewsletterSubscribeForm from "../../../../../shared/components/NewsletterSubscribeForm";

const ContactSection = () => {
  return (
    <>
      {/* Contact Field Start */}
      <div className="contact-field-section">
        <div className="container">
          <div className="contact-field">
            <div>
              <ImageWithBasePath
                src="assets/img/home-3/bg/sec-bg-08.png"
                className="bg-1"
                alt="image"
              />
            </div>
            {/* start row */}
            <div className="row align-items-center justify-content-lg-between gy-4">
              <div className="col-lg-5">
                <div>
                  <h2 className="text-white mb-2">Let's Stay in Touch</h2>
                  <p className="text-white">
                    Receive news, stay updated, and special offers
                  </p>
                </div>
              </div>
              {/* end col */}
              <div className="col-lg-5">
                <NewsletterSubscribeForm variant="hero" source="homepage" />
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
      </div>
      {/* Contact Field End */}
    </>
  );
};

export default ContactSection;
