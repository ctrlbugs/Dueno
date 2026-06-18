import { useEffect, useState } from "react";
import {
  getInitialPropertyNews,
  loadPropertyNews,
} from "../services/propertyNewsService";
import type { PropertyNewsState } from "../types/propertyNews";

export const usePropertyNews = () => {
  const [state, setState] = useState<PropertyNewsState>(() => {
    const initial = getInitialPropertyNews();
    return {
      articles: initial.articles,
      status: initial.status === "seed" ? "seed" : "cached",
      lastUpdated: initial.lastUpdated,
    };
  });

  useEffect(() => {
    let cancelled = false;

    const syncNews = async () => {
      const result = await loadPropertyNews();

      if (!cancelled) {
        setState({
          articles: result.articles,
          status: result.status,
          lastUpdated: result.lastUpdated,
        });
      }
    };

    syncNews();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
