import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ThemeSettings, useThemeContext } from "@dashboard-ui/common/context";
import { useViewport } from "@dashboard-ui/hooks";
import { changeHTMLAttribute } from "@dashboard-ui/utils";
import "@dashboard-ui/assets/scss/app.scss";
import { useAuth } from "../../context/AuthContext";
import { all_routes } from "../../feature-module/routes/all_routes";
import { getAgentById } from "../../services/agentStore";
import { saveSession } from "../../services/authService";
import AgentSidebar from "./AgentSidebar";
import AgentTopbar from "./AgentTopbar";

const AgentLayout = () => {
  const { settings, updateSidebar } = useThemeContext();
  const { width } = useViewport();
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    changeHTMLAttribute("data-bs-theme", settings.theme);
    changeHTMLAttribute("data-menu-color", "brand");
  }, [settings.theme]);

  useEffect(() => {
    changeHTMLAttribute("data-layout-mode", settings.layout.mode);
  }, [settings.layout.mode]);

  useEffect(() => {
    changeHTMLAttribute("data-topbar-color", settings.topbar.theme);
  }, [settings.topbar.theme]);

  useEffect(() => {
    changeHTMLAttribute("data-sidenav-size", settings.sidebar.size);
  }, [settings.sidebar.size]);

  useEffect(() => {
    changeHTMLAttribute("data-layout-position", settings.layout.menuPosition);
  }, [settings.layout.menuPosition]);

  useEffect(() => {
    if (width < 768) {
      updateSidebar({ size: ThemeSettings.sidebar.size.full });
    } else if (width < 1140) {
      updateSidebar({ size: ThemeSettings.sidebar.size.condensed });
    } else {
      updateSidebar({ size: ThemeSettings.sidebar.size.default });
    }
  }, [width, updateSidebar]);

  useEffect(() => {
    if (!user || user.role !== "agent") return;
    const agent = getAgentById(user.id);
    if (agent && agent.status !== user.agentStatus) {
      saveSession({ ...user, agentStatus: agent.status });
      refresh();
    }
  }, [user, refresh]);

  if (!user || user.role !== "agent") {
    return <Navigate to={all_routes.signin} replace />;
  }

  if (user.agentStatus !== "approved") {
    return <Navigate to="/agent/pending-review" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate(all_routes.signin);
  };

  return (
    <div className="wrapper">
      <AgentTopbar />
      <AgentSidebar />
      <div className="content-page">
        <div className="content">
          <Container fluid>
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <Outlet />
            </Suspense>
          </Container>
        </div>
        <footer className="footer">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-6">
                {new Date().getFullYear()} © Dueno Agent Portal
              </div>
              <div className="col-md-6">
                <div className="text-md-end footer-links d-none d-md-block">
                  <a href="/home" target="_blank" rel="noreferrer">
                    Public Site
                  </a>
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-3 text-muted"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AgentLayout;
