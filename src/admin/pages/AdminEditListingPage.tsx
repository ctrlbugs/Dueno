import { useMemo, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import ListingForm from "../../shared/components/ListingForm";
import {
  adminSaveListing,
  getListingForEdit,
} from "../services/listingQueueStore";
import { getAgentsByStatus } from "../services/agentStore";

const AdminEditListingPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const listing = listingId ? getListingForEdit(listingId) : undefined;
  const agents = useMemo(() => getAgentsByStatus("approved"), []);

  if (!listingId) {
    return <Navigate to="/admin/listings/all" replace />;
  }

  if (!listing) {
    return (
      <>
        <AdminPageBreadcrumb title="Edit Listing" subName="Listings" />
        <Alert variant="warning">
          This catalog listing cannot be edited here. Only uploaded listings are
          editable.{" "}
          <Link to="/admin/listings/all">Back to all listings</Link>
        </Alert>
      </>
    );
  }

  return (
    <>
      <AdminPageBreadcrumb title="Edit Listing" subName="Listings" />

      <Row>
        <Col xl={8}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-1">{listing.title}</h4>
              <p className="text-muted mb-4">
                Changes republish immediately when you save.
              </p>

              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group className="mb-4">
                <label className="form-label">Assigned agent</label>
                <select
                  className="form-select"
                  value={listing.agentId}
                  disabled
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.firstName} {agent.lastName}
                    </option>
                  ))}
                  <option value="dueno-admin">Dueno Property Team</option>
                </select>
                <small className="text-muted">
                  Reassign agents from create flow when adding new listings.
                </small>
              </Form.Group>

              <ListingForm
                key={listing.id}
                showOwnerLockFields
                submitLabel="Save & Republish"
                initial={{
                  ...listing,
                }}
                onSubmit={async (input) => {
                  adminSaveListing(
                    {
                      ...input,
                      id: listing.id,
                      createdBy: listing.createdBy,
                    },
                    { publish: true },
                  );
                  setSuccess("Listing updated on the public site.");
                  setTimeout(() => navigate("/admin/listings/all"), 1200);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card>
            <Card.Body>
              <Link to="/admin/listings/all" className="btn btn-light w-100">
                Back to All Listings
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminEditListingPage;
