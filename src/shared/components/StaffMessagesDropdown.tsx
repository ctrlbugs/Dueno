import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getConversationPreview,
  getRecentConversationsForAdmin,
  getRecentConversationsForAgent,
  getUnreadCountForAdmin,
  getUnreadCountForAgent,
  markAllConversationsReadForAdmin,
  markAllConversationsReadForAgent,
  markConversationRead,
  subscribeMessages,
} from "../../services/messageStore";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import {
  HEADER_DROPDOWN_OFFSET,
  useBootstrapDropdownAutoHide,
} from "../hooks/useBootstrapDropdownAutoHide";

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type StaffMessagesDropdownProps = {
  variant: "header" | "dashboard";
  mode: "agent" | "admin";
  userId: string;
  className?: string;
};

const StaffMessagesDropdown = ({
  variant,
  mode,
  userId,
  className = "",
}: StaffMessagesDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeMessages(() => setTick((n) => n + 1)), []);
  useBootstrapDropdownAutoHide(dropdownRef, [variant, mode, userId]);

  const conversations = useMemo(() => {
    if (mode === "agent") return getRecentConversationsForAgent(userId, 5);
    return getRecentConversationsForAdmin(5);
  }, [mode, tick, userId]);

  const unreadCount = useMemo(() => {
    if (mode === "agent") return getUnreadCountForAgent(userId);
    return getUnreadCountForAdmin();
  }, [mode, tick, userId]);

  const inboxPath = mode === "admin" ? "/admin/messages" : "/agent/messages";
  const readRole = mode === "admin" ? "admin" : "agent";
  const unreadKey = mode === "admin" ? "unreadForAdmin" : "unreadForAgent";

  const handleClearAll = (event: React.MouseEvent) => {
    event.preventDefault();
    if (mode === "agent") markAllConversationsReadForAgent(userId);
    else markAllConversationsReadForAdmin();
    setTick((n) => n + 1);
  };

  const toggleClass =
    variant === "header"
      ? "topbar-link btn btn-light"
      : "nav-link position-relative staff-messages-toggle";

  return (
    <div
      ref={dropdownRef}
      className={`dropdown staff-messages-dropdown staff-messages-dropdown--${variant} ${className}`.trim()}
    >
      <Link
        to="#"
        className={toggleClass}
        data-bs-toggle="dropdown"
        data-bs-offset={HEADER_DROPDOWN_OFFSET}
        data-bs-auto-close="outside"
        aria-label="Messages"
        aria-expanded="false"
        onClick={(event) => event.preventDefault()}
      >
        <i className="material-icons-outlined fs-22">mail_outline</i>
        {unreadCount > 0 ? (
          <span
            className={
              variant === "header" ? "badge-icon bg-orange" : "staff-messages-badge"
            }
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Link>
      <div className="dropdown-menu dropdown-menu-end dropdown-menu-lg header-messages-menu p-0">
        <div className="notification-head">
          <div className="row align-items-center">
            <div className="col">
              <h6 className="m-0">Messages</h6>
            </div>
            {unreadCount > 0 ? (
              <div className="col-auto">
                <Link to="#" className="text-body fs-13" onClick={handleClearAll}>
                  Clear All
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <div className="notification-body position-relative z-2 rounded-0">
          {conversations.length === 0 ? (
            <div className="dropdown-item text-wrap py-4 text-center text-muted">
              <i className="material-icons-outlined d-block mb-2 fs-32">
                mail_outline
              </i>
              <p className="mb-2">No messages yet</p>
              <Link to={inboxPath} className="btn btn-sm btn-primary">
                View inbox
              </Link>
            </div>
          ) : (
            conversations.map((conversation) => {
              const preview = getConversationPreview(conversation);
              const isUnread = conversation[unreadKey];
              return (
                <Link
                  key={conversation.id}
                  to={inboxPath}
                  className={`dropdown-item notification-item text-wrap border-bottom ${
                    isUnread ? "notification-item--unread" : ""
                  }`}
                  onClick={() => {
                    if (isUnread) {
                      markConversationRead(conversation.id, readRole);
                    }
                  }}
                >
                  <div className="d-flex">
                    <div className="avatar avatar-md avatar-rounded bg-teal text-white flex-shrink-0">
                      {initialsFromName(conversation.buyerName)}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <p className="mb-1 fw-medium text-dark">
                        {conversation.buyerName}
                        <small className="text-muted fw-normal float-end">
                          {formatTimeAgo(conversation.updatedAt)}
                        </small>
                      </p>
                      <p className="mb-1 text-muted fs-13 text-truncate">{preview}</p>
                      <p className="mb-0 text-muted fs-12 text-truncate">
                        {conversation.propertyTitle}
                      </p>
                      {isUnread ? (
                        <span className="badge bg-danger mt-1">New</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <div className="notification-footer text-center">
          <Link to={inboxPath} className="text-center mb-0">
            View All Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffMessagesDropdown;
