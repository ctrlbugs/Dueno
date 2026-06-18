import { getDevSeedBuyers } from "../config/devAccounts";
import type {
  PropertyFeedback,
  PropertyReview,
  PropertyReviewReply,
  ReviewReactionType,
  ReviewReactions,
  ReviewSummary,
} from "../types/propertyReviews";
import { emptyReactions } from "../types/propertyReviews";

const REVIEWS_KEY = "_DUENO_PROPERTY_REVIEWS";
const FEEDBACK_KEY = "_DUENO_PROPERTY_FEEDBACK";
const ENGAGEMENT_KEY = "_DUENO_PROPERTY_ENGAGEMENT";
const VISITOR_KEY = "_DUENO_VISITOR_ID";

type EngagementState = {
  saved: Record<string, string[]>;
  bookmarked: Record<string, string[]>;
  visits: Record<string, number>;
};

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("dueno-reviews-updated"));
};

export const subscribePropertyReviews = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-reviews-updated", handler);
  return () => window.removeEventListener("dueno-reviews-updated", handler);
};

export const getVisitorId = (): string => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = `visitor-${crypto.randomUUID()}`;
  localStorage.setItem(VISITOR_KEY, id);
  return id;
};

const readReviews = (): PropertyReview[] => readJson(REVIEWS_KEY, []);
const writeReviews = (reviews: PropertyReview[]) => writeJson(REVIEWS_KEY, reviews);

const readFeedback = (): PropertyFeedback[] => readJson(FEEDBACK_KEY, []);
const writeFeedback = (items: PropertyFeedback[]) => writeJson(FEEDBACK_KEY, items);

const readEngagement = (): EngagementState =>
  readJson(ENGAGEMENT_KEY, { saved: {}, bookmarked: {}, visits: {} });

const writeEngagement = (state: EngagementState) =>
  writeJson(ENGAGEMENT_KEY, state);

const seedReviews = (): PropertyReview[] => {
  const now = Date.now();
  const seedBuyerEmail =
    getDevSeedBuyers()[0]?.email ?? "guest@dueno.local";
  return [
    {
      id: "review-seed-1",
      propertyId: "1",
      authorId: "buyer-seed",
      authorName: "Adaeze Okonkwo",
      authorEmail: seedBuyerEmail,
      rating: 5,
      title: "Excellent property and location",
      body: "The layout, finish, and neighbourhood exceeded our expectations. Viewing and paperwork were smooth.",
      createdAt: new Date(now - 86400000 * 3).toISOString(),
      reactions: {
        helpful: ["visitor-a", "visitor-b"],
        not_helpful: [],
        love: ["visitor-c"],
      },
      replies: [],
    },
    {
      id: "review-seed-2",
      propertyId: "1",
      authorId: "visitor-seed",
      authorName: "Michael Adeyemi",
      authorEmail: "michael@example.com",
      rating: 4,
      title: "Great value for Abuja",
      body: "Spacious rooms and good security. Would recommend scheduling a second visit before making an offer.",
      createdAt: new Date(now - 86400000 * 6).toISOString(),
      reactions: {
        helpful: ["visitor-d"],
        not_helpful: ["visitor-e"],
        love: [],
      },
      replies: [],
    },
  ];
};

const ensureReviews = (): PropertyReview[] => {
  const existing = readReviews();
  if (existing.length > 0) return existing;
  const seeded = seedReviews();
  writeReviews(seeded);
  return seeded;
};

