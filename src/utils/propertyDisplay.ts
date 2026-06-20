import type { EstateProperty } from "../data/estateProperties";
import { getAgentById, getAgentAvatarUrl } from "../services/agentStore";
import { formatPropertyPrice } from "./nairaPrice";

const DEFAULT_AGENT_AVATAR = "assets/img/logo.svg";

export const isPropertyCardBrandLogo = (src?: string) =>
  !src || src.includes("logo.svg") || src.endsWith("/logo.svg");

export const resolvePropertyAgentAvatar = (property: EstateProperty): string => {
  if (property.agentId) {
    const liveAvatar = getAgentAvatarUrl(getAgentById(property.agentId));
    if (liveAvatar) return liveAvatar;
  }

  if (!isPropertyCardBrandLogo(property.agentAvatar)) {
    return property.agentAvatar!;
  }

  return DEFAULT_AGENT_AVATAR;
};

export const resolvePropertyPrice = (price: string) => formatPropertyPrice(price);
