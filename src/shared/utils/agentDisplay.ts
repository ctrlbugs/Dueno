import { getPropertiesByAgentId } from "../../data/estateProperties";
import type { AgentUser } from "../../types/user";

export const getAgentFullName = (agent: AgentUser) =>
  `${agent.firstName} ${agent.lastName}`.trim();

export const getAgentProfilePath = (agentId: string) =>
  `/dueno-agent/${encodeURIComponent(agentId)}`;

export const getAgentListingCount = (agentId: string) =>
  getPropertiesByAgentId(agentId).length;

export const getAgentRoleLabel = (agent: AgentUser) => {
  const categories = agent.registration?.propertyCategories ?? [];
  if (categories.length === 0) return "Property Agent";
  if (categories.length === 1) return `${categories[0]} Agent`;
  return categories.slice(0, 2).join(" · ") + " Agent";
};

export const getAgentBio = (agent: AgentUser) => {
  if (agent.bio?.trim()) return agent.bio.trim();

  const years = agent.registration?.yearsOfExperience;
  const areas = agent.registration?.areasOfOperation ?? [];
  const areaText =
    areas.length > 0
      ? ` serving ${areas.slice(0, 3).join(", ")}`
      : ` based in ${agent.city}, ${agent.state}`;

  if (years && years > 0) {
    return `Verified Dueno property agent with ${years}+ years of experience${areaText}.`;
  }

  return `Verified Dueno property agent${areaText}, helping clients buy, sell, and rent with confidence.`;
};

export const getAgentTrustLabel = (agent: AgentUser) => {
  const score = agent.trustScore ?? 85;
  return `${score}/100 Trust Score`;
};

export const getAgentAvailability = (agent: AgentUser): "available" | "away" =>
  agent.availability ?? "available";

export const getAgentShortBio = (agent: AgentUser, maxLength = 140) => {
  const bio = getAgentBio(agent);
  if (bio.length <= maxLength) return bio;
  return `${bio.slice(0, maxLength).trimEnd()}…`;
};

export const getAgentHandle = (agent: AgentUser) => {
  const base = `${agent.firstName}${agent.lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return `@${base || "agent"}`;
};

export const getAgentJoinedLabel = (agent: AgentUser) => {
  const date = new Date(agent.createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return `Joined ${date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })}`;
};

export const getAgentCategoryTags = (agent: AgentUser) =>
  agent.registration?.propertyCategories ?? [];
