import { useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import { useAuth } from "../../context/AuthContext";
import { submitAgentListing } from "../../services/listingQueueStore";
import { getAgentById, getAgentAvatarUrl } from "../../services/agentStore";
import ListingForm from "../../shared/components/ListingForm";

const AgentNewListingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const agent = user ? getAgentById(user.id) : undefined;

  if (!user) return null;

  return (
    <>
      <AgentPageBreadcrumb title="Add Listing" subName="Properties" />

      <Row>
        <Col xl={8}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-1">Submit a Property</h4>
              <p className="text-muted mb-4">
                Complete each section below. Your listing appears on the public
                site after Dueno admin approval.
              </p>

              {success && <Alert variant="success">{success}</Alert>}

              <ListingForm
                initial={{
                  agentId: user.id,
                  agentName: `${user.firstName} ${user.lastName}`,
                  agentEmail: user.email,
                  agentAvatar: getAgentAvatarUrl(agent),
                  createdBy: "agent",
                  ownerContact: {
                    phone: agent?.phone ?? "",
                    email: user.email,
                    location: `${agent?.city ?? ""}, ${agent?.state ?? ""}`.replace(
                      /^,\s*|,\s*$/g,
                      "",
                    ),
                  },
                }}
                onSubmit={async (input) => {
                  submitAgentListing(input);
                  setSuccess("Listing submitted for admin review.");
                  setTimeout(() => navigate("/agent/listings"), 1200);
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h4 className="text-white">Listing tips</h4>
              <p className="mb-0 opacity-75">
                Match the public property page: strong cover photo, accurate
                rent/sale type, tick all features that apply, and add a map
                address for location.
              </p>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <Link to="/agent/listings" className="btn btn-light w-100">
                Back to My Listings
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AgentNewListingPage;
