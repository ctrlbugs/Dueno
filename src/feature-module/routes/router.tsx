
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import ScrollToTop from "../../core/common/ScrollToTop";
import { DashboardPortalLoader } from "../../shared/components/DashboardLoaders";
import { authRoutes, publicRoutes} from "./router.link";
import AuthFeature from "../feathure-components/authFeature";
import Feature from "../feathure-components/feature";

const AdminApp = lazy(() => import("../../admin/AdminApp"));
const AgentApp = lazy(() => import("../../agent/AgentApp"));

const ALLRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<DashboardPortalLoader portal="admin" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/agent/*"
          element={
            <Suspense fallback={<DashboardPortalLoader portal="agent" />}>
              <AgentApp />
            </Suspense>
          }
        />

        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default ALLRoutes;
