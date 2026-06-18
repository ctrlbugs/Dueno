import type { EstateProperty } from "../data/estateProperties";
import { getAgentById, getAgentAvatarUrl } from "../services/agentStore";
import { formatPropertyPrice } from "./nairaPrice";

const DEFAULT_AGENT_AVATAR = "assets/img/logo.svg";

const isGenericLogoAvatar = (src?: string) =>
  !src || src.includes("logo.svg") || src.endsWith("/logo.svg");

export const resolvePropertyAgentAvatar = (property: EstateProperty): string => {
  if (!isGenericLogoAvatar(property.agentAvatar)) {
    return property.agentAvatar!;
  }

  if (property.agentId) {
    const avatar = getAgentAvatarUrl(getAgentById(property.agentId));
    if (avatar) return avatar;
  }

  return property.agentAvatar ?? DEFAULT_AGENT_AVATAR;
};

export const resolvePropertyPrice = (price: string) => formatPropertyPrice(price);
