import { getDevSeedAgents } from "../config/devAccounts";
import { getPublicAgents, PUBLIC_AGENT_IDS } from "../config/publicAgents";
import type { AgentStatus, AgentUser } from "../types/user";

const STORAGE_KEY = "_DUENO_AGENTS";

const mergePublicAgents = (agents: AgentUser[]): AgentUser[] => {
  const seeds = getPublicAgents();
  if (seeds.length === 0) return agents;

  let changed = false;
  const merged = [...agents];

  for (const seed of seeds) {
    const index = merged.findIndex((agent) => agent.id === seed.id);
    if (index === -1) {
      merged.push(seed);
      changed = true;
      continue;
    }

    if (!PUBLIC_AGENT_IDS.has(seed.id)) continue;

    const existing = merged[index];
    merged[index] = {
      ...seed,
      password: existing.password || seed.password,
      email: existing.email || seed.email,
      avatarDataUrl: existing.avatarDataUrl ?? seed.avatarDataUrl,
      coverImageDataUrl: existing.coverImageDataUrl ?? seed.coverImageDataUrl,
    };
    changed = true;
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  return merged;
};

const seedAgents = (): AgentUser[] => mergePublicAgents(getDevSeedAgents());

const DEV_SEED_AGENT_IDS = new Set(["agent-1", "agent-2", "agent-3"]);

const mergeDevSeedAgents = (agents: AgentUser[]): AgentUser[] => {
  const seeds = getDevSeedAgents();
  if (seeds.length === 0) return agents;

  let changed = false;
  const merged = [...agents];

  for (const seed of seeds) {
    const index = merged.findIndex((agent) => agent.id === seed.id);
    if (index === -1) {
      merged.push(seed);
      changed = true;
    } else if (DEV_SEED_AGENT_IDS.has(seed.id)) {
      merged[index] = seed;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  return merged;
};

const readAgents = (): AgentUser[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedAgents();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return mergeDevSeedAgents(mergePublicAgents(JSON.parse(raw) as AgentUser[]));
  } catch {
    const seeded = seedAgents();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const writeAgents = (agents: AgentUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  window.dispatchEvent(new CustomEvent("dueno-agents-updated"));
};

export const getAgents = (): AgentUser[] => readAgents();

export const getAgentById = (id: string): AgentUser | undefined =>
  readAgents().find((agent) => agent.id === id);

export const getAgentAvatarUrl = (agent?: AgentUser | null): string | undefined =>
  agent?.avatarDataUrl ?? agent?.registration?.profilePhotoDataUrl;

export const getAgentCoverUrl = (agent?: AgentUser | null): string | undefined =>
  agent?.coverImageDataUrl;

export const getAgentByEmail = (email: string): AgentUser | undefined =>
  readAgents().find(
    (agent) => agent.email.toLowerCase() === email.toLowerCase()
  );

export const authenticateAgent = (
  email: string,
  password: string
): AgentUser | null => {
  const agent = getAgentByEmail(email);
  if (!agent || agent.password !== password) return null;
  return agent;
};

export const getAgentsByStatus = (status: AgentStatus): AgentUser[] =>
  readAgents().filter((agent) => agent.status === status);

export const getApprovedPublicAgents = (): AgentUser[] =>
  getAgentsByStatus("approved").sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.trim();
    const nameB = `${b.firstName} ${b.lastName}`.trim();
    return nameA.localeCompare(nameB);
  });

export const createAgent = (
  input: Omit<AgentUser, "id" | "createdAt" | "createdBy"> & {
    createdBy?: AgentUser["createdBy"];
  }
): AgentUser => {
  const agents = readAgents();
  const emailTaken = agents.some(
    (agent) => agent.email.toLowerCase() === input.email.toLowerCase()
  );
  if (emailTaken) {
    throw new Error("An account with this email already exists.");
  }

  const agent: AgentUser = {
    ...input,
    id: `agent-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy ?? "self",
    avatarDataUrl:
      input.avatarDataUrl ?? input.registration?.profilePhotoDataUrl,
    agencyName:
      input.registration?.agentType === "company" && input.registration.companyName
        ? input.registration.companyName
        : input.agencyName,
  };

  writeAgents([agent, ...agents]);
  return agent;
};

export type AgentProfilePatch = Partial<
  Pick<
    AgentUser,
    | "bio"
    | "availability"
    | "avatarDataUrl"
    | "coverImageDataUrl"
    | "socialLinks"
    | "phone"
  >
>;

export const updateAgentProfile = (
  id: string,
  patch: AgentProfilePatch,
): AgentUser | undefined => {
  const agents = readAgents();
  const index = agents.findIndex((agent) => agent.id === id);
  if (index === -1) return undefined;

  agents[index] = {
    ...agents[index],
    ...patch,
  };
  writeAgents(agents);
  return agents[index];
};

export const updateAgentStatus = (
  id: string,
  status: AgentStatus,
  notes?: string
): AgentUser | undefined => {
  const agents = readAgents();
  const index = agents.findIndex((agent) => agent.id === id);
  if (index === -1) return undefined;

  agents[index] = {
    ...agents[index],
    status,
    notes: notes ?? agents[index].notes,
  };
  writeAgents(agents);
  return agents[index];
};

export const subscribeAgents = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-agents-updated", handler);
  return () => window.removeEventListener("dueno-agents-updated", handler);
};
