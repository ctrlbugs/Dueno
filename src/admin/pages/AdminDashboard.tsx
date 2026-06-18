import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import AdminSearchResults from "../components/AdminSearchResults";
import { useAdminSearch } from "../context/AdminSearchContext";
import { matchesSearchQuery } from "../../utils/searchFilter";
import AgentStatusBadge from "../components/AgentStatusBadge";
import StatCard from "../components/StatCard";
import {
  getAllLiveProperties,
  getRentProperties,
  getSaleProperties,
} from "../../data/estateProperties";
import { getAgents, getAgentsByStatus, subscribeAgents } from "../services/agentStore";
import {
  getPendingListingsByStatus,
  subscribeListings,
} from "../services/listingQueueStore";

const AdminDashboard = () => {
  const { query } = useAdminSearch();
  const [, refresh] = useState(0);

  useEffect(() => {
    const unsubAgents = subscribeAgents(() => refresh((n) => n + 1));
    const unsubListings = subscribeListings(() => refresh((n) => n + 1));
    return () => {
      unsubAgents();
      unsubListings();
    };
  }, []);

  const agents = getAgents();
  const pendingAgents = getAgentsByStatus("pending_review");
  const approvedAgents = getAgentsByStatus("approved");
  const pendingListings = getPendingListingsByStatus("pending_review");

  const recentAgents = [...agents]
    .filter((agent) =>
      matchesSearchQuery(
        query,
        agent.firstName,
        agent.lastName,
        agent.email,
        agent.agencyName,
        agent.registration?.companyName,
        agent.city,
        agent.state,
      ),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <AdminPageBreadcrumb title="Dashboard" subName="Admin" />

      <AdminSearchResults />

      <Row>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Live Listings"
            value={getAllLiveProperties().length}
            change={`${getSaleProperties().length} sale · ${getRentProperties().length} rent`}
            icon="ri-building-2-line"
            variant="text-bg-primary"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Pending Applications"
            value={pendingAgents.length}
            change={`${approvedAgents.length} approved`}
            icon="ri-file-list-3-line"
            variant="text-bg-warning"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Active Agents"
            value={approvedAgents.length}
            change={`${agents.length} total`}
            icon="ri-team-line"
            variant="text-bg-info"
          />
        </Col>
        <Col xxl={3} sm={6}>
          <StatCard
            title="Listings Queue"
            value={pendingListings.length}
            change="Awaiting review"
            icon="ri-home-gear-line"
            variant="text-bg-purple"
          />
        </Col>
      </Row>

      <Row>
        <Col xl={7}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="header-title mb-0">Recent Agent Activity</h4>
                <Link to="/admin/agents" className="btn btn-sm btn-soft-primary">
                  View all
                </Link>
              </div>
              <div className="table-responsive">
                <Table hover className="table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Agent</th>
                      <th>Agency</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td>
                          <div className="fw-semibold">
                            {agent.firstName} {agent.lastName}
                          </div>
                          <small className="text-muted">{agent.email}</small>
                        </td>
                        <td>{agent.agencyName}</td>
                        <td>
                          {agent.city}, {agent.state}
                        </td>
                        <td>
                          <AgentStatusBadge status={agent.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={5}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">Quick Actions</h4>
              <div className="d-grid gap-2">
                <Link
                  to="/admin/agents/create"
                  className="btn btn-primary"
                >
                  <i className="ri-user-add-line me-1" />
                  Create Agent Account
                </Link>
                <Link
                  to="/admin/applications"
                  className="btn btn-soft-warning"
                >
                  <i className="ri-file-list-3-line me-1" />
                  Review Applications ({pendingAgents.length})
                </Link>
                <Link to="/admin/listings" className="btn btn-soft-info">
                  <i className="ri-building-2-line me-1" />
                  Review Listings ({pendingListings.length})
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
