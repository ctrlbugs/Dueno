import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import StatCard from "../../admin/components/StatCard";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import { useAgentSearch } from "../context/AgentSearchContext";
import { matchesSearchQuery } from "../../utils/searchFilter";
import { useAuth } from "../../context/AuthContext";
import { getAgentById } from "../../services/agentStore";
import {
  getListingsByAgentId,
  subscribeListings,
} from "../../services/listingQueueStore";

const AgentDashboard = () => {
  const { user } = useAuth();
  const { query } = useAgentSearch();
  const [, refresh] = useState(0);

  useEffect(() => subscribeListings(() => refresh((n) => n + 1)), []);

  const agent = user ? getAgentById(user.id) : undefined;
  const listings = user ? getListingsByAgentId(user.id) : [];
  const pending = listings.filter((l) => l.status === "pending_review").length;
  const approved = listings.filter((l) => l.status === "approved").length;
  const rejected = listings.filter((l) => l.status === "rejected").length;

  const recentListings = [...listings]
    .filter((listing) =>
      matchesSearchQuery(
        query,
        listing.title,
        listing.city,
        listing.state,
        listing.address,
        listing.price,
        listing.listingType,
      ),
    )
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <AgentPageBreadcrumb title="Dashboard" subName="Agent" />

      <Card className="agent-welcome-card border-0 mb-4">
        <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h4 className="mb-1">
              Welcome back, {user?.firstName ?? "Agent"}
            </h4>
            <p className="text-muted mb-0">
              {agent?.agencyName ?? "Dueno Partner"} · {agent?.city},{" "}
              {agent?.state}
            </p>
          </div>
          <Link to="/agent/listings/new" className="btn btn-primary">
            <i className="ri-add-circle-line me-1" />
            Add New Listing
          </Link>
        </Card.Body>
      </Card>

      <Row>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Total Listings"
            value={listings.length}
            change={`${approved} live`}
            icon="ri-building-4-line"
            variant="text-bg-primary"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Pending Review"
            value={pending}
            change="Awaiting admin"
            icon="ri-time-line"
            variant="text-bg-warning"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Published"
            value={approved}
            change="On Dueno"
            icon="ri-checkbox-circle-line"
            variant="text-bg-success"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Rejected"
            value={rejected}
            change="Needs revision"
            icon="ri-close-circle-line"
            variant="text-bg-purple"
          />
        </Col>
      </Row>

      <Row className="mt-1">
        <Col xl={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="header-title mb-0">Recent Listings</h4>
                <Link to="/agent/listings" className="btn btn-sm btn-soft-primary">
                  View all
                </Link>
              </div>
              <div className="table-responsive">
                <Table hover className="table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentListings.map((listing) => (
                      <tr key={listing.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {listing.images[0] && (
                              <img
                                src={listing.images[0].dataUrl}
                                alt=""
                                className="rounded"
                                style={{
                                  width: 40,
                                  height: 32,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <span className="fw-semibold">{listing.title}</span>
                          </div>
                        </td>
                        <td className="text-capitalize">{listing.listingType}</td>
                        <td>{listing.price}</td>
                        <td>
                          <span className="badge bg-light text-dark text-capitalize">
                            {listing.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {recentListings.length === 0 && (
                <div className="text-center py-4 text-muted">
                  No listings yet.{" "}
                  <Link to="/agent/listings/new">Add your first property</Link>.
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h4 className="text-white mb-2">Partner perks</h4>
              <p className="mb-3 opacity-75">
                List premium properties, track approvals, and grow your reach on
                Nigeria&apos;s curated real estate marketplace.
              </p>
              <ul className="list-unstyled mb-0 opacity-90">
                <li className="mb-2">
                  <i className="ri-check-line me-1" /> Admin-reviewed listings
                </li>
                <li className="mb-2">
                  <i className="ri-check-line me-1" /> Photo-rich property pages
                </li>
                <li>
                  <i className="ri-check-line me-1" /> Lagos, Abuja & PH coverage
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AgentDashboard;
