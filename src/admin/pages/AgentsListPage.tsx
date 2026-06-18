import { useEffect, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import { useAdminSearch } from "../context/AdminSearchContext";
import { filterAgents } from "../components/AdminSearchResults";
import AgentStatusBadge from "../components/AgentStatusBadge";
import AgentApplicationDetailView from "../../shared/components/AgentApplicationDetailView";
import { getAgents, subscribeAgents } from "../services/agentStore";
import type { AgentUser } from "../types";

const AgentsListPage = () => {
  const { query } = useAdminSearch();
  const [, refresh] = useState(0);
  const [selected, setSelected] = useState<AgentUser | null>(null);

  useEffect(() => {
    return subscribeAgents(() => refresh((n) => n + 1));
  }, []);

  const agents = filterAgents(getAgents(), query);

  return (
    <>
      <AdminPageBreadcrumb title="All Agents" subName="Agents" />

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="header-title mb-1">Registered Agents</h4>
              <p className="text-muted mb-0">
                {agents.length} agent{agents.length === 1 ? "" : "s"}
                {query.trim() ? " matching your search" : ""}.
              </p>
            </div>
            <Link to="/admin/agents/create" className="btn btn-primary">
              <i className="ri-user-add-line me-1" />
              Create Agent
            </Link>
          </div>

          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Agency</th>
                  <th>NIESV</th>
                  <th>Location</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-4">
                      No agents match your search.
                    </td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="fw-semibold">
                      {agent.firstName} {agent.lastName}
                    </td>
                    <td>{agent.email}</td>
                    <td>{agent.registration?.companyName ?? agent.agencyName}</td>
                    <td>{agent.licenseNumber || "—"}</td>
                    <td>
                      {agent.city}, {agent.state}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {agent.createdBy === "admin" ? "Admin" : "Self signup"}
                      </span>
                    </td>
                    <td>
                      <AgentStatusBadge status={agent.status} />
                    </td>
                    <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="soft-primary"
                        onClick={() => setSelected(agent)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {agents.length === 0 && !query.trim() && (
            <div className="text-center py-5 text-muted">
              No agents yet.{" "}
              <Link to="/admin/agents/create">Create the first agent</Link>.
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(selected)}
        onHide={() => setSelected(null)}
        size="xl"
        scrollable
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agent Profile & Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && <AgentApplicationDetailView agent={selected} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSelected(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgentsListPage;
