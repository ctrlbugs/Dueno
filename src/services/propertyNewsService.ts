import {
  ALL_CONTEXTUAL_IMAGES,
  CATEGORY_IMAGE_POOLS,
  KEYWORD_IMAGE_RULES,
  MARKET_NEWS_IMAGES,
} from "../data/newsContextImages";
import {
  getPropertyNewsSeed,
  REMOTE_STOCK_IMAGES,
} from "../data/propertyNewsFallback";
import type {
  PropertyNewsArticle,
  PropertyNewsCache,
  PropertyNewsSource,
} from "../types/propertyNews";

const CACHE_KEY = "dueno_property_news_v8";
const LIVE_IMAGE_CACHE_KEY = "dueno_live_news_images_v2";
const CACHE_VERSION = 8 as const;
export const HOME_NEWS_COUNT = 3;
const FETCH_POOL_SIZE = 12;
const FETCH_REQUEST_SIZE = 24;

const AFRICA_PROPERTY_QUERY =
  '("real estate" OR "property market" OR "property investment" OR housing OR mortgage OR rental OR landlord OR tenant OR "property developer" OR "home sales" OR "commercial property" OR "residential property" OR "land sale" OR proptech) AND (Africa OR Nigeria OR Lagos OR Abuja OR Ghana OR Kenya OR "South Africa")';

const SIMPLE_PROPERTY_QUERY =
  "real estate OR property market OR housing OR mortgage OR rental OR property investment OR property developer Nigeria Africa Lagos Abuja";

const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=real+estate+Nigeria+property+housing+market&hl=en-NG&gl=NG&ceid=NG:en",
  "https://news.google.com/rss/search?q=property+rent+mortgage+Lagos+Abuja+Nigeria&hl=en-NG&gl=NG&ceid=NG:en",
  "https://news.google.com/rss/search?q=African+real+estate+property+investment+housing&hl=en&gl=US&ceid=US:en",
];

const REAL_ESTATE_PRIMARY_PATTERN =
  /\b(real estate|property market|housing market|property sector|property sales|property prices|home prices|house prices|mortgage|rental market|rentals|landlord|tenant|homebuy|home buyer|buy a home|sell property|property developer|property development|residential property|commercial property|property investment|invest in property|housing project|affordable housing|property listing|estate agent|realtor|condo|condominium|apartment|flat for rent|house for sale|land for sale|property tax|proptech|office space|retail space|shortlet|serviced apartment|property rent|lease agreement|vacancy rate|nigeria property|nigerian property|lagos property|abuja property|port harcourt property|housing estate|gated community|property firm|property company|building permit|mixed-use development)\b/i;

const REAL_ESTATE_SECONDARY_PATTERN =
  /\b(property|properties|housing|homes|home|house|houses|land|estate|building|buildings|developer|rent|lease|rental|investment|urban development|infrastructure|smart city|subdivision|plot|plots|accommodation|residential|commercial|realty|tenement|housing sector|construction sector|property sector)\b/i;

const NON_REAL_ESTATE_PATTERN =
  /\b(police|constable|weapon|marksmanship|christian group|church|football|soccer|fifa|celebrity|movie|music|concert|recipe|fashion|beauty|healthcare|hospital|cricket|basketball|tennis|telenovela|kidnap|murder trial|telescopic handler|prnewswire market expected)\b/i;

const MIN_PREFERRED_RELEVANCE_SCORE = 3;
const MIN_FALLBACK_RELEVANCE_SCORE = 1;

const CATEGORY_RULES: { label: string; pattern: RegExp }[] = [
  { label: "Mortgages", pattern: /mortgage|home loan|financing|lending/i },
  { label: "Renting", pattern: /rent|rental|lease|tenant/i },
  { label: "Invest", pattern: /invest|investment|returns|market growth/i },
  {
    label: "Property Sales",
    pattern: /buy|buying|sales|sell|homebuy|purchase/i,
  },
  { label: "Moving", pattern: /moving|relocation|relocate/i },
  { label: "Artisan", pattern: /artisan|plumber|electrician|renovation/i },
  { label: "Cleaning", pattern: /cleaning|maintenance|upkeep/i },
];

