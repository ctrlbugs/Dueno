import { Link } from "react-router";
import { useEffect, useState } from "react";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { getBuyDetailsPath } from "../../../../../data/estateProperties";
import CustomerAvatarStack from "../shared/CustomerAvatarStack";
import { Property_Type } from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";

type HeroTextSegment = {
  text: string;
  highlight?: boolean;
  breakBefore?: "laptop" | "desktop" | ("laptop" | "desktop")[];
};

const HERO_TYPED_MESSAGES: HeroTextSegment[][] = [
  [
    { text: "Discover", highlight: true },
    { text: " verified homes" },
    { text: " and ", breakBefore: ["laptop", "desktop"] },
    { text: "investment", highlight: true },
    { text: " options" },
    { text: " in ", breakBefore: ["laptop", "desktop"] },
    { text: "prime " },
    { text: "locations", highlight: true },
    { text: "." },
  ],
  [
    { text: "Find Your Perfect " },
    { text: "Home", highlight: true },
    { text: " in ", breakBefore: ["laptop", "desktop"] },
    { text: "Nigeria's", highlight: true },
    { text: " Fastest " },
    { text: "Growing", highlight: true, breakBefore: ["laptop", "desktop"] },
    { text: " Cities" },
  ],
];

const getMessageLength = (segments: HeroTextSegment[]) =>
  segments.reduce((count, segment) => count + segment.text.length, 0);

const renderTypedMessage = (
  segments: HeroTextSegment[],
  visibleChars: number,
) => {
  let remainingChars = visibleChars;

  return segments.map((segment, index) => {
    if (remainingChars <= 0) return null;

    const visibleText = segment.text.slice(
      0,
      Math.min(remainingChars, segment.text.length),
    );
    remainingChars -= segment.text.length;

    const lineBreaks = segment.breakBefore
      ? Array.isArray(segment.breakBefore)
        ? segment.breakBefore
        : [segment.breakBefore]
      : [];

    return (
      <span key={`${segment.text}-${index}`}>
        {lineBreaks.includes("laptop") && (
          <br className="hero-line-break-laptop" aria-hidden="true" />
        )}
        {lineBreaks.includes("desktop") && (
          <br className="hero-line-break-desktop" aria-hidden="true" />
        )}
        <span className={segment.highlight ? "text-primary" : "text-white"}>
          {visibleText}
        </span>
      </span>
    );
  });
};

