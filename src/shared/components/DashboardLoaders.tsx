import "../styles/dashboardLoader.scss";

const PORTAL_COPY = {
  admin: {
    title: "Admin Portal",
    subtitle: "Preparing your dashboard",
  },
  agent: {
    title: "Agent Portal",
    subtitle: "Loading your dashboard",
  },
} as const;

type PortalKind = keyof typeof PORTAL_COPY;

type DashboardPortalLoaderProps = {
  portal: PortalKind;
};

export const DashboardPortalLoader = ({ portal }: DashboardPortalLoaderProps) => {
  const copy = PORTAL_COPY[portal];

  return (
    <div
      className={`dueno-dashboard-portal-loader dueno-dashboard-portal-loader--${portal}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="dueno-dashboard-portal-loader__backdrop" aria-hidden="true" />
      <div className="dueno-dashboard-portal-loader__content">
        <div className="dueno-dashboard-portal-loader__logo-ring">
          <img
            src="/assets/img/logo-white.svg"
            alt=""
            className="dueno-dashboard-portal-loader__logo"
          />
          <span className="dueno-dashboard-portal-loader__orbit" aria-hidden="true" />
        </div>
        <p className="dueno-dashboard-portal-loader__title">{copy.title}</p>
        <p className="dueno-dashboard-portal-loader__subtitle">{copy.subtitle}</p>
        <span className="visually-hidden">Loading {copy.title}</span>
      </div>
    </div>
  );
};

type DashboardPageLoaderProps = {
  portal?: PortalKind;
};

export const DashboardPageLoader = ({
  portal = "admin",
}: DashboardPageLoaderProps) => (
  <div
    className={`dueno-dashboard-page-loader dueno-dashboard-page-loader--${portal}`}
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label="Loading page content"
  >
    <div className="dueno-dashboard-page-loader__breadcrumb dueno-shimmer" />
    <div className="row g-3 mb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="col-xxl-3 col-sm-6">
          <div className="dueno-dashboard-page-loader__stat dueno-shimmer" />
        </div>
      ))}
    </div>
    <div className="dueno-dashboard-page-loader__panel dueno-shimmer" />
    <span className="visually-hidden">Loading dashboard content</span>
  </div>
);
