import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import AgentProfileHeader from "../../../../../shared/components/AgentProfileHeader";
import { getAgentById, subscribeAgents } from "../../../../../services/agentStore";
import {
  getPropertiesByAgentId,
  type EstateProperty,
} from "../../../../../data/estateProperties";
import { subscribePublishedListings } from "../../../../../services/publishedListingsStore";
import { subscribeAgentFollows } from "../../../../../services/agentFollowStore";
import BuyGridPropertyCard from "../../shared/BuyGridPropertyCard";

const DuenoAgentProfile = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [, refresh] = useState(0);

  useEffect(() => {
    const bump = () => refresh((value) => value + 1);
    const unsubAgents = subscribeAgents(bump);
    const unsubListings = subscribePublishedListings(bump);
    const unsubFollows = subscribeAgentFollows(bump);
    return () => {
      unsubAgents();
      unsubListings();
      unsubFollows();
    };
  }, []);

  const agent = agentId ? getAgentById(agentId) : undefined;

  if (!agent || agent.status !== "approved") {
    return <Navigate to={all_routes.agentList} replace />;
  }

  const listings = getPropertiesByAgentId(agent.id);

  return (
    <div className="page-wrapper dueno-agent-profile-page">
      <div className="content p-0">
        <div className="container px-0 px-md-3">
          <AgentProfileHeader agent={agent} listingCount={listings.length} />

          <div className="dueno-agent-profile-page__listings px-3 px-md-0 pb-5">
            <div className="dueno-agent-profile-page__tabs">
              <span className="dueno-agent-profile-page__tab dueno-agent-profile-page__tab--active">
                Listings
              </span>
            </div>

            {listings.length > 0 ? (
              <div className="row property-listings-grid">
                {listings.map((property: EstateProperty) => (
                  <BuyGridPropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                No published listings yet.{" "}
                <Link to={all_routes.buyProperty}>Browse all properties</Link>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuenoAgentProfile;