const IRRELEVANT_IMAGE_URL_KEYWORDS = [
  "messi",
  "world-cup",
  "worldcup",
  "fifa",
  "football",
  "soccer",
  "argentina",
  "stadium",
  "cup-final",
  "goalkeeper",
  "premier-league",
  "champions-league",
  "cricket",
  "basketball",
  "tennis",
  "nfl",
  "nba",
  "celebrity",
  "entertainment",
  "hollywood",
  "grammy",
  "oscar",
  "red-carpet",
];

const LOGO_IMAGE_URL_KEYWORDS = [
  "logo",
  "/brand/",
  "company-logo",
  "placeholder",
  "default-image",
  "no-image",
  "avatar",
  "favicon",
  "sprite",
  "badge-icon",
];

const SPORTS_TEXT_PATTERN =
  /football|soccer|fifa|world cup|messi|argentina|sport|stadium|athlete|premier league/i;

const NEWS_CONTEXT_PATTERN =
  /property|real estate|housing|police|market|nigeria|kogi|invest|rent|mortgage|business|government|security|constable|lagos|abuja|africa|commercial|residential|estate|tenant|mortgage|loan|developer|construction|building|home|land|fct|tinubu/i;

const stripHtml = (value: string) => sanitizeNewsText(value);

const decodeHtmlEntities = (value: string) => {
  const namedEntities: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    hellip: "...",
    mdash: "—",
    ndash: "-",
  };

  const decoded = value.replace(
    /&(#x?[0-9a-f]+|[a-z]+);/gi,
    (match, entity: string) => {
      const normalized = entity.toLowerCase();

      if (normalized in namedEntities) {
        return namedEntities[normalized];
      }

      if (normalized.startsWith("#x")) {
        const codePoint = Number.parseInt(normalized.slice(2), 16);
        return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
      }

      if (normalized.startsWith("#")) {
        const codePoint = Number.parseInt(normalized.slice(1), 10);
        return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
      }

      return match;
    },
  );

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = decoded;
    return textarea.value;
  }

  return decoded;
};

export const sanitizeNewsText = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/&nbsp;?/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const hashNumber = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const inferCategory = (title: string, description: string) => {
  const text = `${title} ${description}`;
  const match = CATEGORY_RULES.find((rule) => rule.pattern.test(text));
  return match?.label ?? "Market News";
};

export const getArticleRelevanceScore = (
  article: Pick<PropertyNewsArticle, "title" | "description" | "category">,
): number => {
  const text = `${article.title} ${article.description}`;
  let score = 0;

  if (REAL_ESTATE_PRIMARY_PATTERN.test(text)) {
    score += 5;
  }
  if (REAL_ESTATE_SECONDARY_PATTERN.test(text)) {
    score += 2;
  }
  if (article.category !== "Market News") {
    score += 2;
  }
  if (
    /\b(nigeria|lagos|abuja|africa|african|ghana|kenya|south africa|port harcourt|ibadan|enugu|kogi)\b/i.test(
      text,
    ) &&
    REAL_ESTATE_SECONDARY_PATTERN.test(text)
  ) {
    score += 1;
  }
  if (
    NON_REAL_ESTATE_PATTERN.test(text) &&
    !REAL_ESTATE_PRIMARY_PATTERN.test(text) &&
    !REAL_ESTATE_SECONDARY_PATTERN.test(text)
  ) {
    score -= 8;
  }
  if (
    /\bmarket expected to hit\b|\bmarket research\b|\bcagr\b/i.test(text) &&
    !REAL_ESTATE_PRIMARY_PATTERN.test(text)
  ) {
    score -= 5;
  }

  return score;
};

const sortArticlesByRelevance = (
  left: { article: PropertyNewsArticle; score: number },
  right: { article: PropertyNewsArticle; score: number },
) => {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return (
    new Date(right.article.publishedAt).getTime() -
    new Date(left.article.publishedAt).getTime()
  );
};

