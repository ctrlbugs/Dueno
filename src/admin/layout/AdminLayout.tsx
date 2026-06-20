import { Suspense, useEffect, type ReactNode } from "react";
import { Container } from "react-bootstrap";
import { ThemeSettings, useThemeContext } from "@dashboard-ui/common/context";
import { useViewport } from "@dashboard-ui/hooks";
import { changeHTMLAttribute } from "@dashboard-ui/utils";
import "@dashboard-ui/assets/scss/app.scss";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { DashboardPageLoader } from "../../shared/components/DashboardLoaders";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { settings, updateSidebar } = useThemeContext();
  const { width } = useViewport();

  useEffect(() => {
    changeHTMLAttribute("data-bs-theme", settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    changeHTMLAttribute("data-layout-mode", settings.layout.mode);
  }, [settings.layout.mode]);

  useEffect(() => {
    changeHTMLAttribute("data-topbar-color", settings.topbar.theme);
  }, [settings.topbar.theme]);

  useEffect(() => {
    changeHTMLAttribute("data-menu-color", settings.sidebar.theme);
  }, [settings.sidebar.theme]);

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

  return (
    <div className="wrapper">
      <AdminTopbar />
      <AdminSidebar />
      <div className="content-page">
        <div className="content">
          <Container fluid>
            <Suspense fallback={<DashboardPageLoader portal="admin" />}>
              {children}
            </Suspense>
          </Container>
        </div>
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                {new Date().getFullYear()} © Dueno Admin
              </div>
              <div className="col-md-6">
                <div className="text-md-end footer-links d-none d-md-block">
                  <a href="/home" target="_blank" rel="noreferrer">
                    Public Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
