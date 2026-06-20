import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AgentAvatar from "../../shared/components/AgentAvatar";
import { useAuth } from "../../context/AuthContext";
import { all_routes } from "../../feature-module/routes/all_routes";
import { getAgentById, subscribeAgents } from "../../services/agentStore";
import {
  getUnreadCountForAgent,
  subscribeMessages,
} from "../../services/messageStore";
import StaffMessagesDropdown from "../../shared/components/StaffMessagesDropdown";
import { useAgentSearch } from "../context/AgentSearchContext";
import toggleSidebar from "../utils/toggleSidebar";

const AgentTopbar = () => {
  const { user, logout } = useAuth();
  const { query, setQuery, clearQuery } = useAgentSearch();
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const agent = user ? getAgentById(user.id) : undefined;
  const unreadCount = user ? getUnreadCountForAgent(user.id) : 0;

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);
  useEffect(() => subscribeAgents(() => refresh((n) => n + 1)), []);

  const handleLogout = () => {
    logout();
    navigate(all_routes.signin);
  };

  return (
    <div className="navbar-custom">
      <div className="topbar container-fluid">
        <div className="d-flex align-items-center gap-lg-2 gap-1 flex-grow-1 min-w-0">
          <button
            type="button"
            className="button-toggle-menu"
            aria-label="Toggle menu"
            onClick={toggleSidebar}
          >
            <i className="ri-menu-2-line" />
          </button>
          <div className="app-search flex-grow-1 min-w-0">
            <form
              onSubmit={(event) => event.preventDefault()}
              role="search"
            >
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search your listings..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search listings"
                />
                {query ? (
                  <button
                    type="button"
                    className="btn btn-link search-icon text-muted border-0"
                    onClick={clearQuery}
                    aria-label="Clear search"
                  >
                    <i className="ri-close-line" />
                  </button>
                ) : (
                  <span className="ri-search-line search-icon text-muted" />
                )}
              </div>
            </form>
          </div>
        </div>

        <ul className="topbar-menu d-flex align-items-center gap-3">
          <li className="d-none d-lg-inline-block">
            <Link
              to="/agent/listings/new"
              className="btn btn-sm btn-primary rounded-pill px-3"
            >
              <i className="ri-add-line me-1" />
              New Listing
            </Link>
          </li>
          <li>
            {user ? (
              <StaffMessagesDropdown
                variant="dashboard"
                mode="agent"
                userId={user.id}
              />
            ) : null}
          </li>
          <li className="d-none d-md-inline-block">
            <Link to="/home" className="nav-link" target="_blank">
              <i className="ri-external-link-line fs-22" />
            </Link>
          </li>
          <li className="dropdown">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="nav-link dropdown-toggle nav-user px-2"
              >
                <span className="account-user-avatar">
                  {agent ? (
                    <AgentAvatar agent={agent} variant="header" />
                  ) : (
                    <span
                      className="agent-avatar-fallback agent-avatar-fallback--header"
                      aria-hidden="true"
                    >
                      <span className="material-icons-outlined">person</span>
                    </span>
                  )}
                </span>
                <span className="d-lg-block d-none">
                  <h5 className="my-0 fw-normal">{user?.firstName ?? "Agent"}</h5>
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                className="dropdown-menu-end dropdown-menu-animated profile-dropdown"
                popperConfig={{
                  modifiers: [{ name: "offset", options: { offset: [0, 6] } }],
                }}
              >
                <div className="dropdown-header noti-title">
                  <h6 className="text-overflow m-0">
                    {agent?.agencyName ?? "Dueno Agent"}
                  </h6>
                </div>
                <Dropdown.Item as={Link} to="/agent/dashboard">
                  <i className="ri-dashboard-3-line me-1" /> Dashboard
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/agent/listings">
                  <i className="ri-building-4-line me-1" /> My Listings
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/agent/messages">
                  <i className="ri-message-3-line me-1" /> Messages
                  {unreadCount > 0 ? (
                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                  ) : null}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/agent/listings/new">
                  <i className="ri-add-circle-line me-1" /> Add Listing
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="ri-logout-box-line me-1" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgentTopbar;
