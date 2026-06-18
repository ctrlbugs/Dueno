import { getDevAdminAccounts } from "../config/devAccounts";
import type { PublicSession } from "../types/user";
import { authenticateAgent } from "./agentStore";
import { authenticateBuyer } from "./buyerStore";

const SESSION_KEY = "_DUENO_SESSION";
const ADMIN_SESSION_KEY = "_DUENO_ADMIN_AUTH";

export const getSession = (): PublicSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicSession;
  } catch {
    return null;
  }
};

export const saveSession = (session: PublicSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("dueno-session-updated"));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new CustomEvent("dueno-session-updated"));
};

export const login = (
  email: string,
  password: string
): { session: PublicSession; redirectTo: string } | null => {
  const admin = getDevAdminAccounts().find(
    (account) =>
      account.email.toLowerCase() === email.toLowerCase() &&
      account.password === password
  );
  if (admin) {
    const session: PublicSession = {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: "admin",
    };
    saveSession(session);
    localStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: "admin",
        token: admin.token,
      })
    );
    return { session, redirectTo: "/admin" };
  }

  const agent = authenticateAgent(email, password);
  if (agent) {
    const session: PublicSession = {
      id: agent.id,
      email: agent.email,
      firstName: agent.firstName,
      lastName: agent.lastName,
      role: "agent",
      agentStatus: agent.status,
    };
    saveSession(session);
    if (agent.status === "approved") {
      return { session, redirectTo: "/agent/dashboard" };
    }
    return { session, redirectTo: "/agent/pending-review" };
  }

  const buyer = authenticateBuyer(email, password);
  if (buyer) {
    const session: PublicSession = {
      id: buyer.id,
      email: buyer.email,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      role: "buyer",
    };
    saveSession(session);
    return { session, redirectTo: "/home" };
  }

  return null;
};

export const getPostLoginRedirect = (session: PublicSession): string => {
  if (session.role === "admin") return "/admin";
  if (session.role === "agent") {
    return session.agentStatus === "approved"
      ? "/agent/dashboard"
      : "/agent/pending-review";
  }
  return "/home";
};

export const subscribeSession = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-session-updated", handler);
  return () => window.removeEventListener("dueno-session-updated", handler);
};
