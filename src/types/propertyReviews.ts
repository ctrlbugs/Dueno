export type ReviewReactionType = "helpful" | "not_helpful" | "love";

export type ReviewReactions = Record<ReviewReactionType, string[]>;

export type PropertyReviewReply = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole?: "buyer" | "agent" | "admin";
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  reactions: ReviewReactions;
};

export type PropertyReview = {
  id: string;
  propertyId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  reactions: ReviewReactions;
  replies: PropertyReviewReply[];
};

export type PropertyFeedback = {
  id: string;
  propertyId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  feedbackType: "general" | "issue" | "praise";
  message: string;
  createdAt: string;
};

export type ReviewSummary = {
  total: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export const emptyReactions = (): ReviewReactions => ({
  helpful: [],
  not_helpful: [],
  love: [],
});
