import { Link, useSearchParams } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { Country } from "../../../../core/common/selectOption";
import CommonSelect from "../../../../core/common/common-select/commonSelect";
import { getDuenoServiceBySlug } from "../../../../data/duenoServices";
import {
  CONTACT_FORM_IMAGE,
  getSiteContactMapEmbedUrl,
  SITE_CONTACT,
} from "../../../../data/siteContact";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const ContactUs = () => {
  const [phone, setPhone] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const service = serviceSlug ? getDuenoServiceBySlug(serviceSlug) : undefined;
  const defaultSubject = service ? `Service request: ${service.title}` : "";

  return (
    <>
      <div className="page-wrapper">
        <Breadcrumb
          title="Contact Us"
          paths={[{ label: "Contact Us", active: true }]}
        />
        <div className="contact-us-wrap-02">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="row align-items-center justify-content-center mb-4 mb-lg-5 g-3">
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">mail</span>
                        <div>
                          <h6 className="mb-2">Email Address</h6>
                          <p className="mb-0">
                            <a href={`mailto:${SITE_CONTACT.email}`}>
                              {SITE_CONTACT.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">call</span>
                        <div>
                          <h6 className="mb-2">Phone Number</h6>
                          <p className="mb-0">
                            <a href={`tel:${SITE_CONTACT.phoneTel}`}>
                              {SITE_CONTACT.phone}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="contact-us-item-01">
                      <div className="d-flex align-items-center">
                        <span className="material-icons-outlined">
                          location_on
                        </span>
                        <div>
                          <h6 className="mb-2">Address</h6>
                          <p className="mb-0">
                            {SITE_CONTACT.location.lines[0]},
                            <br />
                            {SITE_CONTACT.location.lines[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-combined-card">
              <div className="contact-combined-card__media">
                <ImageWithBasePath
                  src={CONTACT_FORM_IMAGE}
                  alt="Contact Dueno Property"
                  className="contact-combined-card__img"
                />
              </div>
              <div className="contact-combined-card__body">
                <h2 className="contact-combined-card__title">Get In Touch</h2>
                {service ? (
                  <p className="text-muted mb-4">
                    Requesting: <strong>{service.title}</strong>
                  </p>
                ) : (
                  <p className="text-muted mb-4">
                    Tell us what you need and our team will get back to you
                    shortly.
                  </p>
                )}
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <PhoneInput
                        defaultCountry="NG"
                        value={phone}
                        onChange={setPhone}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <CommonSelect
                        options={Country}
                        className="select"
                        defaultValue={Country[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={defaultSubject}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="How can we help you?"
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <Link to="#" className="btn btn-lg btn-dark w-100 w-md-auto">
                      Submit Enquiry
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="google-map">
          <iframe
            className="rounded-0"
            title={`Dueno Property office map — ${SITE_CONTACT.location.mapQuery}`}
            src={getSiteContactMapEmbedUrl()}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
};

export default ContactUs;
