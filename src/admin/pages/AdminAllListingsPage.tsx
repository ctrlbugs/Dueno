import { useEffect, useState } from "react";
import { Badge, Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import { useAdminSearch } from "../context/AdminSearchContext";
import { filterLiveListings } from "../components/AdminSearchResults";
import {
  getAllLiveProperties,
  getPropertyDetailsPath,
  ESTATE_PROPERTIES,
} from "../../data/estateProperties";
import {
  deleteAnyListing,
  getPendingListings,
  subscribeListings,
} from "../services/listingQueueStore";
import { subscribePublishedListings } from "../../services/publishedListingsStore";

const AdminAllListingsPage = () => {
  const { query } = useAdminSearch();
  const [, refresh] = useState(0);

  useEffect(() => {
    const unsubQueue = subscribeListings(() => refresh((n) => n + 1));
    const unsubPublished = subscribePublishedListings(() => refresh((n) => n + 1));
    return () => {
      unsubQueue();
      unsubPublished();
    };
  }, []);

  const liveProperties = filterLiveListings(getAllLiveProperties(), query);
  const queue = getPendingListings();
  const staticIds = new Set(ESTATE_PROPERTIES.map((p) => p.id));

  const handleDelete = (id: string, isStatic: boolean) => {
    if (
      !window.confirm(
        isStatic
          ? "Remove this catalog listing from the public site?"
          : "Delete this listing permanently?",
      )
    ) {
      return;
    }
    deleteAnyListing(id, { isStaticCatalog: isStatic });
  };

  return (
    <>
      <AdminPageBreadcrumb title="All Listings" subName="Listings" />

      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="header-title mb-1">Manage Listings</h4>
            <p className="text-muted mb-0">
              {liveProperties.length} shown
              {query.trim() ? ` (filtered)` : ""} · {queue.length} in queue
            </p>
          </div>
          <Link to="/admin/listings" className="btn btn-outline-primary">
            Approval Queue
          </Link>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Agent</th>
                  <th>Price</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveProperties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No listings match your search.
                    </td>
                  </tr>
                ) : (
                  liveProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="fw-semibold">{property.title}</td>
                    <td>
                      <Badge
                        bg={
                          property.listingType === "For Sale" ? "primary" : "info"
                        }
                      >
                        {property.listingType}
                      </Badge>
                    </td>
                    <td>{property.agentName ?? "Dueno Property Team"}</td>
                    <td>{property.price}</td>
                    <td>
                      {property.isUploaded ? (
                        <Badge bg="success">Uploaded</Badge>
                      ) : (
                        <Badge bg="secondary">Catalog</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Link
                          to={getPropertyDetailsPath(property)}
                          className="btn btn-sm btn-soft-primary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </Link>
                        {property.isUploaded && (
                          <Link
                            to={`/admin/listings/${property.id}/edit`}
                            className="btn btn-sm btn-soft-secondary"
                          >
                            Edit
                          </Link>
                        )}
                        <Button
                          size="sm"
                          variant="soft-danger"
                          onClick={() =>
                            handleDelete(property.id, staticIds.has(property.id))
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminAllListingsPage;
