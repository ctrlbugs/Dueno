import { useEffect, useState } from "react";
import { Badge, Button, Card, Form, ListGroup } from "react-bootstrap";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import { useAuth } from "../../context/AuthContext";
import {
  getConversationsForAgent,
  markConversationRead,
  replyToConversation,
  subscribeMessages,
} from "../../services/messageStore";

const AgentMessagesPage = () => {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  const conversations = user ? getConversationsForAgent(user.id) : [];
  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  useEffect(() => {
    if (selected && user) {
      markConversationRead(selected.id, "agent");
    }
  }, [selected, user]);

  const handleReply = () => {
    if (!selected || !user || !reply.trim()) return;
    replyToConversation({
      conversationId: selected.id,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: "agent",
      body: reply.trim(),
    });
    setReply("");
  };

  return (
    <>
      <AgentPageBreadcrumb title="Messages" subName="Inbox" />

      <Card>
        <Card.Body>
          <RowLayout
            conversations={conversations}
            selected={selected}
            onSelect={setSelectedId}
            reply={reply}
            onReplyChange={setReply}
            onSend={handleReply}
          />
        </Card.Body>
      </Card>
    </>
  );
};

type RowLayoutProps = {
  conversations: ReturnType<typeof getConversationsForAgent>;
  selected?: ReturnType<typeof getConversationsForAgent>[number];
  onSelect: (id: string) => void;
  reply: string;
  onReplyChange: (value: string) => void;
  onSend: () => void;
};

const RowLayout = ({
  conversations,
  selected,
  onSelect,
  reply,
  onReplyChange,
  onSend,
}: RowLayoutProps) => (
  <div className="row g-3">
    <div className="col-lg-4">
      <ListGroup>
        {conversations.map((conversation) => (
          <ListGroup.Item
            key={conversation.id}
            action
            active={selected?.id === conversation.id}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="d-flex justify-content-between">
              <strong>{conversation.buyerName}</strong>
              {conversation.unreadForAgent && (
                <Badge bg="danger" pill>
                  New
                </Badge>
              )}
            </div>
            <small className="text-muted d-block">{conversation.propertyTitle}</small>
            <small className="text-muted">{conversation.subject}</small>
          </ListGroup.Item>
        ))}
        {conversations.length === 0 && (
          <div className="text-muted p-3">No messages yet.</div>
        )}
      </ListGroup>
    </div>
    <div className="col-lg-8">
      {selected ? (
        <>
          <h5>{selected.subject}</h5>
          <p className="text-muted small">
            Re: {selected.propertyTitle} · {selected.buyerEmail}
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
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              value={reply}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Type your reply..."
            />
          </Form.Group>
          <Button onClick={onSend}>Send Reply</Button>
        </>
      ) : (
        <div className="text-muted">Select a conversation.</div>
      )}
    </div>
  </div>
);

export default AgentMessagesPage;
