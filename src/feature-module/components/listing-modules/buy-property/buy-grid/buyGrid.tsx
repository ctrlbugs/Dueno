import { Link, useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import { all_routes } from "../../../../routes/all_routes";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import {
  filterPropertiesByLocationSlug,
  getAllLiveProperties,
  getLocationFilterLabel,
  getSaleProperties,
} from "../../../../../data/estateProperties";
import { matchesSearchQuery } from "../../../../../utils/searchFilter";
import {
  sortEstateProperties,
  type ListingPriceRange,
  type ListingSortBy,
} from "../../../../../utils/propertyListingSort";
import BuyGridPropertyCard from "../../shared/BuyGridPropertyCard";
import ListingSortToolbar from "../../shared/ListingSortToolbar";

const BuyGrid = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<ListingSortBy>("Default");
  const [priceRange, setPriceRange] = useState<ListingPriceRange>("Low to High");
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
  const saleProperties = useMemo(
    () =>
      sortEstateProperties(
        filterPropertiesByLocationSlug(
          locationSlug ? getAllLiveProperties() : getSaleProperties(),
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
        ),
        sortBy,
        priceRange,
      ),
    [locationSlug, searchQuery, sortBy, priceRange],
  );
  const totalCount = saleProperties.length;

  return (
    <>
      <div className="page-wrapper">
        <Breadcrumb
          title={locationLabel ? `Properties in ${locationLabel}` : "Buy Property"}
          paths={[{ label: "Buy Property", active: true }]}
        />
        <div className="content overflow-hidden">
          <div className="container">
            <div className="card border-0 search-item mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-3">
                    <p className="mb-4 mb-lg-0 mb-md-3 text-lg-start text-md-start text-center">
                      {locationLabel || searchQuery.trim() ? (
                        <>
                          Showing{" "}
                          <span className="result-value">
                            {String(totalCount).padStart(2, "0")}
                          </span>{" "}
                          listings
                          {locationLabel ? (
                            <>
                              {" "}
                              in{" "}
                              <span className="result-value">
                                {locationLabel}
                              </span>
                            </>
                          ) : null}
                          {searchQuery.trim() ? (
                            <>
                              {" "}
                              for &ldquo;
                              <span className="result-value">
                                {searchQuery.trim()}
                              </span>
                              &rdquo;
                            </>
                          ) : null}
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
                      <ListingSortToolbar
                        sortBy={sortBy}
                        priceRange={priceRange}
                        onSortByChange={setSortBy}
                        onPriceRangeChange={setPriceRange}
                      />
                      <ul className="grid-list-view d-flex align-items-center justify-content-center">
                        <li>
                          <Link
                            to={`${all_routes.buyPropertyList}${listQuery}`}
                            className="list-icon"
                          >
                            <i className="material-icons">list</i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={all_routes.buyPropertyGrid}
                            className="list-icon active"
                          >
                            <i className="material-icons">grid_view</i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`${all_routes.buyGridMap}${listQuery}`}
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
              {saleProperties.length > 0 ? (
                saleProperties.map((property) => (
                  <BuyGridPropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0">
                    No listings found in {locationLabel ?? "this location"} yet.
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

export default BuyGrid;
