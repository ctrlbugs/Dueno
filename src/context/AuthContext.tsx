import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PublicSession } from "../types/user";
import {
  clearSession,
  getSession,
  login as loginService,
  subscribeSession,
} from "../services/authService";

type AuthContextValue = {
  user: PublicSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicSession | null>(() => getSession());

  const refresh = useCallback(() => {
    setUser(getSession());
  }, []);

  useEffect(() => subscribeSession(refresh), [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const result = loginService(email, password);
    if (!result) return null;
    setUser(result.session);
    return result.redirectTo;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refresh,
    }),
    [user, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
