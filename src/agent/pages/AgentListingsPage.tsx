import { useEffect, useState } from "react";
import { Badge, Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import { useAgentSearch } from "../context/AgentSearchContext";
import { matchesSearchQuery } from "../../utils/searchFilter";
import { useAuth } from "../../context/AuthContext";
import {
  deleteListingByAgent,
  getListingsByAgentId,
  subscribeListings,
} from "../../services/listingQueueStore";
import { getPropertyDetailsPath } from "../../data/estateProperties";
import { getPublishedListingById } from "../../services/publishedListingsStore";
import ImageWithBasePath from "../../core/imageWithBasePath";
import { getListingThumbnailRaw } from "../../utils/listingImage";

const statusLabel: Record<string, string> = {
  pending_review: "Pending Review",
  approved: "Published",
  rejected: "Rejected",
  draft: "Draft",
};

const AgentListingsPage = () => {
  const { user } = useAuth();
  const { query } = useAgentSearch();
  const [, refresh] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeListings(() => refresh((n) => n + 1)), []);

  const listings = (user ? getListingsByAgentId(user.id) : []).filter(
    (listing) =>
      matchesSearchQuery(
        query,
        listing.title,
        listing.city,
        listing.state,
        listing.address,
        listing.price,
        listing.listingType,
        listing.category,
        statusLabel[listing.status],
      ),
  );

  const handleDelete = (id: string) => {
    if (!user) return;
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      deleteListingByAgent(id, user.id);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete listing.");
    }
  };

  return (
    <>
      <AgentPageBreadcrumb title="My Listings" subName="Properties" />

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="header-title mb-1">Your Properties</h4>
              <p className="text-muted mb-0">
                {listings.length} listing{listings.length === 1 ? "" : "s"}
                {query.trim() ? " matching your search" : ""}.
              </p>
            </div>
            <Link to="/agent/listings/new" className="btn btn-primary">
              <i className="ri-add-line me-1" />
              Add Listing
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Photo</th>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      {query.trim()
                        ? "No listings match your search."
                        : "No listings yet."}
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => {
                  const published = getPublishedListingById(listing.id);
                  const thumbnail = getListingThumbnailRaw(listing, published);
                  return (
                    <tr key={listing.id}>
                      <td>
                        {thumbnail ? (
                          <ImageWithBasePath
                            src={thumbnail}
                            alt={listing.title}
                            className="rounded agent-listing-thumb"
                            height={42}
                            width={56}
                          />
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="fw-semibold">
                        {listing.title}
                        {listing.images.length > 0 && (
                          <small className="d-block text-muted fw-normal">
                            {listing.images.length} photo
                            {listing.images.length === 1 ? "" : "s"}
                          </small>
                        )}
                      </td>
                      <td>
                        <Badge bg={listing.listingType === "sale" ? "primary" : "info"}>
                          {listing.listingType === "sale" ? "Sale" : "Rent"}
                        </Badge>
                      </td>
                      <td>
                        {listing.city}, {listing.state}
                      </td>
                      <td>{listing.price}</td>
                      <td>
                        <Badge
                          bg={
                            listing.status === "approved"
                              ? "success"
                              : listing.status === "rejected"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {statusLabel[listing.status]}
                        </Badge>
                      </td>
                      <td>
                        {new Date(listing.submittedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {published && (
                            <Link
                              to={getPropertyDetailsPath(published)}
                              className="btn btn-sm btn-soft-primary"
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </Link>
                          )}
                          <Button
                            size="sm"
                            variant="soft-danger"
                            onClick={() => handleDelete(listing.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
                )}
              </tbody>
            </Table>
          </div>

          {listings.length === 0 && !query.trim() && (
            <div className="text-center py-5 text-muted">
              No listings yet.{" "}
              <Link to="/agent/listings/new">Submit your first property</Link>.
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default AgentListingsPage;
