import Header from "../../core/common/header";
import Footer from "../../core/common/footer";
import { Outlet, useLocation } from "react-router";
import CommonModal from "../../core/common/Common-modal/CommonModal";
import { all_routes } from "../routes/all_routes";
import { isServiceDetailPath } from "../../data/duenoServices";

const Feature = () => {
  const location = useLocation();

  const isPropertyDetailsPage = /^\/(buy|rent)-details(\/|$)/.test(
    location.pathname
  );
  const isServiceDetailPage = isServiceDetailPath(location.pathname);
  const usesOverlayHeader =
    location.pathname === all_routes.index3 || isServiceDetailPage;

  return (
    <>
      <div className="main-wrapper">
        <div
          className={`${
            location.pathname === "/index-2"
              ? "main-header-two"
              : usesOverlayHeader
              ? `main-header-two${
                  isServiceDetailPage ? " service-page-header" : ""
                }`
              : isPropertyDetailsPage ||
                  location.pathname === "/buy-details-schedule"
                ? "buy-details-header-item"
                : ""
          }`}
        >
          <Header />
        </div>
        <Outlet />
        <Footer />
        <CommonModal/>
      </div>
    </>
  );
};

export default Feature;
