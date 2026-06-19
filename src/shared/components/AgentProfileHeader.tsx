import { Link } from "react-router";
import { useState } from "react";
import ImageWithBasePath from "../../core/imageWithBasePath";
import AgentAvatar from "./AgentAvatar";
import AgentSocialLinks from "./AgentSocialLinks";
import { useAuth } from "../../context/AuthContext";
import { getAgentCoverUrl } from "../../services/agentStore";
import {
  getFollowerCount,
  isFollowingAgent,
  toggleAgentFollow,
} from "../../services/agentFollowStore";
import type { AgentUser } from "../../types/user";
import {
  getAgentAvailability,
  getAgentBio,
  getAgentFullName,
  getAgentHandle,
  getAgentJoinedLabel,
  getAgentRoleLabel,
} from "../utils/agentDisplay";
import { all_routes } from "../../feature-module/routes/all_routes";

type Props = {
  agent: AgentUser;
  listingCount: number;
  backTo?: string;
  backLabel?: string;
};

const AgentProfileHeader = ({
  agent,
  listingCount,
  backTo = all_routes.agentList,
  backLabel = "Agents",
}: Props) => {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const coverUrl = getAgentCoverUrl(agent);
  const availability = getAgentAvailability(agent);
  const joinedLabel = getAgentJoinedLabel(agent);
  const followerCount = getFollowerCount(agent.id);
  const isOwnProfile = user?.id === agent.id;
  const isFollowing =
    user && !isOwnProfile ? isFollowingAgent(agent.id, user.id) : false;
  const signInReturn = `${all_routes.duenoAgentProfile.replace(":agentId", agent.id)}`;

  const handleFollow = () => {
    if (!user || isOwnProfile) return;
    toggleAgentFollow(agent.id, user.id);
    refresh((value) => value + 1);
  };

  return (
    <section className="dueno-agent-profile-hero">
      <div className="dueno-agent-profile-hero__cover-wrap">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="dueno-agent-profile-hero__cover-img"
          />
        ) : (
          <div className="dueno-agent-profile-hero__cover-default" aria-hidden="true">
            <ImageWithBasePath
              src="assets/img/logo.svg"
              alt=""
              className="dueno-agent-profile-hero__cover-logo"
            />
          </div>
        )}

        <div className="dueno-agent-profile-hero__topbar">
          <Link
            to={backTo}
            className="dueno-agent-profile-hero__icon-btn"
            aria-label={`Back to ${backLabel}`}
          >
            <span className="material-icons-outlined" aria-hidden="true">
              arrow_back
            </span>
          </Link>
        </div>
      </div>

      <div className="dueno-agent-profile-hero__body">
        <div className="dueno-agent-profile-hero__identity-row">
          <div className="dueno-agent-profile-hero__avatar">
            <AgentAvatar agent={agent} variant="hero" />
          </div>

          <div className="dueno-agent-profile-hero__actions">
            <a
              href={`mailto:${agent.email}`}
              className="dueno-agent-profile-hero__icon-btn dueno-agent-profile-hero__icon-btn--outline"
              aria-label={`Email ${getAgentFullName(agent)}`}
            >
              <span className="material-icons-outlined" aria-hidden="true">
                mail_outline
              </span>
            </a>

            {isOwnProfile ? (
              <Link
                to="/agent/profile"
                className="btn btn-primary rounded-pill dueno-agent-profile-hero__follow-btn"
              >
                Edit profile
              </Link>
            ) : user ? (
              <button
                type="button"
                className={`btn rounded-pill dueno-agent-profile-hero__follow-btn ${
                  isFollowing ? "btn-outline-dark" : "btn-primary"
                }`}
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            ) : (
              <Link
                to={all_routes.signin}
                state={{ from: signInReturn }}
                className="btn btn-primary rounded-pill dueno-agent-profile-hero__follow-btn"
              >
                Follow
              </Link>
            )}
          </div>
        </div>

        <div className="dueno-agent-profile-hero__meta">
          <div className="dueno-agent-profile-hero__name-row">
            <h1 className="dueno-agent-profile-hero__name mb-0">
              {getAgentFullName(agent)}
            </h1>
            <span className="dueno-agent-profile-hero__verified">
              <span className="material-icons-outlined" aria-hidden="true">
                verified
              </span>
              Verified
            </span>
          </div>

          <p className="dueno-agent-profile-hero__handle mb-1">
            {getAgentHandle(agent)} · {agent.agencyName}
          </p>

          <p className="dueno-agent-profile-hero__bio mb-2">{getAgentBio(agent)}</p>

          <div className="dueno-agent-profile-hero__details">
            <span
              className={`agent-profile-card__status agent-profile-card__status--${availability}`}
            >
              {availability}
            </span>
            <span>{getAgentRoleLabel(agent)}</span>
            <span>
              {agent.city}, {agent.state}
            </span>
            {joinedLabel && (
              <span className="dueno-agent-profile-hero__joined">
                <span className="material-icons-outlined" aria-hidden="true">
                  calendar_today
                </span>
                {joinedLabel}
              </span>
            )}
          </div>

          <div className="dueno-agent-profile-hero__stats">
            <span>
              <strong>{followerCount}</strong>{" "}
              {followerCount === 1 ? "Follower" : "Followers"}
            </span>
            <span>
              <strong>{listingCount}</strong>{" "}
              {listingCount === 1 ? "Listing" : "Listings"}
            </span>
          </div>

          <AgentSocialLinks
            links={agent.socialLinks}
            className="social-icons dueno-agent-profile-hero__socials"
          />
        </div>
      </div>
    </section>
  );
};

export default AgentProfileHeader;
