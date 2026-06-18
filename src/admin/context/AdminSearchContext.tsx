import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminSearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
};

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export const AdminSearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQueryState] = useState("");

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState("");
  }, []);

  const value = useMemo(
    () => ({ query, setQuery, clearQuery }),
    [query, setQuery, clearQuery],
  );

  return (
    <AdminSearchContext.Provider value={value}>
      {children}
    </AdminSearchContext.Provider>
  );
};

export const useAdminSearch = () => {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error("useAdminSearch must be used within AdminSearchProvider");
  }
  return context;
};
