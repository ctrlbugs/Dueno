import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import StickyBox from "react-sticky-box";
import { TimePicker, type TimePickerProps } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
} from "../../../../../data/estateProperties";
import { DUENO_CONTACT } from "../../../../../data/siteContact";
import type { EstateProperty } from "../../../../../data/estateProperties";
import { createEnquiry } from "../../../../../services/messageStore";
import { useAuth } from "../../../../../context/AuthContext";

type BuyLeftFormProps = {
  propertyId: string;
  propertyTitle: string;
  agentId?: string;
  address: string;
  nearbyLandmarks: string[];
  agentName?: string;
  agentAvatar?: string;
  ownerInfo?: EstateProperty["ownerInfo"];
};

const BuyLeftForm = ({
  propertyId,
  propertyTitle,
  agentId,
  address,
  nearbyLandmarks,
  agentName = DUENO_CONTACT.teamName,
  agentAvatar = "assets/img/logo.svg",
  ownerInfo,
}: BuyLeftFormProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
    phone: "",
    message: "",
  });

  const useCompany = ownerInfo?.useCompanyDetails !== false && !ownerInfo?.phone;
  const ownerName = useCompany ? DUENO_CONTACT.name : agentName;
  const ownerPhone = ownerInfo?.phone || DUENO_CONTACT.phone;
  const ownerEmail = ownerInfo?.email || DUENO_CONTACT.email;
  const ownerLocation = ownerInfo?.location || DUENO_CONTACT.address;
  const whatsappUrl =
    ownerInfo?.whatsapp ||
    DUENO_CONTACT.whatsappUrl;

  const onChangeTime: TimePickerProps["onChange"] = () => {};

  useEffect(() => {
    if (!feedback?.startsWith("Message sent")) return;
    const timer = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFeedback("Please fill in name, email, and message.");
      return;
    }

    setSubmitting(true);
    createEnquiry({
      propertyId,
      propertyTitle,
      agentId: agentId ?? "dueno-admin",
      agentName: agentName ?? DUENO_CONTACT.teamName,
      buyerId: user?.id ?? `guest-${form.email.trim().toLowerCase()}`,
      buyerName: form.name.trim(),
      buyerEmail: form.email.trim(),
      subject: activeTab === "schedule" ? "Schedule a visit" : "Property enquiry",
      message: `[Phone: ${form.phone || "N/A"}]\n\n${form.message.trim()}`,
    });
    setSubmitting(false);
    setFeedback("Message sent! The agent will reply in your dashboard inbox.");
    setForm((prev) => ({ ...prev, message: "", phone: "" }));
  };
  return (
    <>
      {/* col end */}

      <div className="col-xl-4 theiaStickySidebar buy-details-item">
        {/* Items-1 */}
        <StickyBox offsetTop={80} offsetBottom={20}>
          {/* Items-1 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Enquiry</h5>
            </div>
            <div className="card-body">
              {/* Bootstrap Tabs */}
              <div className="d-flex align-items-center justify-content-between gap-2 custom-btn flex-wrap">
                <Link
                  to="#"
                  className={`btn d-flex align-center fs-14 fw-semibold justify-content-center ${
                    activeTab === "info"
                      ? "btn-primary"
                      : "btn-outline-dark text-center"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("info");
                  }}
                >
                  <i className="material-icons-outlined fs-14 me-1 d-flex align-center">
                    info
                  </i>
                  Request Info{" "}
                </Link>
                <Link
                  to="#"
                  className={`btn d-flex align-center fs-14 fw-semibold justify-content-center ${
                    activeTab === "schedule"
                      ? "btn-primary"
                      : "btn-outline-dark text-center"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("schedule");
                  }}
                >
                  <i className="material-icons-outlined fs-14 me-1">videocam</i>
                  Schedule a Visit{" "}
                </Link>
              </div>

              <div className="tab-content">
                <div
                  className={`tab-pane fade ${
                    activeTab === "info" ? "show active" : ""
                  }`}
                >
                  <div className="card bg-light border-0 rounded shadow-none custom-btn">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar avatar-lg">
                          <ImageWithBasePath
                            src={agentAvatar}
                            alt={agentName}
                            className="rounded-circle"
                          />
                        </div>
                        <div>
                          <h6 className="mb-1 fs-16 fw-semibold">
                            {agentName}
                          </h6>
                          <p className="mb-0 fs-14 text-body"> Company Agent </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Name </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Email </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Phone </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Phone Number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    />
                  </div>
                  {feedback && (
                    <div className="alert alert-success py-2 fs-14">{feedback}</div>
                  )}
                  <div>
                    <button
                      type="button"
                      className="btn btn-dark w-100 py-2 fs-14"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? "Sending..." : "Submit"}
                    </button>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "schedule" ? "show active" : ""
                  }`}
                >
                  <div className="card bg-light border-0 rounded shadow-none custom-btn">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar avatar-lg">
                          <img
                            src={agentAvatar}
                            alt={agentName}
                            className="rounded-circle"
                          />
                        </div>
                        <div>
                          <h6 className="mb-1 fs-16 fw-semibold">
                            {agentName}
                          </h6>
                          <p className="mb-0 fs-14 text-body"> Company Agent </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card */}
                  <div className="select-date-item">
                    <h6 className="fs-16 fw-semibold mb-2"> Select Day </h6>
                    <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Mon </p>
                        <h5 className="mb-0"> 21 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Tue </p>
                        <h5 className="mb-0"> 22 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Wed </p>
                        <h5 className="mb-0"> 23 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Thu </p>
                        <h5 className="mb-0"> 24 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Fri </p>
                        <h5 className="mb-0"> 25 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {" "}
                      Select Time{" "}
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <TimePicker
                        className="form-control"
                        onChange={onChangeTime}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                        suffixIcon={null}
                      />

                      <span className="input-group-text">
                        <i className="material-icons-outlined text-dark">
                          schedule
                        </i>
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Name </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Email </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Phone </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Phone Number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      {" "}
                      Description{" "}
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                  <div>
                    <Link to="#" className="btn btn-dark w-100 py-2 fs-14">
                      Submit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-2 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Listing Owner Details</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-lg">
                  <ImageWithBasePath
                    src={agentAvatar}
                    alt={agentName}
                    className="rounded-circle"
                  />
                </div>
                <div>
                  <h6 className="mb-1 fs-16 fw-semibold">{ownerName}</h6>
                  <div className="review-icons d-flex align-items-center">
                    <div className="me-1">
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                    </div>
                    <p className="mb-0 fs-14 text-body">5.0 (Verified Agent)</p>
                  </div>
                </div>
              </div>
              <ul className="mb-3">
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">Phone</span>
                  <a href={`tel:${ownerPhone.replace(/\s/g, "")}`}>{ownerPhone}</a>
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">Email</span>
                  <a href={`mailto:${ownerEmail}`}>{ownerEmail}</a>
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">Location</span>
                  <span className="text-end">{ownerLocation}</span>
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-0">
                  <span className="text-body">Verification</span>
                  <div className="badge bg-success text-white">Verified</div>
                </li>
              </ul>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <Link
                  to={whatsappUrl.startsWith("http") ? whatsappUrl : `https://wa.me/${whatsappUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary d-flex align-center fs-14 fw-medium w-100 justify-content-center"
                >
                  Whatsapp
                </Link>
                <Link
                  to={`mailto:${ownerEmail}`}
                  className="btn btn-dark d-flex align-center fs-14 fw-medium w-100 text-center justify-content-center"
                >
                  Email Us
                </Link>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-3 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Share Property</h5>
            </div>
            <div className="card-body">
              <div className="buy-social-icons-items d-flex align-center gap-2 flex-wrap">
                <Link to="#" className="item-1">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
                <Link to="#" className="item-2">
                  <i className="fa-brands fa-instagram" />
                </Link>
                <Link to="#" className="item-3">
                  <i className="fa-brands fa-behance" />
                </Link>
                <Link to="#" className="item-4">
                  <i className="fa-brands fa-twitter" />
                </Link>
                <Link to="#" className="item-5">
                  <i className="fa-brands fa-pinterest-p" />
                </Link>
                <Link to="#" className="item-6">
                  <i className="fa-brands fa-linkedin" />
                </Link>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-4 */}
          <div className="card mb-0">
            <div className="custom-map position-relative">
              <a
                href={getGoogleMapsSearchUrl(address)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark fw-medium"
              >
                View Location
              </a>
              <iframe
                key={address}
                title={`Map for ${address}`}
                src={getGoogleMapsEmbedUrl(address)}
                width={600}
                height={450}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="card-body">
              <h6 className="mb-3"> Nearby Landmarks &amp; Visits </h6>
              {nearbyLandmarks.map((landmark, index) => (
                <p
                  key={landmark}
                  className={`${index === nearbyLandmarks.length - 1 ? "mb-0" : "mb-2"} text-body`}
                >
                  <i className="fa-regular fa-circle-check fs-16 me-2 text-body" />
                  {landmark}
                </p>
              ))}
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
        </StickyBox>
      </div>

      {/* col end */}
    </>
  );
};

export default BuyLeftForm;
