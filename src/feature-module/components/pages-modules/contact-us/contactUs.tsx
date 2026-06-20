import { useSearchParams } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import {
  CONTACT_CATEGORIES,
  CONTACT_FORM_IMAGE,
  getSiteContactMapEmbedUrl,
  SITE_CONTACT,
} from "../../../../data/siteContact";
import CommonSelect from "../../../../core/common/common-select/commonSelect";
import { getDuenoServiceBySlug } from "../../../../data/duenoServices";
import { FormEvent, useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  DuenoStatusMessage,
  DuenoSubmitButton,
} from "../../../../shared/components/DuenoFormFeedback";

type SubmitState = "idle" | "loading" | "success" | "error";

const SUCCESS_MESSAGE =
  "Thank you — your enquiry has been sent. We will get back to you shortly.";

const ContactUs = () => {
  const [searchParams] = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const service = serviceSlug ? getDuenoServiceBySlug(serviceSlug) : undefined;

  const [phone, setPhone] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CONTACT_CATEGORIES[0]?.value ?? "Select");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  const defaultSubject = service ? `Service request: ${service.title}` : "";
  const defaultCategory = service?.title;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone(undefined);
    setCategory(defaultCategory ?? CONTACT_CATEGORIES[0]?.value ?? "Select");
    setSubject(defaultSubject);
    setMessage("");
    setFeedback("");
  };

  useEffect(() => {
    if (defaultSubject) {
      setSubject(defaultSubject);
    }
  }, [defaultSubject]);

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone ?? "",
          category,
          subject: subject || defaultSubject,
          message,
          service: service?.title ?? "",
          website: "",
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        referenceId?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to send your enquiry.");
      }

      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to send your enquiry. Please try again.",
      );
    }
  };

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

                {submitState === "success" ? (
                  <DuenoStatusMessage
                    variant="success"
                    message={SUCCESS_MESSAGE}
                    layout="toast"
                    autoDismissMs={3000}
                    onDismiss={() => {
                      resetForm();
                      setSubmitState("idle");
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="visually-hidden" aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-name">
                            Your Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-phone">
                            Phone Number
                          </label>
                          <PhoneInput
                            id="contact-phone"
                            defaultCountry="NG"
                            value={phone}
                            onChange={setPhone}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-email">
                            Email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category</label>
                          <CommonSelect
                            options={[...CONTACT_CATEGORIES]}
                            className="select contact-category-select"
                            maxMenuHeight={280}
                            responsiveMenuHeight
                            value={CONTACT_CATEGORIES.find(
                              (item) => item.value === category,
                            )}
                            onChange={(option: { value: string } | null) =>
                              setCategory(option?.value ?? "Select")
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-subject">
                            Subject
                          </label>
                          <input
                            id="contact-subject"
                            type="text"
                            className="form-control"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder={defaultSubject || "How can we help?"}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="contact-message"
                          >
                            Description
                          </label>
                          <textarea
                            id="contact-message"
                            className="form-control"
                            rows={4}
                            placeholder="How can we help you?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      {submitState === "error" && feedback ? (
                        <div className="col-md-12">
                          <DuenoStatusMessage variant="error" message={feedback} />
                        </div>
                      ) : null}
                      <div className="col-md-12">
                        <DuenoSubmitButton
                          variant="dark"
                          className="btn-lg w-100 w-md-auto"
                          isLoading={submitState === "loading"}
                          loadingLabel="Sending…"
                        >
                          Submit Enquiry
                        </DuenoSubmitButton>
                      </div>
                    </div>
                  </form>
                )}
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