const rankArticlesByRelevance = (
  articles: PropertyNewsArticle[],
): PropertyNewsArticle[] => {
  const scored = articles.map((article) => ({
    article,
    score: getArticleRelevanceScore(article),
  }));

  const preferred = scored
    .filter(({ score }) => score >= MIN_PREFERRED_RELEVANCE_SCORE)
    .sort(sortArticlesByRelevance);
  const fallback = scored
    .filter(
      ({ score }) =>
        score >= MIN_FALLBACK_RELEVANCE_SCORE &&
        score < MIN_PREFERRED_RELEVANCE_SCORE,
    )
    .sort(sortArticlesByRelevance);
  const lastResort = scored
    .filter(({ score }) => score < MIN_FALLBACK_RELEVANCE_SCORE)
    .sort((left, right) =>
      sortArticlesByRelevance(
        { article: left.article, score: 0 },
        { article: right.article, score: 0 },
      ),
    );

  return [...preferred, ...fallback, ...lastResort]
    .slice(0, FETCH_POOL_SIZE)
    .map(({ article }) => article);
};

/** Normalize publish timestamps from NewsAPI, GNews, NewsData, and RSS. */
export const parsePublishedDate = (value: unknown): string | null => {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  if (/^\d{10}$/.test(raw)) {
    const date = new Date(Number(raw) * 1000);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (/^\d{13}$/.test(raw)) {
    const date = new Date(Number(raw));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) {
    const date = new Date(`${raw.replace(" ", "T")}Z`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const extractPublishedAt = (article: Record<string, unknown>) => {
  const candidates = [
    article.publishedAt,
    article.pubDate,
    article.pub_date,
    article.date,
    article.dateTime,
    article.dateTimePub,
    article.updatedAt,
  ];

  for (const candidate of candidates) {
    const parsed = parsePublishedDate(candidate);
    if (parsed) {
      return parsed;
    }
  }

  return null;
};

const isPublishedInFuture = (isoDate: string) =>
  new Date(isoDate).getTime() > Date.now() + 5 * 60 * 1000;

const clampPublishedAt = (isoDate: string) => {
  if (isPublishedInFuture(isoDate)) {
    return new Date().toISOString();
  }
  return isoDate;
};

const normalizeArticleTimestamps = (
  article: PropertyNewsArticle,
): PropertyNewsArticle => {
  const parsed = parsePublishedDate(article.publishedAt);
  return {
    ...article,
    title: sanitizeNewsText(article.title),
    description:
      sanitizeNewsText(article.description) ||
      sanitizeNewsText(article.title),
    publishedAt: clampPublishedAt(parsed ?? article.publishedAt),
  };
};

export const isRemoteImageUrl = (url: string | undefined): url is string =>
  Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));

export const isTrustedArticleImage = (
  url: string,
  title: string,
  description: string,
): boolean => {
  const text = `${title} ${description}`.toLowerCase();
  const urlLower = url.toLowerCase();

  if (LOGO_IMAGE_URL_KEYWORDS.some((keyword) => urlLower.includes(keyword))) {
    return false;
  }

  const sportsInUrl = IRRELEVANT_IMAGE_URL_KEYWORDS.some((keyword) =>
    urlLower.includes(keyword),
  );
  const sportsInText = SPORTS_TEXT_PATTERN.test(text);
  if (sportsInUrl && !sportsInText) {
    return false;
  }

  const entertainmentInUrl = /celebrity|entertainment|concert|grammy|hollywood/i.test(
    urlLower,
  );
  if (entertainmentInUrl && NEWS_CONTEXT_PATTERN.test(text)) {
    return false;
  }

  return true;
};

const getContextualImageCandidates = (
  article: Pick<PropertyNewsArticle, "title" | "description" | "category">,
): string[] => {
  const text = `${article.title} ${article.description}`;

  for (const rule of KEYWORD_IMAGE_RULES) {
    if (rule.pattern.test(text)) {
      return rule.images;
    }
  }

  return (
    CATEGORY_IMAGE_POOLS[article.category] ??
    CATEGORY_IMAGE_POOLS["Market News"] ??
    MARKET_NEWS_IMAGES
  );
};

const getDailyRotationOffset = () =>
  Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 997;

const pickUniqueFromPool = (
  pool: string[],
  used: Set<string>,
  startIndex: number,
): string | null => {
  if (pool.length === 0) {
    return null;
  }

  for (let step = 0; step < pool.length; step += 1) {
    const candidate = pool[(startIndex + step) % pool.length];
    if (!used.has(candidate)) {
      return candidate;
    }
  }

  return null;
};

const buildFallbackImagePools = (
  article: Pick<PropertyNewsArticle, "title" | "description" | "category">,
) => {
  const contextual = getContextualImageCandidates(article);
  const liveBank = readLiveImageBank();
  return [...new Set([...contextual, ...liveBank, ...ALL_CONTEXTUAL_IMAGES])];
};

export const getContextualArticleImage = (
  article: Pick<PropertyNewsArticle, "title" | "description" | "category" | "imageUrl">,
  exclude: Set<string> = new Set(),
  slot = 0,
): string => {
  if (
    isRemoteImageUrl(article.imageUrl) &&
    isTrustedArticleImage(article.imageUrl, article.title, article.description) &&
    !exclude.has(article.imageUrl)
  ) {
    return article.imageUrl;
  }

  const rotation = getDailyRotationOffset();
  const startIndex = rotation + slot + hashNumber(article.title);
  const pools = buildFallbackImagePools(article);

  const picked = pickUniqueFromPool(
    pools.filter((url) => !exclude.has(url)),
    exclude,
    startIndex,
  );
  if (picked) {
    return picked;
  }

  const fallbackPool = ALL_CONTEXTUAL_IMAGES.filter((url) => !exclude.has(url));
  if (fallbackPool.length > 0) {
    return fallbackPool[(startIndex + slot) % fallbackPool.length];
  }

  return REMOTE_STOCK_IMAGES[(startIndex + slot) % REMOTE_STOCK_IMAGES.length];
};

const readLiveImageBank = (): string[] => {
  if (typeof window === "undefined") {
    return [...REMOTE_STOCK_IMAGES];
  }

  try {
    const raw = window.localStorage.getItem(LIVE_IMAGE_CACHE_KEY);
    if (!raw) {
      return [...REMOTE_STOCK_IMAGES];
    }

    const parsed = JSON.parse(raw) as string[];
    const images = parsed.filter(isRemoteImageUrl);
    return images.length > 0 ? images : [...REMOTE_STOCK_IMAGES];
  } catch {
    return [...REMOTE_STOCK_IMAGES];
  }
};

const persistLiveImageBank = (urls: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const incoming = urls.filter(
    (url) =>
      isRemoteImageUrl(url) &&
      !LOGO_IMAGE_URL_KEYWORDS.some((keyword) => url.toLowerCase().includes(keyword)) &&
      !IRRELEVANT_IMAGE_URL_KEYWORDS.some((keyword) =>
        url.toLowerCase().includes(keyword),
      ),
  );
  if (incoming.length === 0) {
    return;
  }

  const merged = [...new Set([...incoming, ...readLiveImageBank()])].slice(
    0,
    96,
  );
  window.localStorage.setItem(LIVE_IMAGE_CACHE_KEY, JSON.stringify(merged));
};

export const getFallbackLiveImage = (
  exclude: Set<string> = new Set(),
  slot = 0,
): string => {
  const contextualPool = ALL_CONTEXTUAL_IMAGES.filter((url) => !exclude.has(url));
  if (contextualPool.length > 0) {
    return contextualPool[slot % contextualPool.length];
  }

  const bank = readLiveImageBank().filter((url) => !exclude.has(url));
  if (bank.length > 0) {
    return bank[slot % bank.length];
  }

  return REMOTE_STOCK_IMAGES[slot % REMOTE_STOCK_IMAGES.length];
};

const assignUniqueArticleImages = (
  articles: PropertyNewsArticle[],
): PropertyNewsArticle[] => {
  const used = new Set<string>();
  const rotation = getDailyRotationOffset();

  return articles.map((article, index) => {
    const startIndex = rotation + index;

    if (
      isRemoteImageUrl(article.imageUrl) &&
      isTrustedArticleImage(article.imageUrl, article.title, article.description) &&
      !used.has(article.imageUrl)
    ) {
      used.add(article.imageUrl);
      return article;
    }

    const liveCandidate = pickUniqueFromPool(
      readLiveImageBank().filter((url) => !used.has(url)),
      used,
      startIndex,
    );
    if (liveCandidate) {
      used.add(liveCandidate);
      return { ...article, imageUrl: liveCandidate };
    }

    const contextualPools = buildFallbackImagePools(article);
    const fallback = pickUniqueFromPool(contextualPools, used, startIndex);
    const imageUrl =
      fallback ??
      getContextualArticleImage(article, used, index);

    used.add(imageUrl);
    return {
      ...article,
      imageUrl,
    };
  });
};

/** URLs already assigned to other articles on the same page. */
export const getArticleImageExclusions = (
  articles: PropertyNewsArticle[],
  currentIndex: number,
) =>
  articles
    .filter((_, index) => index !== currentIndex)
    .map((article) => article.imageUrl)
    .filter(isRemoteImageUrl);

const buildArticle = (
  input: Omit<PropertyNewsArticle, "id" | "category"> & { id?: string },
): PropertyNewsArticle | null => {
  const publishedAt = parsePublishedDate(input.publishedAt);
  if (!publishedAt) {
    return null;
  }

  return {
    id: input.id ?? hashString(input.sourceUrl || input.title),
    title: sanitizeNewsText(input.title),
    description: sanitizeNewsText(input.description) || sanitizeNewsText(input.title),
    imageUrl: input.imageUrl,
    category: inferCategory(input.title, input.description),
    publishedAt: clampPublishedAt(publishedAt),
    sourceUrl: input.sourceUrl,
    sourceName: input.sourceName,
  };
};

const pickLatestPublishedAt = (left: string, right: string) => {
  const leftTime = parsePublishedDate(left);
  const rightTime = parsePublishedDate(right);

  if (leftTime && rightTime) {
    return new Date(rightTime) > new Date(leftTime) ? rightTime : leftTime;
  }

  return rightTime ?? leftTime ?? left;
};

const isArticleImageTrusted = (article: PropertyNewsArticle) =>
  isRemoteImageUrl(article.imageUrl) &&
  isTrustedArticleImage(article.imageUrl, article.title, article.description);

const pickMergedArticleImage = (
  existing: PropertyNewsArticle,
  incoming: PropertyNewsArticle,
) => {
  if (isArticleImageTrusted(existing)) {
    return existing.imageUrl;
  }
  if (isArticleImageTrusted(incoming)) {
    return incoming.imageUrl;
  }
  return existing.imageUrl || incoming.imageUrl;
};

const mergeArticleBatch = (articles: PropertyNewsArticle[]) => {
  const map = new Map<string, PropertyNewsArticle>();

  articles.forEach((article) => {
    const key = article.title.trim().toLowerCase();
    if (!key) {
      return;
    }

    const existing = map.get(key);
    if (!existing) {
      map.set(key, article);
      return;
    }

    map.set(key, {
      ...existing,
      description: existing.description || article.description,
      imageUrl: pickMergedArticleImage(existing, article),
      publishedAt: pickLatestPublishedAt(
        existing.publishedAt,
        article.publishedAt,
      ),
      sourceName: existing.sourceName ?? article.sourceName,
    });
  });

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
};

const finalizePool = (articles: PropertyNewsArticle[]) => {
  const merged = mergeArticleBatch(
    articles
      .map(normalizeArticleTimestamps)
      .filter((article) => Boolean(parsePublishedDate(article.publishedAt))),
  );

  const categorized = merged.map((article) => ({
    ...normalizeArticleTimestamps(article),
    category: inferCategory(article.title, article.description),
  }));

  const ranked = rankArticlesByRelevance(categorized);

  const apiImages = ranked
    .map((article) => article.imageUrl)
    .filter(
      (url) =>
        isRemoteImageUrl(url) &&
        !LOGO_IMAGE_URL_KEYWORDS.some((keyword) =>
          url.toLowerCase().includes(keyword),
        ),
    );
  persistLiveImageBank(apiImages);

  return assignUniqueArticleImages(ranked);
};

const readCache = (): PropertyNewsCache | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PropertyNewsCache;
    if (
      parsed.version !== CACHE_VERSION ||
      !Array.isArray(parsed.articles) ||
      parsed.articles.length === 0
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const writeCache = (
  articles: PropertyNewsArticle[],
  source: PropertyNewsSource,
) => {
  if (typeof window === "undefined" || articles.length === 0) {
    return;
  }

  const liveImages = articles.map((article) => article.imageUrl).filter(isRemoteImageUrl);
  persistLiveImageBank(liveImages);

  const payload: PropertyNewsCache = {
    version: CACHE_VERSION,
    articles,
    liveImages: readLiveImageBank(),
    fetchedAt: new Date().toISOString(),
    source,
  };

  window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
};

const fetchNewsApiArticles = async (): Promise<PropertyNewsArticle[]> => {
  if (!import.meta.env.VITE_NEWS_API_KEY) {
    throw new Error("NewsAPI key missing");
  }

  const params = new URLSearchParams({
    q: AFRICA_PROPERTY_QUERY,
    language: "en",
    sortBy: "publishedAt",
    pageSize: String(FETCH_REQUEST_SIZE),
  });

  const response = await fetch(
    `/api/property-news/everything?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`NewsAPI failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { articles?: unknown[] };
  const articles: PropertyNewsArticle[] = [];

  (payload.articles ?? []).forEach((item) => {
    const article = item as Record<string, unknown>;
    const title = String(article.title ?? "").trim();
    const description = stripHtml(
      String(article.description ?? article.content ?? ""),
    );
    const sourceUrl = String(article.url ?? "").trim();
    const source = article.source as Record<string, unknown> | undefined;

    if (!title || !sourceUrl) {
      return;
    }

    const built = buildArticle({
      title,
      description: description || title,
      imageUrl: String(article.urlToImage ?? ""),
      publishedAt:
        extractPublishedAt(article) ??
        parsePublishedDate(article.publishedAt) ??
        "",
      sourceUrl,
      sourceName: source?.name ? String(source.name) : undefined,
    });

    if (built) {
      articles.push(built);
    }
  });

  if (articles.length === 0) {
    throw new Error("NewsAPI returned no articles");
  }

  return articles;
};

const fetchGNewsArticles = async (): Promise<PropertyNewsArticle[]> => {
  if (!import.meta.env.VITE_GNEWS_API_KEY) {
    throw new Error("GNews key missing");
  }

  const params = new URLSearchParams({
    q: SIMPLE_PROPERTY_QUERY,
    lang: "en",
    max: String(FETCH_REQUEST_SIZE),
    sortby: "publishedAt",
  });

  const response = await fetch(`/api/gnews/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`GNews failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { articles?: unknown[] };
  const articles: PropertyNewsArticle[] = [];

  (payload.articles ?? []).forEach((item) => {
    const article = item as Record<string, unknown>;
    const title = String(article.title ?? "").trim();
    const description = stripHtml(String(article.description ?? ""));
    const sourceUrl = String(article.url ?? "").trim();
    const source = article.source as Record<string, unknown> | undefined;

    if (!title || !sourceUrl) {
      return;
    }

    const built = buildArticle({
      title,
      description: description || title,
      imageUrl: String(article.image ?? ""),
      publishedAt:
        extractPublishedAt(article) ??
        parsePublishedDate(article.publishedAt) ??
        "",
      sourceUrl,
      sourceName: source?.name ? String(source.name) : undefined,
    });

    if (built) {
      articles.push(built);
    }
  });

  if (articles.length === 0) {
    throw new Error("GNews returned no articles");
  }

  return articles;
};

const fetchNewsDataArticles = async (): Promise<PropertyNewsArticle[]> => {
  if (!import.meta.env.VITE_NEWSDATA_API_KEY) {
    throw new Error("NewsData key missing");
  }

  const params = new URLSearchParams({
    q: SIMPLE_PROPERTY_QUERY,
    language: "en",
    category: "business",
    timeframe: "7",
  });

  const response = await fetch(`/api/newsdata/news?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`NewsData failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { results?: unknown[] };
  const articles: PropertyNewsArticle[] = [];

  (payload.results ?? []).forEach((item) => {
    const article = item as Record<string, unknown>;
    const title = String(article.title ?? "").trim();
    const description = stripHtml(
      String(article.description ?? article.content ?? ""),
    );
    const sourceUrl = String(article.link ?? "").trim();

    if (!title || !sourceUrl) {
      return;
    }

    const built = buildArticle({
      title,
      description: description || title,
      imageUrl: String(article.image_url ?? ""),
      publishedAt:
        extractPublishedAt(article) ??
        parsePublishedDate(article.pubDate) ??
        "",
      sourceUrl,
      sourceName: article.source_id ? String(article.source_id) : undefined,
    });

    if (built) {
      articles.push(built);
    }
  });

  if (articles.length === 0) {
    throw new Error("NewsData returned no articles");
  }

  return articles;
};

const extractImageFromHtml = (html: string) => {
  const srcMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (srcMatch?.[1] && isRemoteImageUrl(srcMatch[1])) {
    return srcMatch[1];
  }
  return undefined;
};

const extractRssImage = (item: Element) => {
  const enclosureUrl = item.querySelector("enclosure")?.getAttribute("url");
  if (isRemoteImageUrl(enclosureUrl ?? undefined)) {
    return enclosureUrl;
  }

  const mediaNodes = item.getElementsByTagName("*");
  for (const node of Array.from(mediaNodes)) {
    if (
      node.tagName.toLowerCase().includes("content") ||
      node.tagName.toLowerCase().includes("thumbnail")
    ) {
      const mediaUrl = node.getAttribute("url") ?? node.getAttribute("href");
      if (isRemoteImageUrl(mediaUrl ?? undefined)) {
        return mediaUrl;
      }
    }
  }

  const descriptionHtml = item.querySelector("description")?.textContent ?? "";
  return extractImageFromHtml(descriptionHtml);
};

const parseRssItems = (xml: string): PropertyNewsArticle[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  const articles: PropertyNewsArticle[] = [];

  items.forEach((item) => {
    const title = stripHtml(item.querySelector("title")?.textContent ?? "");
    const link = item.querySelector("link")?.textContent?.trim() ?? "";
    const pubDate = item.querySelector("pubDate")?.textContent ?? "";
    const descriptionHtml = item.querySelector("description")?.textContent ?? "";
    const description = stripHtml(descriptionHtml || title);
    const sourceName =
      item.querySelector("source")?.textContent?.trim() ?? undefined;
    const imageUrl = extractRssImage(item) ?? "";

    if (!title || !link) {
      return;
    }

    const publishedAt =
      parsePublishedDate(pubDate) ??
      parsePublishedDate(item.querySelector("updated")?.textContent ?? "");

    if (!publishedAt) {
      return;
    }

    const built = buildArticle({
      title,
      description,
      imageUrl,
      publishedAt,
      sourceUrl: link,
      sourceName,
    });

    if (built) {
      articles.push(built);
    }
  });

  return articles;
};

const fetchRssFeed = async (feedUrl: string) => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`RSS feed failed with status ${response.status}`);
  }

  return parseRssItems(await response.text());
};

const fetchRssArticles = async (): Promise<PropertyNewsArticle[]> => {
  const batches = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchRssFeed(feed)),
  );

  const articles = batches.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (articles.length === 0) {
    throw new Error("RSS feeds returned no articles");
  }

  return articles;
};

const fetchLiveArticles = async (): Promise<{
  articles: PropertyNewsArticle[];
  source: PropertyNewsSource;
}> => {
  const fetchers: {
    source: PropertyNewsSource;
    run: () => Promise<PropertyNewsArticle[]>;
  }[] = [];

  if (import.meta.env.VITE_NEWS_API_KEY) {
    fetchers.push({ source: "newsapi", run: fetchNewsApiArticles });
  }
  if (import.meta.env.VITE_GNEWS_API_KEY) {
    fetchers.push({ source: "gnews", run: fetchGNewsArticles });
  }
  if (import.meta.env.VITE_NEWSDATA_API_KEY) {
    fetchers.push({ source: "newsdata", run: fetchNewsDataArticles });
  }
  fetchers.push({ source: "rss", run: fetchRssArticles });

  const results = await Promise.allSettled(
    fetchers.map((fetcher) => fetcher.run()),
  );
  const mergedPool: PropertyNewsArticle[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      mergedPool.push(...result.value);
    }
  });

  if (mergedPool.length === 0) {
    throw new Error("All news sources failed");
  }

  const articles = finalizePool(mergedPool);
  const usedApiSource = results.some(
    (result, index) =>
      result.status === "fulfilled" && fetchers[index].source !== "rss",
  );

  return {
    articles,
    source: usedApiSource ? "merged" : "rss",
  };
};

