import { Card } from "react-bootstrap";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import DuenoChatInbox from "../../shared/components/messaging/DuenoChatInbox";
import { useAuth } from "../../context/AuthContext";

const AgentMessagesPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <AgentPageBreadcrumb title="Messages" subName="Inbox" />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <DuenoChatInbox
            mode="agent"
            viewerId={user.id}
            viewerName={`${user.firstName} ${user.lastName}`.trim()}
            readRole="agent"
            unreadKey="unreadForAgent"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default AgentMessagesPage;
