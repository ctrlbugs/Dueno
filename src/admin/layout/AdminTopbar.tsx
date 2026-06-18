import { useEffect, useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminSearch } from "../context/AdminSearchContext";
import {
  getUnreadCountForAdmin,
  subscribeMessages,
} from "../../services/messageStore";
import InboxNotificationBell from "../../shared/components/InboxNotificationBell";

const AdminTopbar = () => {
  const { user, logout } = useAdminAuth();
  const { query, setQuery, clearQuery } = useAdminSearch();
  const [, refresh] = useState(0);
  const unreadCount = getUnreadCountForAdmin();

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  return (
    <div className="navbar-custom">
      <div className="topbar container-fluid">
        <div className="d-flex align-items-center gap-lg-2 gap-1 flex-grow-1 min-w-0">
          <button
            type="button"
            className="button-toggle-menu"
            aria-label="Toggle menu"
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
                  placeholder="Search agents, listings..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search agents and listings"
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
              to="/admin/listings/create"
              className="btn btn-sm btn-primary rounded-pill px-3"
            >
              <i className="ri-add-line me-1" />
              New Listing
            </Link>
          </li>
          <li>
            <InboxNotificationBell to="/admin/messages" count={unreadCount} />
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
                  <Image
                    src="/assets/img/users/user-01.jpg"
                    alt="Admin"
                    width={36}
                    height={36}
                    className="rounded-circle"
                    roundedCircle
                  />
                </span>
                <span className="d-lg-block d-none">
                  <h5 className="my-0 fw-normal">{user?.firstName ?? "Admin"}</h5>
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
                  <h6 className="text-overflow m-0">Administrator</h6>
                </div>
                <Dropdown.Item as={Link} to="/admin">
                  <i className="ri-dashboard-3-line me-1" /> Dashboard
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/messages">
                  <i className="ri-message-3-line me-1" /> Messages
                  {unreadCount > 0 ? (
                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                  ) : null}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/agents/create">
                  <i className="ri-user-add-line me-1" /> Create Agent
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    logout();
                  }}
                  as={Link}
                  to="/admin/login"
                >
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

export default AdminTopbar;
