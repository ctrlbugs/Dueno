import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { all_routes } from "../../../feature-module/routes/all_routes";
import {
  getRecentConversationsForBuyer,
  getUnreadCountForBuyer,
  markAllConversationsReadForBuyer,
  markConversationRead,
  subscribeMessages,
} from "../../../services/messageStore";

const formatTimeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type HeaderNotificationsDropdownProps = {
  className?: string;
};

const HeaderNotificationsDropdown = ({
  className = "",
}: HeaderNotificationsDropdownProps) => {
  const { user } = useAuth();
  const buyerId = user?.id ?? null;
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeMessages(() => setTick((n) => n + 1)), []);

  const conversations = useMemo(
    () => (buyerId ? getRecentConversationsForBuyer(buyerId, 5) : []),
    [buyerId, tick],
  );

  const unreadCount = buyerId ? getUnreadCountForBuyer(buyerId) : 0;

  const handleMarkAllRead = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!buyerId) return;
    markAllConversationsReadForBuyer(buyerId);
    setTick((n) => n + 1);
  };

  return (
    <div className={`dropdown ${className}`.trim()}>
      <Link
        to="#"
        className="topbar-link btn btn-light"
        data-bs-toggle="dropdown"
        aria-label="Notifications"
      >
        <i className="material-icons-outlined animate-ring">notifications_none</i>
        {unreadCount > 0 ? (
          <span className="badge-icon bg-orange">{unreadCount}</span>
        ) : null}
      </Link>
      <div
        className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg header-notifications-menu"
        style={{ minHeight: 280 }}
      >
        <div className="notification-head">
          <div className="row align-items-center">
            <div className="col">
              <h6 className="m-0">Notifications</h6>
            </div>
            {buyerId && unreadCount > 0 ? (
              <div className="col-auto">
                <Link to="#" className="text-body fs-13" onClick={handleMarkAllRead}>
                  Mark all read
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        <div className="notification-body position-relative z-2 rounded-0">
          {!buyerId ? (
            <div className="dropdown-item text-wrap py-4 text-center text-muted">
              <p className="mb-2">Sign in to see enquiry updates</p>
              <Link to={all_routes.signin} className="btn btn-sm btn-dark">
                Sign In
              </Link>
            </div>
          ) : conversations.length === 0 ? (
            <div className="dropdown-item text-wrap py-4 text-center text-muted">
              <i className="material-icons-outlined d-block mb-2 fs-32">
                notifications_none
              </i>
              No notifications yet
            </div>
          ) : (
            conversations.map((conversation) => {
              const latest =
                conversation.messages[conversation.messages.length - 1];
              return (
                <div
                  key={conversation.id}
                  className={`dropdown-item notification-item text-wrap border-bottom ${
                    conversation.unreadForBuyer ? "notification-item--unread" : ""
                  }`}
                >
                  <div className="d-flex">
                    <div className="avatar avatar-md avatar-rounded bg-teal text-white flex-shrink-0">
                      {initialsFromName(conversation.agentName)}
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1">
                        <span className="fw-medium text-dark">
                          {conversation.agentName}
                        </span>{" "}
                        {conversation.unreadForBuyer ? "replied to" : "on"}{" "}
                        <span className="fw-medium text-dark">
                          {conversation.propertyTitle}
                        </span>
                      </p>
                      <p className="mb-1 text-muted fs-13 text-truncate">
                        {latest?.body ?? conversation.subject}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-13 d-flex align-items-center">
                          <i className="material-icons-outlined text-body fs-13 me-1">
                            schedule
                          </i>
                          {formatTimeAgo(conversation.updatedAt)}
                        </span>
                        {conversation.unreadForBuyer ? (
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 fs-13"
                            onClick={() => {
                              markConversationRead(conversation.id, "buyer");
                              setTick((n) => n + 1);
                            }}
                          >
                            Mark read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="notification-footer text-center">
          <Link to={all_routes.notification} className="text-center mb-0">
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderNotificationsDropdown;