export const getSeedArticles = () => finalizePool(getPropertyNewsSeed());

export const loadPropertyNews = async (): Promise<{
  articles: PropertyNewsArticle[];
  status: "live" | "cached" | "seed";
  lastUpdated: string | null;
}> => {
  const cache = readCache();

  try {
    const { articles, source } = await fetchLiveArticles();
    writeCache(articles, source);

    return {
      articles,
      status: "live",
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    if (cache) {
      persistLiveImageBank(cache.liveImages ?? []);
      return {
        articles: finalizePool(cache.articles),
        status: "cached",
        lastUpdated: cache.fetchedAt,
      };
    }

    const seed = getSeedArticles();
    writeCache(seed, "seed");

    return {
      articles: seed,
      status: "seed",
      lastUpdated: new Date().toISOString(),
    };
  }
};

export const getInitialPropertyNews = (): {
  articles: PropertyNewsArticle[];
  status: "cached" | "seed" | "loading";
  lastUpdated: string | null;
} => {
  const cache = readCache();

  if (cache) {
    persistLiveImageBank(cache.liveImages ?? []);
    return {
      articles: finalizePool(cache.articles),
      status: "cached",
      lastUpdated: cache.fetchedAt,
    };
  }

  return {
    articles: getSeedArticles(),
    status: "seed",
    lastUpdated: null,
  };
};

export const getArticleById = (
  articles: PropertyNewsArticle[],
  articleId?: string | null,
) => {
  if (!articleId) {
    return null;
  }

  return articles.find((article) => article.id === articleId) ?? null;
};

export const getRelatedArticles = (
  articles: PropertyNewsArticle[],
  articleId: string,
  limit = 5,
) =>
  articles.filter((article) => article.id !== articleId).slice(0, limit);

export const getGalleryImages = (
  article: PropertyNewsArticle,
  articles: PropertyNewsArticle[],
  count = 4,
) => {
  const images: string[] = [];
  const used = new Set<string>();

  const pushImage = (url: string | undefined) => {
    if (!isRemoteImageUrl(url) || used.has(url) || images.length >= count) {
      return;
    }
    used.add(url);
    images.push(url);
  };

  pushImage(
    isTrustedArticleImage(article.imageUrl, article.title, article.description)
      ? article.imageUrl
      : getContextualArticleImage(article, used, 0),
  );

  articles.forEach((item, index) => {
    if (item.id !== article.id) {
      pushImage(
        getContextualArticleImage(item, used, index + 1),
      );
    }
  });

  let slot = 0;
  while (images.length < count) {
    pushImage(getContextualArticleImage(article, used, slot + 2));
    slot += 1;
  }

  return images.slice(0, count);
};

export const getHomepageArticles = (articles: PropertyNewsArticle[]) =>
  articles.slice(0, HOME_NEWS_COUNT);

export const formatNewsDate = (isoDate: string) => {
  const normalized = parsePublishedDate(isoDate);
  if (!normalized) {
    return "";
  }

  const date = new Date(normalized);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (diffMs >= 0 && diffMs < oneDayMs) {
    return "Today";
  }

  if (diffMs >= oneDayMs && diffMs < oneDayMs * 2) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
};

export const isExternalNewsUrl = (url: string) =>
  url.startsWith("http://") || url.startsWith("https://");
