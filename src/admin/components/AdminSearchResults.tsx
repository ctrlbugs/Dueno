import { Badge, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getAllLiveProperties,
  getPropertyDetailsPath,
} from "../../data/estateProperties";
import { getAgents } from "../services/agentStore";
import { getPendingListings } from "../services/listingQueueStore";
import { useAdminSearch } from "../context/AdminSearchContext";
import { matchesSearchQuery } from "../../utils/searchFilter";
import AgentStatusBadge from "./AgentStatusBadge";
import type { AgentUser } from "../types";
import type { EstateProperty } from "../../data/estateProperties";
import type { PendingListing } from "../../types/user";

const filterAgents = (agents: AgentUser[], query: string) =>
  agents.filter((agent) =>
    matchesSearchQuery(
      query,
      agent.firstName,
      agent.lastName,
      agent.email,
      agent.agencyName,
      agent.licenseNumber,
      agent.city,
      agent.state,
      agent.registration?.companyName,
      agent.phone,
    ),
  );

const filterLiveListings = (listings: EstateProperty[], query: string) =>
  listings.filter((property) =>
    matchesSearchQuery(
      query,
      property.title,
      property.fullTitle,
      property.address,
      property.agentName,
      property.price,
      property.listingType,
      property.category,
    ),
  );

const filterQueueListings = (listings: PendingListing[], query: string) =>
  listings.filter((listing) =>
    matchesSearchQuery(
      query,
      listing.title,
      listing.agentName,
      listing.city,
      listing.state,
      listing.address,
      listing.price,
      listing.listingType,
    ),
  );

const AdminSearchResults = () => {
  const { query } = useAdminSearch();
  const trimmed = query.trim();

  if (!trimmed) return null;

  const agents = filterAgents(getAgents(), trimmed);
  const listings = filterLiveListings(getAllLiveProperties(), trimmed);
  const queue = filterQueueListings(getPendingListings(), trimmed);
  const total = agents.length + listings.length + queue.length;

  return (
    <Card className="mb-3 border-primary border-opacity-25">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h4 className="header-title mb-1">Search results</h4>
            <p className="text-muted mb-0">
              {total} match{total === 1 ? "" : "es"} for &ldquo;{trimmed}&rdquo;
            </p>
          </div>
        </div>

        {total === 0 ? (
          <p className="text-muted mb-0">
            No agents or listings matched. Try a property title, city, agent
            name, or email.
          </p>
        ) : (
          <>
            {agents.length > 0 && (
              <div className="mb-4">
                <h5 className="fs-15 mb-2">Agents ({agents.length})</h5>
                <div className="table-responsive">
                  <Table hover size="sm" className="table-centered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Agency</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {agents.slice(0, 5).map((agent) => (
                        <tr key={agent.id}>
                          <td className="fw-semibold">
                            {agent.firstName} {agent.lastName}
                          </td>
                          <td>{agent.email}</td>
                          <td>
                            {agent.registration?.companyName ?? agent.agencyName}
                          </td>
                          <td>
                            <AgentStatusBadge status={agent.status} />
                          </td>
                          <td>
                            <Link
                              to="/admin/agents"
                              className="btn btn-sm btn-soft-primary"
                            >
                              Open
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {agents.length > 5 && (
                  <Link to="/admin/agents" className="fs-13">
                    View all {agents.length} agents
                  </Link>
                )}
              </div>
            )}

            {listings.length > 0 && (
              <div className="mb-4">
                <h5 className="fs-15 mb-2">Live listings ({listings.length})</h5>
                <div className="table-responsive">
                  <Table hover size="sm" className="table-centered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {listings.slice(0, 5).map((property) => (
                        <tr key={property.id}>
                          <td className="fw-semibold">{property.title}</td>
                          <td>
                            <Badge
                              bg={
                                property.listingType === "For Sale"
                                  ? "primary"
                                  : "info"
                              }
                            >
                              {property.listingType}
                            </Badge>
                          </td>
                          <td>{property.price}</td>
                          <td>
                            <Link
                              to={getPropertyDetailsPath(property)}
                              className="btn btn-sm btn-soft-primary"
                              target="_blank"
                              rel="noreferrer"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {listings.length > 5 && (
                  <Link to="/admin/listings/all" className="fs-13">
                    View all {listings.length} listings
                  </Link>
                )}
              </div>
            )}

            {queue.length > 0 && (
              <div>
                <h5 className="fs-15 mb-2">Approval queue ({queue.length})</h5>
                <div className="table-responsive">
                  <Table hover size="sm" className="table-centered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Property</th>
                        <th>Agent</th>
                        <th>City</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {queue.slice(0, 5).map((listing) => (
                        <tr key={listing.id}>
                          <td className="fw-semibold">{listing.title}</td>
                          <td>{listing.agentName}</td>
                          <td>{listing.city}</td>
                          <td>
                            <Link
                              to="/admin/listings"
                              className="btn btn-sm btn-soft-primary"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export {
  filterAgents,
  filterLiveListings,
  filterQueueListings,
};

export default AdminSearchResults;