const BannerSection = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [phase, setPhase] = useState<"typing-first" | "switching" | "done">(
    "typing-first",
  );

  useEffect(() => {
    if (phase === "done") return;

    const firstLineLength = getMessageLength(HERO_TYPED_MESSAGES[0]);
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing-first") {
      if (visibleChars < firstLineLength) {
        timer = setTimeout(() => setVisibleChars((prev) => prev + 1), 28);
      } else {
        timer = setTimeout(() => setPhase("switching"), 5000);
      }
    } else {
      timer = setTimeout(() => {
        setLineIndex(1);
        setPhase("done");
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [phase, visibleChars]);

  return (
    <>
      {/* Banner Section Start */}
      <section className="banner-section-three aos">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center justify-content-between">
            <div className="col-xxl-6 col-lg-7">
              <div className="banner-content" data-aos="fade-up">
                <div className="banner-badge d-inline-flex align-items-center">
                  <span className="me-2 d-inline-flex align-items-center text-primary">
                    <i className="material-icons-outlined">verified</i>
                  </span>
                  <p className="mb-0">Trusted Across Nigeria</p>
                </div>
                <h1
                  style={{
                    opacity: phase === "switching" ? 0 : 1,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  {renderTypedMessage(
                    HERO_TYPED_MESSAGES[lineIndex],
                    lineIndex === 0
                      ? visibleChars
                      : getMessageLength(HERO_TYPED_MESSAGES[1]),
                  )}
                  {phase === "typing-first" && <span className="text-white">|</span>}
                </h1>
                <p>
                  Find properties in Lagos, Abuja, and Port Harcourt for rent
                  or purchase.
                  <br />
                  1,600+ verified listings.
                </p>
                <Link
                  to={all_routes.buyPropertyGrid}
                  className="btn btn-primary"
                >
                  <i className="material-icons-outlined me-2">lock</i>List Your
                  Property
                </Link>
              </div>
            </div>
            {/* end col */}
            <div className="col-xxl-4 col-lg-5">
              <div className="banner-right-content">
                <div className="banner-card">
                  <div className="card-img">
                    <Link to={getBuyDetailsPath("naf-valley-estate")}>
                      <ImageWithBasePath
                        src="assets/img/home-3/banner-01.png"
                        className="banner-card__image"
                        alt="Beautiful Condo Room"
                      />
                    </Link>
                  </div>
                  <div className="banner-card__body">
                    <h6 className="text-white">
                      <Link to={getBuyDetailsPath("naf-valley-estate")} className="text-white">
                        Beautiful Condo Room
                      </Link>
                    </h6>
                    <span className="text-white mb-1 d-block">
                      Ikoyi Villla Apartment
                    </span>
                    <p className="rate-info mb-3">
                      <span>₦450,000 </span> / month
                    </p>
                    <div className="d-flex align-items-center card-info">
                      <p className="me-3">
                        <span className="me-2">
                          <i className="material-icons-outlined">bed</i>
                        </span>
                        2 Bedroom
                      </p>
                      <p>
                        <span className="me-2">
                          <i className="material-icons-outlined">bathtub</i>
                        </span>
                        2 Bath
                      </p>
                    </div>
                  </div>
                </div>
                <div className="banner-users d-flex align-items-center flex-wrap gap-2 mb-3">
                  <CustomerAvatarStack />
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <h6 className="mb-0 me-2 text-white fw-semibold fs-14">
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
                    <p className="mb-0 text-white fs-13">
                      Trusted By Client around the World
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-lg-12">
              <div
                className="banner-search banner-search-three"
                data-aos="fade-down"
              >
                <div className="banner-tab">
                  {/* start row */}
                  <div className="row">
                    <div className="col-lg-4">
                      <div>
                        <h5 className="mb-0">Search For your Property</h5>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-8">
                      <div>
                        <ul
                          className="nav nav-tabs justify-content-lg-end"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <Link
                              className="nav-link active"
                              data-bs-toggle="tab"
                              to="#buy_property"
                              role="tab"
                              aria-controls="buy_property"
                              aria-selected="true"
                            >
                              <i className="material-icons-outlined me-2">
                                shopping_basket
                              </i>
                              Buy Property
                            </Link>
                          </li>
                          <li className="nav-item" role="presentation">
                            <Link
                              className="nav-link"
                              data-bs-toggle="tab"
                              to="#rent_property"
                              role="tab"
                              aria-controls="rent_property"
                              aria-selected="false"
                            >
                              <i className="material-icons-outlined me-2">
                                king_bed
                              </i>
                              Rent Property
                            </Link>
                          </li>
                          <li className="nav-item" role="presentation">
                            <Link
                              className="nav-link"
                              data-bs-toggle="tab"
                              to="#commercial_property"
                              role="tab"
                              aria-controls="commercial_property"
                              aria-selected="false"
                            >
                              <i className="material-icons-outlined me-2">
                                home
                              </i>
                              Commercial
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="buy_property"
                    role="tabpanel"
                  >
                    <div>
                      <form>
                        {/* start row */}
                        <div className="row g-3">
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">
                                Type of Property
                              </label>
                              <CommonSelect
                                options={Property_Type}
                                className="select"
                                defaultValue={Property_Type[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">Location</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search location"
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div className="d-flex align-items-end">
                              <div className="flex-fill me-3">
                                <label className="form-label">Min Price</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div className="flex-fill me-3">
                                <label className="form-label">Max Price</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div>
                                <Link
                                  to={all_routes.buyPropertyGridSidebar}
                                  className="btn btn-primary home-btn"
                                >
                                  <span className="d-flex align-items-center">
                                    <i className="material-icons-outlined">
                                      search
                                    </i>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                      </form>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="rent_property"
                    role="tabpanel"
                  >
                    <div>
                      <form>
                        {/* start row */}
                        <div className="row g-3">
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">
                                Type of Property
                              </label>
                              <CommonSelect
                                options={Property_Type}
                                className="select"
                                defaultValue={Property_Type[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">Location</label>
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Search location"
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div className="d-flex align-items-end">
                              <div className="banner-property-grid flex-fill me-3">
                                <label className="form-label">Min Price</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div className="flex-fill me-3">
                                <label className="form-label">Max Price</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div>
                                <Link
                                  to={all_routes.rentPropertyGridSidebar}
                                  className="btn btn-primary home-btn"
                                >
                                  <span className="d-flex align-items-center">
                                    <i className="material-icons-outlined">
                                      search
                                    </i>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                      </form>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="commercial_property"
                    role="tabpanel"
                  >
                    <div>
                      <form>
                        {/* start row */}
                        <div className="row g-3">
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">
                                Type of Property
                              </label>
                              <CommonSelect
                                options={Property_Type}
                                className="select"
                                defaultValue={Property_Type[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div>
                              <label className="form-label">Location</label>
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Search location"
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-4">
                            <div className="d-flex align-items-end">
                              <div className="banner-property-grid flex-fill me-3">
                                <label className="form-label">Min Price</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div className="flex-fill me-3">
                                <label className="form-label">Max Price</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="₦"
                                />
                              </div>
                              <div>
                                <Link
                                  to={all_routes.rentPropertyGridSidebar}
                                  className="btn btn-primary home-btn"
                                >
                                  <span className="d-flex align-items-center">
                                    <i className="material-icons-outlined">
                                      search
                                    </i>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                      </form>
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
      {/* Banner Section End */}
    </>
  );
};

export default BannerSection;
