import { getDevAdminAccounts } from "../../config/devAccounts";
import type { AdminUser } from "../types";

const SESSION_KEY = "_DUENO_ADMIN_AUTH";

export const loginAdmin = (
  email: string,
  password: string
): AdminUser | null => {
  const account = getDevAdminAccounts().find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );
  if (!account) return null;

  const { password: _, ...sessionUser } = account;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logoutAdmin = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getAdminSession = (): AdminUser | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
};
