import type { AgentUser, BuyerUser } from "../types/user";
import { getPublicAgentById } from "./publicAgents";

export type DevAdminAccount = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin";
  token: string;
};

const env = import.meta.env;

const read = (key: string) => env[key as keyof ImportMetaEnv]?.trim() ?? "";

/** Dev seed accounts are only used in local development builds. */
export const isDevSeedEnabled = () =>
  import.meta.env.DEV && read("VITE_ENABLE_DEV_SEED_ACCOUNTS") !== "false";

export const getDevAdminAccount = (): DevAdminAccount | null => {
  const email = read("VITE_DEV_ADMIN_EMAIL");
  const password = read("VITE_DEV_ADMIN_PASSWORD");
  if (!email || !password) return null;

  return {
    id: "admin-1",
    email,
    password,
    firstName: read("VITE_DEV_ADMIN_FIRST_NAME") || "Dueno",
    lastName: read("VITE_DEV_ADMIN_LAST_NAME") || "Admin",
    role: "admin",
    token: read("VITE_DEV_ADMIN_TOKEN") || "dueno-admin-token",
  };
};

export const getDevAdminAccounts = (): DevAdminAccount[] => {
  const account = getDevAdminAccount();
  return account ? [account] : [];
};

export const getDevSeedAgents = (): AgentUser[] => {
  if (!isDevSeedEnabled()) return [];

  const pendingEmail = read("VITE_DEV_AGENT_PENDING_EMAIL");
  const pendingPassword = read("VITE_DEV_AGENT_PENDING_PASSWORD");
  const approvedEmail = read("VITE_DEV_AGENT_APPROVED_EMAIL");
  const approvedPassword = read("VITE_DEV_AGENT_APPROVED_PASSWORD");
  const sammyEmail = read("VITE_DEV_AGENT_SAMMY_EMAIL");
  const sammyPassword = read("VITE_DEV_AGENT_SAMMY_PASSWORD");

  const agents: AgentUser[] = [];

  if (pendingEmail && pendingPassword) {
    agents.push({
      id: "agent-1",
      firstName: "Adaeze",
      lastName: "Okonkwo",
      email: pendingEmail,
      phone: "+2348012345678",
      password: pendingPassword,
      agencyName: "Lekki Prime Realty",
      licenseNumber: "NIESV-2024-001",
      city: "Lagos",
      state: "Lagos",
      status: "pending_review",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdBy: "self",
    });
  }

  if (approvedEmail && approvedPassword) {
    const profile = getPublicAgentById("agent-2");
    if (profile) {
      agents.push({
        ...profile,
        email: approvedEmail,
        password: approvedPassword,
      });
    }
  }

  if (sammyEmail && sammyPassword) {
    const profile = getPublicAgentById("agent-3");
    if (profile) {
      agents.push({
        ...profile,
        email: sammyEmail,
        password: sammyPassword,
      });
    }
  }

  return agents;
};

export const getDevSeedBuyers = (): BuyerUser[] => {
  if (!isDevSeedEnabled()) return [];

  const email = read("VITE_DEV_BUYER_EMAIL");
  const password = read("VITE_DEV_BUYER_PASSWORD");
  if (!email || !password) return [];

  return [
    {
      id: "buyer-1",
      firstName: "Test",
      lastName: "Buyer",
      email,
      password,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const getDevApprovedAgentEmail = () =>
  read("VITE_DEV_AGENT_APPROVED_EMAIL");

export const getDevSammyAgentEmail = () =>
  read("VITE_DEV_AGENT_SAMMY_EMAIL");