export const getReviewsForProperty = (propertyId: string): PropertyReview[] =>
  ensureReviews()
    .filter((review) => review.propertyId === propertyId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

export const getReviewSummary = (
  propertyId: string,
  fallbackRating = 5,
): ReviewSummary => {
  const reviews = getReviewsForProperty(propertyId);
  const distribution: ReviewSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (!reviews.length) {
    return {
      total: 0,
      average: fallbackRating,
      distribution,
    };
  }

  reviews.forEach((review) => {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[star] += 1;
  });

  const total = reviews.length;
  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  return { total, average, distribution };
};

export const addPropertyReview = (input: {
  propertyId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  body: string;
}) => {
  const review: PropertyReview = {
    id: `review-${crypto.randomUUID()}`,
    propertyId: input.propertyId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorEmail: input.authorEmail,
    rating: input.rating,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    reactions: emptyReactions(),
    replies: [],
  };
  writeReviews([review, ...ensureReviews()]);
  return review;
};

export const addReviewReply = (input: {
  reviewId: string;
  authorId: string;
  authorName: string;
  authorRole?: PropertyReviewReply["authorRole"];
  rating: number;
  title: string;
  body: string;
}) => {
  const reviews = ensureReviews();
  const index = reviews.findIndex((review) => review.id === input.reviewId);
  if (index === -1) return undefined;

  const reply: PropertyReviewReply = {
    id: `reply-${crypto.randomUUID()}`,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    rating: input.rating,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    reactions: emptyReactions(),
  };

  reviews[index] = {
    ...reviews[index],
    replies: [...reviews[index].replies, reply],
  };
  writeReviews(reviews);
  return reply;
};

const toggleInList = (list: string[], voterId: string) =>
  list.includes(voterId)
    ? list.filter((id) => id !== voterId)
    : [...list, voterId];

const applyReactionToggle = (
  reactions: ReviewReactions,
  reaction: ReviewReactionType,
  voterId: string,
): ReviewReactions => {
  const next = {
    helpful: [...reactions.helpful],
    not_helpful: [...reactions.not_helpful],
    love: [...reactions.love],
  };

  if (reaction === "helpful") {
    next.helpful = toggleInList(next.helpful, voterId);
    next.not_helpful = next.not_helpful.filter((id) => id !== voterId);
  } else if (reaction === "not_helpful") {
    next.not_helpful = toggleInList(next.not_helpful, voterId);
    next.helpful = next.helpful.filter((id) => id !== voterId);
  } else {
    next.love = toggleInList(next.love, voterId);
  }

  return next;
};

export const toggleReviewReaction = (
  reviewId: string,
  reaction: ReviewReactionType,
  voterId: string,
  replyId?: string,
) => {
  const reviews = ensureReviews();
  const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
  if (reviewIndex === -1) return;

  if (replyId) {
    const replies = reviews[reviewIndex].replies.map((reply) =>
      reply.id === replyId
        ? {
            ...reply,
            reactions: applyReactionToggle(reply.reactions, reaction, voterId),
          }
        : reply,
    );
    reviews[reviewIndex] = { ...reviews[reviewIndex], replies };
  } else {
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      reactions: applyReactionToggle(
        reviews[reviewIndex].reactions,
        reaction,
        voterId,
      ),
    };
  }

  writeReviews(reviews);
};

export const getUserReaction = (
  reactions: ReviewReactions,
  voterId: string,
): ReviewReactionType | null => {
  if (reactions.helpful.includes(voterId)) return "helpful";
  if (reactions.not_helpful.includes(voterId)) return "not_helpful";
  if (reactions.love.includes(voterId)) return "love";
  return null;
};

export const addPropertyFeedback = (input: {
  propertyId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  feedbackType: PropertyFeedback["feedbackType"];
  message: string;
}) => {
  const item: PropertyFeedback = {
    id: `feedback-${crypto.randomUUID()}`,
    propertyId: input.propertyId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorEmail: input.authorEmail,
    feedbackType: input.feedbackType,
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };
  writeFeedback([item, ...readFeedback()]);
  return item;
};

export const getFeedbackForProperty = (propertyId: string) =>
  readFeedback()
    .filter((item) => item.propertyId === propertyId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

export const incrementPropertyVisit = (propertyId: string) => {
  const state = readEngagement();
  state.visits[propertyId] = (state.visits[propertyId] ?? 0) + 1;
  writeEngagement(state);
};

export const getPropertyVisitCount = (propertyId: string) =>
  readEngagement().visits[propertyId] ?? 0;

export const togglePropertySaved = (propertyId: string, userId: string) => {
  const state = readEngagement();
  const list = state.saved[propertyId] ?? [];
  state.saved[propertyId] = toggleInList(list, userId);
  writeEngagement(state);
  return state.saved[propertyId].includes(userId);
};

export const togglePropertyBookmark = (propertyId: string, userId: string) => {
  const state = readEngagement();
  const list = state.bookmarked[propertyId] ?? [];
  state.bookmarked[propertyId] = toggleInList(list, userId);
  writeEngagement(state);
  return state.bookmarked[propertyId].includes(userId);
};

export const isPropertySaved = (propertyId: string, userId: string) =>
  (readEngagement().saved[propertyId] ?? []).includes(userId);

export const isPropertyBookmarked = (propertyId: string, userId: string) =>
  (readEngagement().bookmarked[propertyId] ?? []).includes(userId);

export const getSavedPropertyIdsForUser = (userId: string) =>
  Object.entries(readEngagement().saved)
    .filter(([, users]) => users.includes(userId))
    .map(([propertyId]) => propertyId);

export const getSavedPropertyCountForUser = (userId: string) =>
  getSavedPropertyIdsForUser(userId).length;
