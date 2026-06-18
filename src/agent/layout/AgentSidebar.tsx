import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import AppMenu from "@dashboard-ui/Layouts/Menu";
import { getAgentMenuWithBadges } from "../constants/agentMenu";
import { useAuth } from "../../context/AuthContext";
import { getListingsByAgentId } from "../../services/listingQueueStore";
import {
  getUnreadCountForAgent,
  subscribeMessages,
} from "../../services/messageStore";

const AgentSidebar = () => {
  const { user } = useAuth();
  const [, refresh] = useState(0);

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  const pendingCount = user
    ? getListingsByAgentId(user.id).filter(
        (listing) => listing.status === "pending_review",
      ).length
    : 0;
  const unreadMessages = user ? getUnreadCountForAgent(user.id) : 0;
  const menuItems = getAgentMenuWithBadges({
    pendingListings: pendingCount,
    unreadMessages,
  });

  return (
    <div className="leftside-menu">
      <Link to="/agent/dashboard" className="logo logo-light">
        <span className="logo-lg">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-agent-logo" />
        </span>
        <span className="logo-sm">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-agent-logo" />
        </span>
      </Link>
      <Link to="/agent/dashboard" className="logo logo-dark">
        <span className="logo-lg">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-agent-logo" />
        </span>
        <span className="logo-sm">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-agent-logo" />
        </span>
      </Link>
      <div className="agent-sidebar-badge px-3 pb-2">
        <span className="badge bg-white bg-opacity-10 w-100 py-2">
          <i className="ri-vip-crown-line me-1" /> Partner Agent
        </span>
      </div>
      <SimpleBar className="h-100" id="leftside-menu-container">
        <AppMenu menuItems={menuItems} />
        <div className="clearfix" />
      </SimpleBar>
    </div>
  );
};

export default AgentSidebar;
