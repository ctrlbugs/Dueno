import { Link } from "react-router";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import ListingSliderProperties from "./listingSliderProperties";
import ListingSliderApartments from "./listingSliderApartments";
import ListingSliderCondos from "./listingSliderCondos";
import ListingSliderHome from "./listingSliderHome";
import AgentSidebar from "./agentSidebar";


const AgentDetails = () => {
  return (
    <>
      {/* ========================
		Start Page Content
	========================= */}
      <div className="page-wrapper">
        <Breadcrumb
          title="Agent Details"
          paths={[{ label: "Agent Details", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            <div className="agent-profile-item">
              <div className="agent-img">
                <ImageWithBasePath
                  src="assets/img/agents/agent-01.jpg"
                  alt="image"
                />
              </div>
              <div className="agent-content flex-fill">
                <div className="d-flex align-items-center mb-3">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons text-warning">star_border</i>
                  <i className="material-icons text-warning">star_border</i>
                  <span className="fs-14 ms-1">5.0 (37 Reviews)</span>
                </div>
                <div className="d-flex align-items-center justify-content-between border-bottom flex-wrap row-gap-3 pb-3 mb-3">
                  <div>
                    <h5 className="mb-1">Milton Rodriguez</h5>
                    <p className="mb-0 fs-14">Vihaan Real-estate</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      <i className="material-icons-outlined me-1">
                        chat_bubble_outline
                      </i>
                      WhatsApp
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-dark d-inline-flex align-items-center"
                    >
                      <i className="material-icons-outlined me-1">call</i>Call
                      Me
                    </Link>
                  </div>
                </div>
                <div className="agent-info">
                  <p>
                    Member Since : <span>28 Apr 2025</span>
                  </p>
                  <p>
                    Agent License : <span>090-0348-843</span>
                  </p>
                  <p>
                    Tax Number : <span>090-0348-843</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="accordion accordions-items-seperate">
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-1"
                        aria-expanded="true"
                      >
                        About
                      </button>
                    </div>
                    <div
                      id="accordion-1"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <p>
                          With generous frontage on a paved county road and all
                          necessary utilities at the boundary, you can build
                          your dream cabin, homestead, or weekend getaway with
                          ease. Imagine sipping your morning coffee on a
                          wrap-around porch as mist drifts through the valley
                          below, or gathering around a firepit under a canopy of
                          stars.
                        </p>
                        <div className="more-menu">
                          <p>
                            Imagine sipping your morning coffee on a wrap-around
                            porch as mist drifts through the valley below, or
                            gathering around a firepit under a canopy of stars.
                          </p>
                        </div>
                        <div className="view-all d-inline-flex align-items-center">
                          <Link to="#" className="viewall-button">
                            Read More{" "}
                          </Link>
                          <i className="material-icons-outlined">
                            keyboard_arrow_down
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-2"
                        aria-expanded="true"
                      >
                        Service Areas
                      </button>
                    </div>
                    <div
                      id="accordion-2"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="service-area">
                          <p className="d-inline-flex align-items-center">
                            <span className="d-inline-flex me-2">
                              <i className="material-icons-outlined">place</i>
                            </span>
                            Chicago
                          </p>
                          <p className="d-inline-flex align-items-center">
                            <span className="d-inline-flex me-2">
                              <i className="material-icons-outlined">place</i>
                            </span>
                            Los Angeles
                          </p>
                          <p className="d-inline-flex align-items-center">
                            <span className="d-inline-flex me-2">
                              <i className="material-icons-outlined">place</i>
                            </span>
                            Miami Beach
                          </p>
                          <p className="d-inline-flex align-items-center">
                            <span className="d-inline-flex me-2">
                              <i className="material-icons-outlined">place</i>
                            </span>
                            New York
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <div className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-3"
                        aria-expanded="true"
                      >
                        Specialities
                      </button>
                    </div>
                    <div
                      id="accordion-3"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="d-flex align-items-center flex-wrap row-gap-3">
                          <span className="badge bg-light text-dark me-3">
                            Property Management
                          </span>
                          <span className="badge bg-light text-dark me-3">
                            Real Estate Management
                          </span>
                          <span className="badge bg-light text-dark me-3">
                            Real Estate Appraising
                          </span>
                          <span className="badge bg-light text-dark">
                            Apartment Brokerage
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-top position-relative mt-3 pt-3 mb-4 mb-lg-0">
                  <h5 className="mb-4">My Listing </h5>
                  <ul className="nav nav-pills listing-nav" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link active"
                        data-bs-toggle="tab"
                        to="#listing-1"
                        role="tab"
                        aria-controls="listing-1"
                        aria-selected="true"
                      >
                        <i className="material-icons-outlined me-2">
                          maps_home_work
                        </i>
                        All Properties (25)
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link"
                        data-bs-toggle="tab"
                        to="#listing-2"
                        role="tab"
                        aria-controls="listing-2"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        <i className="material-icons-outlined me-2">
                          apartment
                        </i>
                        Apartment
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link"
                        data-bs-toggle="tab"
                        to="#listing-3"
                        role="tab"
                        aria-controls="listing-3"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        <i className="material-icons-outlined me-2">
                          corporate_fare
                        </i>
                        Condos
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        className="nav-link"
                        data-bs-toggle="tab"
                        to="#listing-4"
                        role="tab"
                        aria-controls="listing-4"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        <i className="material-icons-outlined me-2">home</i>Home
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane fade active show"
                      id="listing-1"
                      role="tabpanel"
                    >
              <ListingSliderProperties/>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="listing-2"
                      role="tabpanel"
                    >
                      <ListingSliderApartments/>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="listing-3"
                      role="tabpanel"
                    >
                    <ListingSliderCondos/>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="listing-4"
                      role="tabpanel"
                    >
                     <ListingSliderHome/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 theiaStickySidebar">
                <AgentSidebar/>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}

        {/* Search Modal */}
        <div
          className="modal fade"
          id="search-modal"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body search-wrap">
                <form
                  className="search-form"
                  id="search-form"

                >
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5>What Are You Looking for?</h5>
                    <Link to="#" className="close" data-bs-dismiss="modal">
                      <i className="material-icons-outlined">close</i>
                    </Link>
                  </div>
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Keyword...."
                    />
                    <span className="input-group-text">
                      <i className="material-icons-outlined">search</i>
                    </span>
                  </div>
                  <h6>Popular Properties</h6>
                  <div className="search-list">
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Beautiful Condo Room
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Royal Apartment
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Grand Villa House
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>Grand Mahaka</Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Lunaria Residence
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Stephen Alexander Homes
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* End Search Modal */}
      </div>
      {/* ========================
		End Page Content
	========================= */}
    </>
  );
};

export default AgentDetails;
