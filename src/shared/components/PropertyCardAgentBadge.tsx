import { useEffect, useState } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../core/imageWithBasePath";
import type { EstateProperty } from "../../data/estateProperties";
import { subscribeAgents } from "../../services/agentStore";
import {
  isPropertyCardBrandLogo,
  resolvePropertyAgentAvatar,
} from "../../utils/propertyDisplay";

type PropertyCardAgentBadgeProps = {
  property: EstateProperty;
  className?: string;
};

const PropertyCardAgentBadge = ({
  property,
  className = "",
}: PropertyCardAgentBadgeProps) => {
  const [, refresh] = useState(0);

  useEffect(() => subscribeAgents(() => refresh((value) => value + 1)), []);

  const avatarSrc = resolvePropertyAgentAvatar(property);
  const isBrandLogo = isPropertyCardBrandLogo(avatarSrc);
  const alt = isBrandLogo
    ? "Dueno Property"
    : property.agentName ?? "Listing agent";

  if (isBrandLogo) {
    return (
      <span
        className={`property-agent-avatar property-agent-avatar--brand ${className}`.trim()}
      >
        <ImageWithBasePath
          src={avatarSrc}
          alt={alt}
          className="property-agent-avatar__logo border border-white rounded-circle"
        />
      </span>
    );
  }

  const photo = (
    <ImageWithBasePath
      src={avatarSrc}
      alt={alt}
      className="property-agent-avatar__photo"
    />
  );

  return (
    <span
      className={`property-agent-avatar property-agent-avatar--photo ${className}`.trim()}
    >
      {property.agentId ? (
        <Link to={`/dueno-agent/${property.agentId}`}>{photo}</Link>
      ) : (
        photo
      )}
    </span>
  );
};

export default PropertyCardAgentBadge;
