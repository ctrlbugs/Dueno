import { useMemo, useState } from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import ListingForm from "../../shared/components/ListingForm";
import { adminSaveListing } from "../services/listingQueueStore";
import { getAgentAvatarUrl, getAgentsByStatus } from "../services/agentStore";
import { DUENO_CONTACT } from "../../data/siteContact";

const AdminCreateListingPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [agentId, setAgentId] = useState("");
  const agents = useMemo(() => getAgentsByStatus("approved"), []);
  const selectedAgent = agents.find((agent) => agent.id === agentId);

  return (
    <>
      <AdminPageBreadcrumb title="Create Listing" subName="Listings" />

      <Row>
        <Col xl={8}>
          <Card className="mb-3">
            <Card.Body>
              <h4 className="header-title mb-1">Publish a Property</h4>
              <p className="text-muted mb-4">
                Admin-created listings go live immediately. Assign an agent or
                use company details for the listing owner block.
              </p>

              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group className="mb-4">
                <Form.Label>Listing agent</Form.Label>
                <Form.Select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                >
                  <option value="">Dueno Property (company listing)</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.firstName} {agent.lastName} — {agent.agencyName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <ListingForm
                key={agentId || "company"}
                showOwnerLockFields
                submitLabel="Publish Listing"
                initial={{
                  agentId: selectedAgent?.id ?? "dueno-admin",
                  agentName: selectedAgent
                    ? `${selectedAgent.firstName} ${selectedAgent.lastName}`
                    : DUENO_CONTACT.teamName,
                  agentEmail: selectedAgent?.email ?? DUENO_CONTACT.email,
                  agentAvatar: getAgentAvatarUrl(selectedAgent),
                  createdBy: "admin",
                  ownerContact: {
                    phone: selectedAgent?.phone ?? DUENO_CONTACT.phone,
                    email: selectedAgent?.email ?? DUENO_CONTACT.email,
                    whatsapp: DUENO_CONTACT.whatsappUrl,
                    location: selectedAgent
                      ? `${selectedAgent.city}, ${selectedAgent.state}`
                      : DUENO_CONTACT.address,
                    useCompanyDetails: !selectedAgent,
                    lockedByAdmin: false,
                  },
                }}
                onSubmit={async (input) => {
                  adminSaveListing(
                    {
                      ...input,
                      agentId: selectedAgent?.id ?? "dueno-admin",
                      agentName: selectedAgent
                        ? `${selectedAgent.firstName} ${selectedAgent.lastName}`
                        : DUENO_CONTACT.teamName,
                      agentEmail: selectedAgent?.email ?? DUENO_CONTACT.email,
                      agentAvatar: getAgentAvatarUrl(selectedAgent),
                      createdBy: "admin",
                    },
                    { publish: true },
                  );
                  setSuccess("Listing published to the public site.");
                  setTimeout(() => navigate("/admin/listings/all"), 1200);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card>
            <Card.Body>
              <Link to="/admin/listings/all" className="btn btn-light w-100 mb-2">
                All Listings
              </Link>
              <Link to="/admin/listings" className="btn btn-outline-primary w-100">
                Approval Queue
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminCreateListingPage;
