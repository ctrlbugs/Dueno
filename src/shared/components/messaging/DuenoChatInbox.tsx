import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import {
  archiveConversation,
  deleteConversation,
  getConversationPreview,
  getConversationsForAdmin,
  getConversationsForAgent,
  markConversationRead,
  reassignConversation,
  replyToConversation,
  subscribeMessages,
  type MessageAttachment,
  type MessageParticipantRole,
} from "../../../services/messageStore";
import { getAgentsByStatus } from "../../../services/agentStore";
import { formatChatTime } from "../../utils/formatTimeAgo";
import DuenoChatComposer from "./DuenoChatComposer";

type DuenoChatInboxProps = {
  mode: "agent" | "admin";
  viewerId: string;
  viewerName: string;
  readRole: MessageParticipantRole;
  unreadKey: "unreadForAgent" | "unreadForAdmin";
  emptyLabel?: string;
};

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DuenoChatInbox = ({
  mode,
  viewerId,
  viewerName,
  readRole,
  unreadKey,
  emptyLabel = "No messages yet.",
}: DuenoChatInboxProps) => {
  const [, refresh] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  const conversations =
    mode === "agent"
      ? getConversationsForAgent(viewerId)
      : getConversationsForAdmin(showArchived);
  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [conversations],
  );

  const selected =
    sortedConversations.find((conversation) => conversation.id === selectedId) ??
    sortedConversations[0];

  useEffect(() => {
    if (selected) {
      markConversationRead(selected.id, readRole);
    }
  }, [selected, readRole]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [selected?.id, selected?.messages.length]);

  const handleSend = (attachments?: MessageAttachment[]) => {
    if (!selected) return;
    if (!reply.trim() && !attachments?.length) return;

    replyToConversation({
      conversationId: selected.id,
      senderId: viewerId,
      senderName: viewerName,
      senderRole: readRole,
      body: reply,
      attachments,
    });
    setReply("");
  };

  const handleArchive = () => {
    if (!selected) return;
    archiveConversation(selected.id, !selected.archived);
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!window.confirm("Delete this conversation permanently?")) return;
    deleteConversation(selected.id);
    setSelectedId(null);
  };

  const handleReassign = (agentId: string) => {
    if (!selected || !agentId) return;
    const agent = getAgentsByStatus("approved").find((item) => item.id === agentId);
    if (!agent) return;
    reassignConversation(
      selected.id,
      agent.id,
      `${agent.firstName} ${agent.lastName}`.trim(),
    );
  };

  const agents = mode === "admin" ? getAgentsByStatus("approved") : [];

  return (
    <div className="dueno-chat-inbox row g-0">
      <div className="col-lg-4 dueno-chat-inbox__sidebar">
        <div className="dueno-chat-inbox__sidebar-head">
          <h6 className="mb-0">Messages</h6>
          {mode === "admin" ? (
            <Form.Check
              type="switch"
              id="show-archived-conversations"
              label="Archived"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
          ) : null}
        </div>
        <div className="dueno-chat-inbox__list">
          {sortedConversations.length === 0 ? (
            <div className="dueno-chat-inbox__empty">{emptyLabel}</div>
          ) : (
            sortedConversations.map((conversation) => {
              const preview = getConversationPreview(conversation);
              const isUnread = conversation[unreadKey];
              return (
                <button
                  key={conversation.id}
                  type="button"
                  className={`dueno-chat-inbox__item ${
                    selected?.id === conversation.id
                      ? "dueno-chat-inbox__item--active"
                      : ""
                  } ${isUnread ? "dueno-chat-inbox__item--unread" : ""}`}
                  onClick={() => setSelectedId(conversation.id)}
                >
                  <span className="dueno-chat-inbox__avatar">
                    {initialsFromName(conversation.buyerName)}
                  </span>
                  <span className="dueno-chat-inbox__item-body">
                    <span className="dueno-chat-inbox__item-top">
                      <strong>{conversation.buyerName}</strong>
                      <small>{formatChatTime(conversation.updatedAt)}</small>
                    </span>
                    <span className="dueno-chat-inbox__item-subject">
                      {conversation.subject}
                    </span>
                    <span className="dueno-chat-inbox__item-preview">{preview}</span>
                    {mode === "admin" ? (
                      <span className="dueno-chat-inbox__item-meta">
                        Agent: {conversation.agentName}
                      </span>
                    ) : (
                      <span className="dueno-chat-inbox__item-meta">
                        {conversation.propertyTitle}
                      </span>
                    )}
                  </span>
                  {isUnread ? (
                    <Badge bg="danger" pill className="dueno-chat-inbox__badge">
                      New
                    </Badge>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="col-lg-8 dueno-chat-inbox__panel">
        {selected ? (
          <>
            <div className="dueno-chat-inbox__panel-head">
              <div>
                <h5 className="mb-1">{selected.buyerName}</h5>
                <p className="mb-0 text-muted small">
                  {selected.subject} · {selected.propertyTitle}
                </p>
                <p className="mb-0 text-muted small">{selected.buyerEmail}</p>
              </div>
              {mode === "admin" ? (
                <div className="dueno-chat-inbox__admin-controls">
                  <Form.Select
                    size="sm"
                    aria-label="Reassign agent"
                    defaultValue=""
                    onChange={(event) => {
                      if (event.target.value) handleReassign(event.target.value);
                      event.target.value = "";
                    }}
                  >
                    <option value="">Reassign agent…</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.firstName} {agent.lastName}
                      </option>
                    ))}
                  </Form.Select>
                  <Button size="sm" variant="outline-secondary" onClick={handleArchive}>
                    {selected.archived ? "Restore" : "Archive"}
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="dueno-chat-inbox__thread" ref={threadRef}>
              <ul className="dueno-chat-thread">
                {selected.messages.map((message) => {
                  const isOwn =
                    message.senderRole === readRole ||
                    (readRole === "admin" && message.senderRole === "admin");
                  return (
                    <li
                      key={message.id}
                      className={`dueno-chat-thread__item ${
                        isOwn ? "dueno-chat-thread__item--own" : ""
                      }`}
                    >
                      <div className="dueno-chat-thread__meta">
                        <span className="dueno-chat-thread__avatar">
                          {initialsFromName(message.senderName)}
                        </span>
                        <small>{formatChatTime(message.createdAt)}</small>
                      </div>
                      <div className="dueno-chat-thread__bubble">
                        <strong>{message.senderName}</strong>
                        {message.body ? <p>{message.body}</p> : null}
                        {message.attachments?.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="dueno-chat-thread__attachment"
                          >
                            {attachment.type === "image" ? (
                              <a
                                href={attachment.dataUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img src={attachment.dataUrl} alt={attachment.name} />
                              </a>
                            ) : attachment.type === "voice" ? (
                              <audio controls preload="metadata">
                                <source
                                  src={attachment.dataUrl}
                                  type={attachment.mimeType}
                                />
                              </audio>
                            ) : (
                              <a
                                href={attachment.dataUrl}
                                download={attachment.name}
                                className="dueno-chat-thread__file-link"
                              >
                                <i className="material-icons-outlined">description</i>
                                {attachment.name}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <DuenoChatComposer
              value={reply}
              onChange={setReply}
              onSend={handleSend}
              placeholder="Enter your message"
            />
          </>
        ) : (
          <div className="dueno-chat-inbox__placeholder">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default DuenoChatInbox;
