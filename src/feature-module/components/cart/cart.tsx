import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/imageWithBasePath";
import { all_routes } from "../../routes/all_routes";
import {
  getEstatePropertyById,
  getPropertyDetailsPath,
} from "../../../data/estateProperties";
import {
  getSavedPropertyIdsForUser,
  getVisitorId,
  subscribePropertyReviews,
  togglePropertySaved,
} from "../../../services/propertyReviewStore";
import { resolvePropertyPrice } from "../../../utils/propertyDisplay";

const Cart = () => {
  const userId = getVisitorId();
  const [tick, setTick] = useState(0);

  useEffect(() => subscribePropertyReviews(() => setTick((n) => n + 1)), []);

  const savedProperties = useMemo(
    () =>
      getSavedPropertyIdsForUser(userId)
        .map((id) => getEstatePropertyById(id))
        .filter(Boolean),
    [userId, tick],
  );

  const handleRemove = (propertyId: string) => {
    togglePropertySaved(propertyId, userId);
    setTick((n) => n + 1);
  };

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title="Saved Properties"
        paths={[{ label: "Saved Properties", active: true }]}
      />
      <div className="content">
        <div className="container">
          <div className="row" id="cart-wrap">
            <div className="col-lg-12 mx-auto">
              <div className="cart-item-wrap">
                <div className="cart-item-01">
                  <div className="cart-title">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <h5 className="mb-0">
                        {savedProperties.length}{" "}
                        {savedProperties.length === 1 ? "Property" : "Properties"}{" "}
                        Saved
                      </h5>
                      {savedProperties.length > 0 ? (
                        <Link
                          to={all_routes.buyProperty}
                          className="btn btn-dark btn-sm"
                        >
                          Browse More
                        </Link>
                      ) : null}
                    </div>
                    <hr />
                  </div>

                  {savedProperties.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="material-icons-outlined fs-48 text-muted mb-3 d-block">
                        favorite_border
                      </i>
                      <h5 className="mb-2">No saved properties yet</h5>
                      <p className="text-muted mb-4">
                        Tap the heart icon on any listing to save it here.
                      </p>
                      <Link to={all_routes.buyProperty} className="btn btn-dark">
                        Explore Properties
                      </Link>
                    </div>
                  ) : (
                    savedProperties.map((property) => {
                      if (!property) return null;
                      const detailsPath = getPropertyDetailsPath(property);
                      return (
                        <div
                          key={property.id}
                          className="cart-item-02 border-bottom pb-4 mb-4"
                        >
                          <div className="row align-items-center row-gap-3">
                            <div className="col-lg-7">
                              <div className="row align-items-center row-gap-3">
                                <div className="col-lg-5">
                                  <Link to={detailsPath}>
                                    <ImageWithBasePath
                                      src={property.cardImage}
                                      alt={property.title}
                                      className="img-fluid rounded"
                                    />
                                  </Link>
                                </div>
                                <div className="col-lg-7">
                                  <div className="d-flex align-items-center mb-1 gap-2">
                                    <h6 className="mb-0">
                                      <Link to={detailsPath}>{property.title}</Link>
                                    </h6>
                                    <span className="badge badge-sm bg-secondary">
                                      {property.listingType}
                                    </span>
                                  </div>
                                  <p className="address mb-2">
                                    <i className="material-icons-outlined">
                                      location_on
                                    </i>
                                    {property.address}
                                  </p>
                                  <h6 className="text-primary mb-0">
                                    {resolvePropertyPrice(property.price)}
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5">
                              <div className="d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
                                <Link to={detailsPath} className="btn btn-dark">
                                  View Details
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => handleRemove(property.id)}
                                >
                                  <i className="material-icons-outlined">delete</i>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
