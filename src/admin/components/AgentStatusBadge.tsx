import { Badge } from "react-bootstrap";
import type { AgentStatus } from "../types";

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; variant: string }
> = {
  pending_review: { label: "Pending Review", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  suspended: { label: "Suspended", variant: "secondary" },
};

const AgentStatusBadge = ({ status }: { status: AgentStatus }) => {
  const config = STATUS_CONFIG[status];
  return <Badge bg={config.variant}>{config.label}</Badge>;
};

export default AgentStatusBadge;
