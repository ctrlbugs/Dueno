import { Link, Navigate, useParams } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { getAgentById } from "../../../../../services/agentStore";
import { getPropertiesByAgentId, type EstateProperty } from "../../../../../data/estateProperties";
import BuyGridPropertyCard from "../../shared/BuyGridPropertyCard";

const DuenoAgentProfile = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = agentId ? getAgentById(agentId) : undefined;

  if (!agent) {
    return <Navigate to={all_routes.buyProperty} replace />;
  }

  const listings = getPropertiesByAgentId(agent.id);
  const trustScore = agent.trustScore ?? 85;

  return (
    <div className="page-wrapper">
      <Breadcrumb
        title={`${agent.firstName} ${agent.lastName}`}
        paths={[
          { label: "Agents", link: "/agent-grid" },
          { label: agent.agencyName, active: true },
        ]}
      />
      <div className="content">
        <div className="container">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center g-4">
                <div className="col-auto">
                  <div className="avatar avatar-xxl">
                    <ImageWithBasePath
                      src={agent.avatarDataUrl ?? "assets/img/logo.svg"}
                      alt={agent.agencyName}
                      className="rounded-circle border"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                    <h2 className="mb-0">
                      {agent.firstName} {agent.lastName}
                    </h2>
                    <span className="badge bg-success">Verified Agent</span>
                  </div>
                  <p className="text-muted mb-2">{agent.agencyName}</p>
                  <p className="mb-2">
                    {agent.city}, {agent.state} · License {agent.licenseNumber}
                  </p>
                  {agent.bio && <p className="mb-0">{agent.bio}</p>}
                </div>
                <div className="col-lg-3">
                  <div className="text-lg-end">
                    <p className="text-muted mb-1">Trust score</p>
                    <h3 className="text-primary mb-0">{trustScore}/100</h3>
                    <p className="mb-0 mt-2">{listings.length} live listings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h4 className="mb-3">Listings by {agent.firstName}</h4>
          <div className="row mb-4 property-listings-grid">
            {listings.map((property: EstateProperty) => (
              <BuyGridPropertyCard key={property.id} property={property} />
            ))}
          </div>

          {listings.length === 0 && (
            <div className="text-center py-5 text-muted">
              No published listings yet.{" "}
              <Link to={all_routes.buyProperty}>Browse all properties</Link>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuenoAgentProfile;
