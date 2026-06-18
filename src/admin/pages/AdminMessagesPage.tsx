import { useEffect, useState } from "react";
import { Badge, Button, Card, Form, ListGroup } from "react-bootstrap";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import {
  getConversationsForAdmin,
  markConversationRead,
  replyToConversation,
  subscribeMessages,
} from "../../services/messageStore";

const AdminMessagesPage = () => {
  const [, refresh] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  const conversations = getConversationsForAdmin();
  const selected =
    conversations.find((c) => c.id === selectedId) ?? conversations[0];

  useEffect(() => {
    if (selected) {
      markConversationRead(selected.id, "admin");
    }
  }, [selected]);

  const handleReply = () => {
    if (!selected || !reply.trim()) return;
    replyToConversation({
      conversationId: selected.id,
      senderId: "admin-1",
      senderName: "Dueno Admin",
      senderRole: "admin",
      body: reply.trim(),
    });
    setReply("");
  };

  return (
    <>
      <AdminPageBreadcrumb title="Messages" subName="Inbox" />

      <Card>
        <Card.Body>
          <div className="row g-3">
            <div className="col-lg-4">
              <ListGroup>
                {conversations.map((conversation) => (
                  <ListGroup.Item
                    key={conversation.id}
                    action
                    active={selected?.id === conversation.id}
                    onClick={() => setSelectedId(conversation.id)}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{conversation.buyerName}</strong>
                      {conversation.unreadForAdmin && (
                        <Badge bg="danger" pill>
                          New
                        </Badge>
                      )}
                    </div>
                    <small className="text-muted d-block">
                      Agent: {conversation.agentName}
                    </small>
                    <small className="text-muted">{conversation.propertyTitle}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="col-lg-8">
              {selected ? (
                <>
                  <h5>{selected.subject}</h5>
                  <p className="text-muted small">
                    Buyer: {selected.buyerEmail} · Agent: {selected.agentName}
                  </p>
                  <div
                    className="border rounded p-3 mb-3"
                    style={{ maxHeight: 360, overflowY: "auto" }}
                  >
                    {selected.messages.map((message) => (
                      <div key={message.id} className="mb-3">
                        <strong>{message.senderName}</strong>
                        <span className="text-muted small ms-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <p className="mb-0 mt-1">{message.body}</p>
                      </div>
                    ))}
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="mb-2"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button onClick={handleReply}>Reply as Admin</Button>
                </>
              ) : (
                <div className="text-muted">No conversations yet.</div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminMessagesPage;
