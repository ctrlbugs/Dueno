export type AgentSocialLinks = {
  x?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
};

export const AGENT_SOCIAL_FIELDS = [
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourprofile",
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourhandle",
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
  },
] as const satisfies ReadonlyArray<{
  key: keyof AgentSocialLinks;
  label: string;
  placeholder: string;
}>;

const trim = (value?: string) => value?.trim() ?? "";

export const normalizeSocialLinks = (
  links?: Partial<AgentSocialLinks> | null,
): AgentSocialLinks | undefined => {
  if (!links) return undefined;

  const normalized: AgentSocialLinks = {};
  for (const { key } of AGENT_SOCIAL_FIELDS) {
    const value = trim(links[key]);
    if (value) normalized[key] = value;
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
};

export const hasSocialLinks = (links?: AgentSocialLinks | null) =>
  Boolean(links && Object.values(links).some((value) => trim(value)));
