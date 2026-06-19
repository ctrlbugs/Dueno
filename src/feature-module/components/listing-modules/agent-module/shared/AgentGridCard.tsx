import { Link } from "react-router";
import AgentAvatar from "../../../../../shared/components/AgentAvatar";
import AgentSocialLinks from "../../../../../shared/components/AgentSocialLinks";
import type { AgentUser } from "../../../../../types/user";
import {
  getAgentAvailability,
  getAgentCategoryTags,
  getAgentFullName,
  getAgentListingCount,
  getAgentProfilePath,
  getAgentRoleLabel,
  getAgentShortBio,
} from "../../../../../shared/utils/agentDisplay";

type Props = {
  agent: AgentUser;
};

const MAX_VISIBLE_TAGS = 3;

const AgentGridCard = ({ agent }: Props) => {
  const profilePath = getAgentProfilePath(agent.id);
  const listingCount = getAgentListingCount(agent.id);
  const availability = getAgentAvailability(agent);
  const categories = getAgentCategoryTags(agent);
  const visibleTags = categories.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = Math.max(categories.length - MAX_VISIBLE_TAGS, 0);

  return (
    <article className="agent-profile-card h-100">
      <div className="agent-profile-card__header">
        <span
          className={`agent-profile-card__status agent-profile-card__status--${availability}`}
        >
          {availability}
        </span>
        <span className="agent-profile-card__listings">
          {listingCount} {listingCount === 1 ? "Listing" : "Listings"}
        </span>
      </div>

      <div className="agent-profile-card__avatar">
        <AgentAvatar agent={agent} variant="card" />
      </div>

      <h5 className="agent-profile-card__name mb-1">
        <Link to={profilePath}>{getAgentFullName(agent)}</Link>
      </h5>
      <p className="agent-profile-card__role mb-0">{getAgentRoleLabel(agent)}</p>
      <p className="agent-profile-card__location mb-0">
        {agent.city}, {agent.state}
      </p>

      <div className="agent-profile-card__verified">
        <span className="material-icons-outlined" aria-hidden="true">
          verified
        </span>
        <span>Verified Agent</span>
      </div>

      {categories.length > 0 ? (
        <div className="agent-profile-card__tags">
          {visibleTags.map((tag) => (
            <span key={tag} className="agent-profile-card__tag">
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 ? (
            <span className="agent-profile-card__tag agent-profile-card__tag--more">
              +{hiddenTagCount}
            </span>
          ) : null}
        </div>
      ) : null}

      <p className="agent-profile-card__bio">{getAgentShortBio(agent)}</p>

      <div className="agent-profile-card__footer">
        <AgentSocialLinks
          links={agent.socialLinks}
          className="social-icons agent-profile-card__social"
        />
        <Link to={profilePath} className="agent-profile-card__cta">
          View Profile
        </Link>
      </div>
    </article>
  );
};

export default AgentGridCard;
