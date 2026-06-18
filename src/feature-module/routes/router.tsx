
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { authRoutes, publicRoutes} from "./router.link";
import AuthFeature from "../feathure-components/authFeature";
import Feature from "../feathure-components/feature";

const AdminApp = lazy(() => import("../../admin/AdminApp"));
const AgentApp = lazy(() => import("../../agent/AgentApp"));

const ALLRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="p-4">Loading admin...</div>}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/agent/*"
          element={
            <Suspense fallback={<div className="p-4">Loading agent portal...</div>}>
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
