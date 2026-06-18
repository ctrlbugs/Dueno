import { useEffect, useState } from "react";
import { Badge, Button, Card, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import { useAdminSearch } from "../context/AdminSearchContext";
import { filterQueueListings } from "../components/AdminSearchResults";
import {
  getPendingListingsByStatus,
  subscribeListings,
  updateListingStatus,
} from "../services/listingQueueStore";
import type { PendingListing } from "../types";

const ListingsQueuePage = () => {
  const { query } = useAdminSearch();
  const [, refresh] = useState(0);
  const [preview, setPreview] = useState<PendingListing | null>(null);

  useEffect(() => {
    return subscribeListings(() => refresh((n) => n + 1));
  }, []);

  const pendingListings = filterQueueListings(
    getPendingListingsByStatus("pending_review"),
    query,
  );

  const handleStatus = (
    listing: PendingListing,
    status: PendingListing["status"]
  ) => {
    updateListingStatus(listing.id, status);
    if (preview?.id === listing.id) {
      setPreview(null);
    }
  };

  return (
    <>
      <AdminPageBreadcrumb title="Approval Queue" subName="Listings" />

      <Card>
        <Card.Body>
          <h4 className="header-title mb-1">Submitted Listings</h4>
          <p className="text-muted mb-4">
            {pendingListings.length} listing
            {pendingListings.length === 1 ? "" : "s"}
            {query.trim() ? " matching your search" : " awaiting review"}.
          </p>

          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Photo</th>
                  <th>Property</th>
                  <th>Agent</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingListings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      {query.trim()
                        ? "No queue listings match your search."
                        : "No listings awaiting approval."}
                    </td>
                  </tr>
                ) : (
                  pendingListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      {listing.images[0] ? (
                        <button
                          type="button"
                          className="btn p-0 border-0 bg-transparent"
                          onClick={() => setPreview(listing)}
                        >
                          <img
                            src={listing.images[0].dataUrl}
                            alt={listing.title}
                            className="rounded"
                            style={{
                              width: 56,
                              height: 42,
                              objectFit: "cover",
                            }}
                          />
                        </button>
                      ) : (
                        <span className="text-muted">No photos</span>
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
                      <div>{listing.agentName}</div>
                      <small className="text-muted">{listing.agentEmail}</small>
                    </td>
                    <td>
                      <Badge bg={listing.listingType === "sale" ? "primary" : "info"}>
                        {listing.listingType === "sale" ? "For Sale" : "For Rent"}
                      </Badge>
                    </td>
                    <td>{listing.city}</td>
                    <td>{listing.price}</td>
                    <td>
                      {new Date(listing.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {listing.images.length > 0 && (
                          <Button
                            size="sm"
                            variant="soft-secondary"
                            onClick={() => setPreview(listing)}
                          >
                            Photos
                          </Button>
                        )}
                        <Link
                          to={`/admin/listings/${listing.id}/edit`}
                          className="btn btn-sm btn-soft-secondary"
                        >
                          Edit
                        </Link>
                        <Button
                          size="sm"
                          variant="soft-success"
                          onClick={() => handleStatus(listing, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="soft-danger"
                          onClick={() => handleStatus(listing, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {pendingListings.length === 0 && !query.trim() && (
            <div className="text-center py-5 text-muted">
              No listings awaiting review.
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(preview)}
        onHide={() => setPreview(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{preview?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preview && (
            <>
              <p className="text-muted mb-3">{preview.description}</p>
              <div className="row g-3">
                {preview.images.map((image) => (
                  <div className="col-md-6" key={image.id}>
                    <img
                      src={image.dataUrl}
                      alt={image.name}
                      className="w-100 rounded border"
                      style={{ maxHeight: 280, objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ListingsQueuePage;
