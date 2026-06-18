import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import "@dashboard-ui/assets/scss/app.scss";
import { useAuth } from "../../context/AuthContext";
import { all_routes } from "../../feature-module/routes/all_routes";
import { getAgentById } from "../../services/agentStore";
import { getPostLoginRedirect, saveSession } from "../../services/authService";

const AgentPendingPage = () => {
  const { user, logout, refresh } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "agent") return;
    const agent = getAgentById(user.id);
    if (agent && agent.status !== user.agentStatus) {
      saveSession({ ...user, agentStatus: agent.status });
      refresh();
    }
  }, [user, refresh]);

  if (!user || user.role !== "agent") {
    return <Navigate to={all_routes.signin} replace />;
  }

  if (user.agentStatus === "approved") {
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  const agent = getAgentById(user.id);
  const status = agent?.status ?? user.agentStatus;

  return (
    <div className="agent-pending-shell d-flex align-items-center py-5">
      <div className="container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5 text-center">
                <img
                  src="/assets/img/logo.svg"
                  alt="Dueno"
                  height={44}
                  className="mb-4"
                />
                <h3 className="mb-3">
                  {status === "rejected"
                    ? "Application Not Approved"
                    : "Application Under Review"}
                </h3>
                <p className="text-muted mb-4">
                  {status === "rejected"
                    ? "Your agent application was not approved. Contact Dueno support if you believe this is an error."
                    : "Thanks for signing up as a Dueno agent. Our team is reviewing your NIESV credentials. You will access the agent portal once approved."}
                </p>
                {agent && (
                  <Card className="bg-light border-0 text-start mb-4">
                    <Card.Body>
                      <p className="mb-1">
                        <strong>Name:</strong> {agent.firstName}{" "}
                        {agent.lastName}
                      </p>
                      <p className="mb-1">
                        <strong>Agency:</strong> {agent.agencyName}
                      </p>
                      <p className="mb-0">
                        <strong>NIESV:</strong> {agent.licenseNumber}
                      </p>
                    </Card.Body>
                  </Card>
                )}
                <div className="d-flex justify-content-center gap-2">
                  <Link to={all_routes.index3} className="btn btn-primary">
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => logout()}
                  >
                    Sign Out
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AgentPendingPage;
