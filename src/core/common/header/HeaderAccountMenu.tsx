import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AgentAvatar from "../../../shared/components/AgentAvatar";
import type { AgentUser, PublicSession } from "../../../types/user";
import { all_routes } from "../../../feature-module/routes/all_routes";
import {
  getUnreadCountForAgent,
  getUnreadCountForAdmin,
  subscribeMessages,
} from "../../../services/messageStore";
import {
  HEADER_DROPDOWN_OFFSET,
  useBootstrapDropdownAutoHide,
} from "../../../shared/hooks/useBootstrapDropdownAutoHide";

type Props = {
  user: PublicSession;
  agent?: AgentUser;
  onLogout: () => void;
};

const initialsFromName = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";

const getRoleLabel = (user: PublicSession) => {
  if (user.role === "admin") return "Administrator";
  if (user.role === "agent") {
    if (user.agentStatus === "approved") return "Property Agent";
    if (user.agentStatus === "pending_review") return "Pending Approval";
    return "Agent";
  }
  return "Buyer";
};

const HeaderAccountMenu = ({ user, agent, onLogout }: Props) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, refresh] = useState(0);
  const displayName = `${user.firstName} ${user.lastName}`.trim();
  const roleLabel = getRoleLabel(user);

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  useBootstrapDropdownAutoHide(dropdownRef, [user.id, user.role, user.agentStatus]);

  const agentUnreadCount =
    user.role === "agent" && user.agentStatus === "approved"
      ? getUnreadCountForAgent(user.id)
      : 0;
  const adminUnreadCount = user.role === "admin" ? getUnreadCountForAdmin() : 0;

  const handleSignOut = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onLogout();
    navigate(all_routes.signin);
  };

  const renderAvatar = () =>
    user.role === "agent" && agent ? (
      <AgentAvatar agent={agent} variant="header" />
    ) : (
      <span className="header-user-avatar-fallback" aria-hidden="true">
        {initialsFromName(user.firstName, user.lastName)}
      </span>
    );

  return (
    <div ref={dropdownRef} className="dropdown topbar-profile d-flex">
      <Link
        to="#"
        className="avatar avatar-rounded"
        data-bs-toggle="dropdown"
        data-bs-offset={HEADER_DROPDOWN_OFFSET}
        aria-label="Account menu"
        onClick={(event) => event.preventDefault()}
      >
        {renderAvatar()}
      </Link>
      <div className="dropdown-menu dropdown-menu-end">
        <div className="d-flex align-items-center user-profile px-2 py-1">
          <div className="user-profile-avatar flex-shrink-0">{renderAvatar()}</div>
          <div className="ms-2 min-w-0">
            <h6 className="mb-1">{displayName}</h6>
            <span className="d-block text-muted fs-13">{roleLabel}</span>
            {user.role === "agent" && agent?.agencyName ? (
              <span className="d-block text-muted fs-12">{agent.agencyName}</span>
            ) : null}
          </div>
        </div>

        {user.role === "admin" ? (
          <Link to="/admin" className="dropdown-item d-inline-flex align-items-center">
            <i className="material-icons-outlined me-2">dashboard</i>
            Admin Dashboard
          </Link>
        ) : null}

        {user.role === "admin" ? (
          <Link
            to="/admin/messages"
            className="dropdown-item d-inline-flex align-items-center"
          >
            <i className="material-icons-outlined me-2">mail_outline</i>
            Messages
            {adminUnreadCount > 0 ? (
              <span className="badge bg-danger ms-auto">{adminUnreadCount}</span>
            ) : null}
          </Link>
        ) : null}

        {user.role === "agent" ? (
          <>
            <Link
              to={
                user.agentStatus === "approved"
                  ? "/agent/dashboard"
                  : "/agent/pending-review"
              }
              className="dropdown-item d-inline-flex align-items-center"
            >
              <i className="material-icons-outlined me-2">dashboard</i>
              Dashboard
            </Link>
            {user.agentStatus === "approved" ? (
              <>
                <Link
                  to="/agent/listings"
                  className="dropdown-item d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-2">apartment</i>
                  My Listings
                </Link>
                <Link
                  to="/agent/listings/new"
                  className="dropdown-item d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-2">add_home</i>
                  Post Property
                </Link>
                <Link
                  to="/agent/messages"
                  className="dropdown-item d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-2">mail_outline</i>
                  Messages
                  {agentUnreadCount > 0 ? (
                    <span className="badge bg-danger ms-auto">{agentUnreadCount}</span>
                  ) : null}
                </Link>
              </>
            ) : null}
          </>
        ) : null}

        {user.role === "buyer" ? (
          <Link
            to={all_routes.cart}
            className="dropdown-item d-inline-flex align-items-center"
          >
            <i className="material-icons-outlined me-2">favorite</i>
            Saved Properties
          </Link>
        ) : null}

        {user.role === "agent" &&
        agent &&
        user.agentStatus === "approved" ? (
          <Link
            to={`/dueno-agent/${encodeURIComponent(agent.id)}`}
            className="dropdown-item d-inline-flex align-items-center"
          >
            <i className="material-icons-outlined me-2">person_outline</i>
            Public Profile
          </Link>
        ) : null}

        <hr className="dropdown-divider" />
        <Link
          to={all_routes.signin}
          className="dropdown-item d-inline-flex align-items-center link-danger"
          onClick={handleSignOut}
        >
          <i className="material-icons-outlined me-2">logout</i>
          Sign Out
        </Link>
      </div>
    </div>
  );
};

export default HeaderAccountMenu;
