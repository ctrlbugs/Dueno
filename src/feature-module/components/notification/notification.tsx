import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../routes/all_routes";
import { useAuth } from "../../../context/AuthContext";
import {
  getConversationsForBuyer,
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

const Notification = () => {
  const { user } = useAuth();
  const buyerId = user?.id ?? null;
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeMessages(() => setTick((n) => n + 1)), []);

  const conversations = useMemo(
    () =>
      buyerId
        ? getConversationsForBuyer(buyerId).sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
        : [],
    [buyerId, tick],
  );

  const unreadCount = conversations.filter((c) => c.unreadForBuyer).length;

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title="Notifications"
        paths={[{ label: "Notifications", active: true }]}
      />
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="notification-header">
                <div className="notication-title">
                  <h2 className="mb-0">Notifications</h2>
                  <p className="mb-0">
                    Updates on your property enquiries and agent replies.
                  </p>
                </div>
                {buyerId && unreadCount > 0 ? (
                  <ul>
                    <li className="mb-0">
                      <button
                        type="button"
                        className="btn mark-all-btn"
                        onClick={() => {
                          markAllConversationsReadForBuyer(buyerId);
                          setTick((n) => n + 1);
                        }}
                      >
                        <span className="material-icons-outlined">
                          check_box
                        </span>
                        Mark All as Read
                      </button>
                    </li>
                  </ul>
                ) : null}
              </div>

              {!buyerId ? (
                <div className="text-center py-5">
                  <i className="material-icons-outlined fs-48 text-muted mb-3 d-block">
                    notifications_none
                  </i>
                  <h5 className="mb-2">Sign in to view notifications</h5>
                  <p className="text-muted mb-4">
                    Enquiry replies from agents appear here when you are signed in.
                  </p>
                  <Link to={all_routes.signin} className="btn btn-dark">
                    Sign In
                  </Link>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-5">
                  <i className="material-icons-outlined fs-48 text-muted mb-3 d-block">
                    mail_outline
                  </i>
                  <h5 className="mb-2">No notifications yet</h5>
                  <p className="text-muted mb-4">
                    Send an enquiry from a property page to start a conversation.
                  </p>
                  <Link to={all_routes.buyProperty} className="btn btn-dark">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="notication-list">
                  {conversations.map((conversation) => {
                    const latest =
                      conversation.messages[conversation.messages.length - 1];
                    return (
                      <div
                        key={conversation.id}
                        className={`notication-item mb-3 ${
                          conversation.unreadForBuyer ? "border-start border-primary border-3 ps-3" : ""
                        }`}
                      >
                        <div className="row align-items-center">
                          <div className="col-lg-9">
                            <div className="notication-content">
                              <span className="avatar avatar-md avatar-rounded bg-teal text-white d-inline-flex align-items-center justify-content-center">
                                {initialsFromName(conversation.agentName)}
                              </span>
                              <div className="notication-info">
                                <div>
                                  <p className="me-0 mb-1">
                                    <span className="text-dark fw-semibold me-1">
                                      {conversation.agentName}
                                    </span>
                                    {conversation.unreadForBuyer
                                      ? "replied about"
                                      : "on"}{" "}
                                    <span className="text-dark fw-semibold">
                                      {conversation.propertyTitle}
                                    </span>
                                  </p>
                                  <p className="mb-1 text-muted">
                                    {latest?.body ?? conversation.subject}
                                  </p>
                                  <p className="notify-time mb-0">
                                    {formatTimeAgo(conversation.updatedAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="d-lg-flex align-items-center justify-content-end gap-2">
                              {conversation.unreadForBuyer ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-dark"
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
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
