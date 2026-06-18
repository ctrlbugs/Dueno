import type { AgentUser } from "../types/user";
import type { BuyerUser } from "../types/user";

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
    agents.push({
      id: "agent-2",
      firstName: "Emeka",
      lastName: "Nwosu",
      email: approvedEmail,
      phone: "+2348098765432",
      password: approvedPassword,
      agencyName: "Abuja Elite Homes",
      licenseNumber: "NIESV-2023-088",
      city: "Abuja",
      state: "FCT",
      status: "approved",
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      createdBy: "self",
      trustScore: 92,
      bio: "Licensed NIESV agent specialising in Abuja luxury homes.",
    });
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
