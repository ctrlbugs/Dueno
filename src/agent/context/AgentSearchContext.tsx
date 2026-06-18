import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AgentSearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
};

const AgentSearchContext = createContext<AgentSearchContextValue | null>(null);

export const AgentSearchProvider = ({ children }: { children: ReactNode }) => {
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
    <AgentSearchContext.Provider value={value}>
      {children}
    </AgentSearchContext.Provider>
  );
};

export const useAgentSearch = () => {
  const context = useContext(AgentSearchContext);
  if (!context) {
    throw new Error("useAgentSearch must be used within AgentSearchProvider");
  }
  return context;
};
