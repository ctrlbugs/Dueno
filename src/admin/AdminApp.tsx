import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "simplebar-react/dist/simplebar.min.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { ThemeProvider } from "@dashboard-ui/common/context";
import "./styles/admin-overrides.scss";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { AdminSearchProvider } from "./context/AdminSearchContext";
import {
  DashboardPageLoader,
  DashboardPortalLoader,
} from "../shared/components/DashboardLoaders";

const AdminLayout = lazy(() => import("./layout/AdminLayout"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AgentsListPage = lazy(() => import("./pages/AgentsListPage"));
const CreateAgentPage = lazy(() => import("./pages/CreateAgentPage"));
const AgentApplicationsPage = lazy(() => import("./pages/AgentApplicationsPage"));
const ListingsQueuePage = lazy(() => import("./pages/ListingsQueuePage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminAllListingsPage = lazy(() => import("./pages/AdminAllListingsPage"));
const AdminCreateListingPage = lazy(() => import("./pages/AdminCreateListingPage"));
const AdminEditListingPage = lazy(() => import("./pages/AdminEditListingPage"));
const AdminMessagesPage = lazy(() => import("./pages/AdminMessagesPage"));

const AdminProtectedRoutes = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminSearchProvider>
      <Suspense fallback={<DashboardPortalLoader portal="admin" />}>
        <AdminLayout>
          <Suspense fallback={<DashboardPageLoader portal="admin" />}>
            <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="agents" element={<AgentsListPage />} />
            <Route path="agents/create" element={<CreateAgentPage />} />
            <Route path="applications" element={<AgentApplicationsPage />} />
            <Route path="listings" element={<ListingsQueuePage />} />
            <Route path="listings/all" element={<AdminAllListingsPage />} />
            <Route path="listings/create" element={<AdminCreateListingPage />} />
            <Route path="listings/:listingId/edit" element={<AdminEditListingPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
          </Suspense>
        </AdminLayout>
      </Suspense>
    </AdminSearchProvider>
  );
};

const AdminRoutes = () => (
  <Suspense fallback={<DashboardPortalLoader portal="admin" />}>
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="*" element={<AdminProtectedRoutes />} />
    </Routes>
  </Suspense>
);

const AdminApp = () => {
  useEffect(() => {
    document.body.classList.add("admin-app");
    return () => document.body.classList.remove("admin-app");
  }, []);

  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
    </ThemeProvider>
  );
};

export default AdminApp;
