import { useEffect, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import { useAdminSearch } from "../context/AdminSearchContext";
import { filterAgents } from "../components/AdminSearchResults";
import AgentStatusBadge from "../components/AgentStatusBadge";
import AgentApplicationDetailView from "../../shared/components/AgentApplicationDetailView";
import {
  getAgentsByStatus,
  subscribeAgents,
  updateAgentStatus,
} from "../services/agentStore";
import type { AgentUser } from "../types";

const AgentApplicationsPage = () => {
  const { query } = useAdminSearch();
  const [, refresh] = useState(0);
  const [selected, setSelected] = useState<AgentUser | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    return subscribeAgents(() => refresh((n) => n + 1));
  }, []);

  const pendingAgents = filterAgents(
    getAgentsByStatus("pending_review"),
    query,
  );

  const handleDecision = (status: "approved" | "rejected") => {
    if (!selected) return;
    updateAgentStatus(selected.id, status, notes || undefined);
    setSelected(null);
    setNotes("");
  };

  return (
    <>
      <AdminPageBreadcrumb title="Applications" subName="Agents" />

      <Card>
        <Card.Body>
          <h4 className="header-title mb-1">Agent Signup Queue</h4>
          <p className="text-muted mb-4">
            Review complete agent and agency registration submissions — personal
            details, KYC documents, business info, bank details, and legal
            agreements — before approving access to list properties.
          </p>

          <div className="table-responsive">
            <Table hover className="table-centered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Agent</th>
                  <th>Type</th>
                  <th>Agency / Company</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingAgents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      {query.trim()
                        ? "No applications match your search."
                        : "No pending applications. All caught up."}
                    </td>
                  </tr>
                ) : (
                  pendingAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {agent.registration?.profilePhotoDataUrl ? (
                          <img
                            src={agent.registration.profilePhotoDataUrl}
                            alt=""
                            className="rounded-circle"
                            style={{ width: 36, height: 36, objectFit: "cover" }}
                          />
                        ) : (
                          <span className="avatar-xs bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center fw-semibold">
                            {agent.firstName[0]}
                            {agent.lastName[0]}
                          </span>
                        )}
                        <div>
                          <div className="fw-semibold">
                            {agent.firstName} {agent.lastName}
                          </div>
                          <small className="text-muted">{agent.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {agent.registration?.agentType === "company"
                        ? "Company"
                        : agent.registration
                          ? "Individual"
                          : "Legacy"}
                    </td>
                    <td>{agent.registration?.companyName ?? agent.agencyName}</td>
                    <td>
                      {agent.registration
                        ? `${agent.registration.yearsOfExperience} yrs`
                        : "—"}
                    </td>
                    <td>
                      {agent.city}, {agent.state}
                    </td>
                    <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                    <td>
                      <AgentStatusBadge status={agent.status} />
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="soft-primary"
                        onClick={() => {
                          setSelected(agent);
                          setNotes("");
                        }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
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
          <Modal.Title>Agent Registration Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && <AgentApplicationDetailView agent={selected} />}
          <div className="mt-4 pt-3 border-top">
            <label className="form-label" htmlFor="review-notes">
              Admin notes (optional)
            </label>
            <textarea
              id="review-notes"
              className="form-control"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for approval or rejection..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSelected(null)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDecision("rejected")}>
            Reject
          </Button>
          <Button variant="success" onClick={() => handleDecision("approved")}>
            Approve Agent
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgentApplicationsPage;
