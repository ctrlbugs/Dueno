import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "simplebar-react/dist/simplebar.min.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { ThemeProvider } from "@dashboard-ui/common/context";
import "./styles/agent-overrides.scss";
import { useAuth } from "../context/AuthContext";
import { getPostLoginRedirect } from "../services/authService";
import { all_routes } from "../feature-module/routes/all_routes";
import { AgentSearchProvider } from "./context/AgentSearchContext";

const AgentLayout = lazy(() => import("./layout/AgentLayout"));

const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));
const AgentListingsPage = lazy(() => import("./pages/AgentListingsPage"));
const AgentNewListingPage = lazy(() => import("./pages/AgentNewListingPage"));
const AgentPendingPage = lazy(() => import("./pages/AgentPendingPage"));
const AgentMessagesPage = lazy(() => import("./pages/AgentMessagesPage"));
const AgentProfileSettingsPage = lazy(
  () => import("./pages/AgentProfileSettingsPage"),
);

const AgentProtectedRoutes = () => (
  <AgentSearchProvider>
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AgentLayout />
    </Suspense>
  </AgentSearchProvider>
);

const AgentRoutes = () => (
  <Suspense fallback={<div className="p-4">Loading agent portal...</div>}>
    <Routes>
      <Route path="pending-review" element={<AgentPendingPage />} />
      <Route element={<AgentProtectedRoutes />}>
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="listings" element={<AgentListingsPage />} />
        <Route path="listings/new" element={<AgentNewListingPage />} />
        <Route path="profile" element={<AgentProfileSettingsPage />} />
        <Route path="messages" element={<AgentMessagesPage />} />
      </Route>
      <Route path="*" element={<AgentIndexRedirect />} />
    </Routes>
  </Suspense>
);

const AgentIndexRedirect = () => {
  const { user } = useAuth();
  if (!user || user.role !== "agent") {
    return <Navigate to={all_routes.signin} replace />;
  }
  return <Navigate to={getPostLoginRedirect(user)} replace />;
};

const AgentApp = () => {
  useEffect(() => {
    document.body.classList.add("agent-app");
    return () => document.body.classList.remove("agent-app");
  }, []);

  return (
    <ThemeProvider>
      <AgentRoutes />
    </ThemeProvider>
  );
};

export default AgentApp;
