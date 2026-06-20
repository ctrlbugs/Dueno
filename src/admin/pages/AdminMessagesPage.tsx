import { Card } from "react-bootstrap";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import DuenoChatInbox from "../../shared/components/messaging/DuenoChatInbox";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminMessagesPage = () => {
  const { user } = useAdminAuth();

  return (
    <>
      <AdminPageBreadcrumb title="Messages" subName="Inbox" />

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <DuenoChatInbox
            mode="admin"
            viewerId={user?.id ?? "admin-1"}
            viewerName={
              user ? `${user.firstName} ${user.lastName}`.trim() : "Dueno Admin"
            }
            readRole="admin"
            unreadKey="unreadForAdmin"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminMessagesPage;
