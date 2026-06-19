export interface PropertyNewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  sourceUrl: string;
  sourceName?: string;
}

export type PropertyNewsSource =
  | "newsapi"
  | "gnews"
  | "newsdata"
  | "rss"
  | "merged"
  | "seed";

export interface PropertyNewsCache {
  version: 8;
  articles: PropertyNewsArticle[];
  liveImages: string[];
  fetchedAt: string;
  source: PropertyNewsSource;
}

export type PropertyNewsStatus = "loading" | "live" | "cached" | "seed";

export interface PropertyNewsState {
  articles: PropertyNewsArticle[];
  status: PropertyNewsStatus;
  lastUpdated: string | null;
}
