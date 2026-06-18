import { Link, useSearchParams } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { Price_Range, Sort_By } from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import {
  filterPropertiesByLocationSlug,
  getLocationFilterLabel,
  getRentProperties,
} from "../../../../../data/estateProperties";
import { matchesSearchQuery } from "../../../../../utils/searchFilter";
import BuyGridPropertyCard from "../../shared/BuyGridPropertyCard";

const RentGrid = () => {
  const [searchParams] = useSearchParams();
  const locationSlug = searchParams.get("location");
  const searchQuery = searchParams.get("q") ?? "";
  const locationLabel = getLocationFilterLabel(locationSlug);
  const locationQuery = locationSlug
    ? `?location=${encodeURIComponent(locationSlug)}`
    : "";
  const searchQuerySuffix = searchQuery
    ? `${locationQuery ? "&" : "?"}q=${encodeURIComponent(searchQuery)}`
    : "";
  const listQuery = `${locationQuery}${searchQuerySuffix}`;
  const rentProperties = filterPropertiesByLocationSlug(
    getRentProperties(),
    locationSlug,
  ).filter((property) =>
    matchesSearchQuery(
      searchQuery,
      property.title,
      property.fullTitle,
      property.address,
      property.agentName,
      property.price,
      property.category,
      property.listingType,
    ),
  );
  const totalCount = rentProperties.length;

  return (
    <>
      <div className="page-wrapper">
        <Breadcrumb
          title={locationLabel ? `Rent in ${locationLabel}` : "Rent Grid"}
          paths={[{ label: "Rent Grid", active: true }]}
        />
        <div className="content overflow-hidden">
          <div className="container">
            <div className="card border-0 search-item mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <p className="mb-4 mb-lg-0 mb-md-3 text-lg-start text-md-start text-center">
                      {locationLabel ? (
                        <>
                          Showing{" "}
                          <span className="result-value">
                            {String(totalCount).padStart(2, "0")}
                          </span>{" "}
                          rentals in{" "}
                          <span className="result-value">{locationLabel}</span>
                        </>
                      ) : (
                        <>
                          Showing result{" "}
                          <span className="result-value">
                            {String(totalCount).padStart(2, "0")}
                          </span>
                          of
                          <span className="result-value">
                            {" "}
                            {String(totalCount).padStart(2, "0")}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="col-lg-9">
                    <div className="d-flex align-items-center gap-3 flex-wrap justify-content-lg-end flex-lg-row flex-md-row flex-column">
                      <div className="result-list d-flex d-block flex-lg-row flex-md-row flex-column align-items-center gap-2">
                        <h5>Sort By</h5>
                        <div className="result-select">
                          <CommonSelect
                            options={Sort_By}
                            className="select"
                            defaultValue={Sort_By[0]}
                          />
                        </div>
                      </div>
                      <div className="result-list d-flex flex-lg-row flex-md-row flex-column align-items-center gap-2">
                        <h5>Price Range</h5>
                        <div className="result-select">
                          <CommonSelect
                            options={Price_Range}
                            className="select"
                            defaultValue={Price_Range[0]}
                          />
                        </div>
                      </div>
                      <ul className="grid-list-view d-flex align-items-center justify-content-center">
                        <li>
                          <Link
                            to={`${all_routes.rentPropertyList}${listQuery}`}
                            className="list-icon"
                          >
                            <i className="material-icons">list</i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={all_routes.rentPropertyGrid}
                            className="list-icon active"
                          >
                            <i className="material-icons">grid_view</i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`${all_routes.rentGridMap}${listQuery}`}
                            className="list-icon"
                          >
                            <i className="material-icons-outlined">
                              location_on
                            </i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4 property-listings-grid">
              {rentProperties.length > 0 ? (
                rentProperties.map((property) => (
                  <BuyGridPropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0">
                    No rentals found in {locationLabel ?? "this location"} yet.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentGrid;
