import { getDevSeedAgents } from "../config/devAccounts";
import type { AgentStatus, AgentUser } from "../types/user";

const STORAGE_KEY = "_DUENO_AGENTS";

const seedAgents = (): AgentUser[] => getDevSeedAgents();

const readAgents = (): AgentUser[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedAgents();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as AgentUser[];
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
