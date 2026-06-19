import type { AgentSocialLinks as AgentSocialLinksType } from "../../types/agentSocial";
import { AGENT_SOCIAL_FIELDS } from "../../types/agentSocial";

const ICONS: Record<keyof AgentSocialLinksType, string> = {
  x: "fa-brands fa-x-twitter",
  instagram: "fa-brands fa-instagram",
  linkedin: "fa-brands fa-linkedin",
  tiktok: "fa-brands fa-tiktok",
  facebook: "fa-brands fa-facebook",
  youtube: "fa-brands fa-youtube",
};

type Props = {
  links?: AgentSocialLinksType | null;
  className?: string;
};

const AgentSocialLinks = ({ links, className = "social-icons" }: Props) => {
  const items = AGENT_SOCIAL_FIELDS.filter(({ key }) => links?.[key]?.trim());

  if (items.length === 0) return null;

  return (
    <div className={className}>
      {items.map(({ key, label }) => (
        <a
          key={key}
          href={links?.[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <i className={ICONS[key]} />
        </a>
      ))}
    </div>
  );
};

export default AgentSocialLinks;
