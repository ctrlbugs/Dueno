import ImageWithBasePath from "../../core/imageWithBasePath";
import { getAgentAvatarUrl, type AgentUser } from "../../services/agentStore";
import { getAgentFullName } from "../utils/agentDisplay";

type AgentAvatarProps = {
  agent: AgentUser;
  variant?: "list" | "profile" | "card" | "header" | "hero";
  className?: string;
};

const AgentAvatar = ({
  agent,
  variant = "list",
  className = "",
}: AgentAvatarProps) => {
  const avatarUrl = getAgentAvatarUrl(agent);
  const name = getAgentFullName(agent);

  if (avatarUrl) {
    return (
      <ImageWithBasePath
        src={avatarUrl}
        alt={name}
        className={
          variant === "profile" ||
          variant === "card" ||
          variant === "header" ||
          variant === "hero"
            ? `rounded-circle border ${className}`.trim()
            : className
        }
      />
    );
  }

  return (
    <span
      className={`agent-avatar-fallback agent-avatar-fallback--${variant} ${className}`.trim()}
      role="img"
      aria-label={name}
    >
      <span className="material-icons-outlined" aria-hidden="true">
        person
      </span>
    </span>
  );
};

export default AgentAvatar;
