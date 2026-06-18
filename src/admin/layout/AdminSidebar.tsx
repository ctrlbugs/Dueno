import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import AppMenu from "@dashboard-ui/Layouts/Menu";
import { getAdminMenuWithBadges } from "../constants/adminMenu";
import { getAgentsByStatus } from "../services/agentStore";
import { getUnreadCountForAdmin, subscribeMessages } from "../../services/messageStore";

const AdminSidebar = () => {
  const [, refresh] = useState(0);

  useEffect(() => subscribeMessages(() => refresh((n) => n + 1)), []);

  const pendingCount = getAgentsByStatus("pending_review").length;
  const unreadMessages = getUnreadCountForAdmin();
  const menuItems = getAdminMenuWithBadges({
    pendingApplications: pendingCount,
    unreadMessages,
  });

  return (
    <div className="leftside-menu">
      <Link to="/admin" className="logo logo-light">
        <span className="logo-lg">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-admin-logo" />
        </span>
        <span className="logo-sm">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-admin-logo" />
        </span>
      </Link>
      <Link to="/admin" className="logo logo-dark">
        <span className="logo-lg">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-admin-logo" />
        </span>
        <span className="logo-sm">
          <img src="/assets/img/logo.svg" alt="Dueno" className="dueno-admin-logo" />
        </span>
      </Link>
      <SimpleBar className="h-100" id="leftside-menu-container">
        <AppMenu menuItems={menuItems} />
        <div className="clearfix" />
      </SimpleBar>
    </div>
  );
};

export default AdminSidebar;
