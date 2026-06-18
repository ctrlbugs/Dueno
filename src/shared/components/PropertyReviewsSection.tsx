import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Modal } from "react-bootstrap";
import type {
  PropertyReview,
  ReviewReactionType,
  ReviewReactions,
} from "../../types/propertyReviews";
import { getSession } from "../../services/authService";
import {
  addPropertyFeedback,
  addPropertyReview,
  addReviewReply,
  getFeedbackForProperty,
  getReviewsForProperty,
  getReviewSummary,
  getUserReaction,
  getVisitorId,
  subscribePropertyReviews,
  toggleReviewReaction,
} from "../../services/propertyReviewStore";

type Props = {
  propertyId: string;
  fallbackRating?: number;
};

const INITIALS_COLORS = [
  "#4f46e5",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const colorForName = (name: string) =>
  INITIALS_COLORS[
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      INITIALS_COLORS.length
  ];

const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
};

const StarDisplay = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    stars.push(
      <i
        key={i}
        className={`material-icons-outlined text-warning${filled || half ? "" : " opacity-50"}`}
      >
        {filled ? "star" : half ? "star_half" : "star"}
      </i>,
    );
  }
  return <div className="d-flex align-items-center justify-content-center">{stars}</div>;
};

const StarPicker = ({
  value,
  onChange,
  name,
}: {
  value: number;
  onChange: (rating: number) => void;
  name: string;
}) => (
  <div className="selection-wrap">
    <div className="d-inline-block">
      <div className="rating-selction">
        {[5, 4, 3, 2, 1].map((star) => (
          <span key={star}>
            <input
              type="radio"
              name={name}
              value={star}
              id={`${name}-${star}`}
              checked={value === star}
              onChange={() => onChange(star)}
            />
            <label htmlFor={`${name}-${star}`}>
              <i className="fa-solid fa-star" />
            </label>
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ReviewReactionBar = ({
  reactions,
  voterId,
  onToggle,
}: {
  reactions: ReviewReactions;
  voterId: string;
  onToggle: (type: ReviewReactionType) => void;
}) => {
  const active = getUserReaction(reactions, voterId);

  const buttonClass = (type: ReviewReactionType, danger = false) => {
    const isActive = active === type;
    if (danger) {
      return `btn btn-link p-0 mb-0 d-flex align-items-center fs-14 text-decoration-none ${isActive ? "text-danger" : "text-body"}`;
    }
    return `btn btn-link p-0 mb-0 d-flex align-items-center fs-14 text-decoration-none ${isActive ? "text-primary" : "text-body"}`;
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <button
        type="button"
        className={buttonClass("helpful")}
        onClick={() => onToggle("helpful")}
        aria-pressed={active === "helpful"}
      >
        <i className="material-icons-outlined me-1 fs-14">thumb_up</i>
        {reactions.helpful.length}
      </button>
      <button
        type="button"
        className={buttonClass("not_helpful")}
        onClick={() => onToggle("not_helpful")}
        aria-pressed={active === "not_helpful"}
      >
        <i className="material-icons-outlined me-1 fs-14">thumb_down</i>
        {reactions.not_helpful.length}
      </button>
      <button
        type="button"
        className={buttonClass("love", true)}
        onClick={() => onToggle("love")}
        aria-pressed={active === "love"}
      >
        <i className="material-icons-outlined me-1 fs-14">favorite</i>
        {reactions.love.length}
      </button>
    </div>
  );
};

const AuthorAvatar = ({ name }: { name: string }) => (
  <div
    className="avatar avatar-lg d-flex align-items-center justify-content-center rounded-circle text-white fw-semibold"
    style={{ backgroundColor: colorForName(name), minWidth: 48, minHeight: 48 }}
  >
    {getInitials(name)}
  </div>
);

const useReviewAuthor = () => {
  const session = getSession();
  const visitorId = getVisitorId();

  if (session) {
    return {
      authorId: session.id,
      authorName: `${session.firstName} ${session.lastName}`.trim(),
      authorEmail: session.email,
      authorRole: session.role,
    };
  }

  return {
    authorId: visitorId,
    authorName: "Guest Visitor",
    authorEmail: "",
    authorRole: undefined as "buyer" | "agent" | "admin" | undefined,
  };
};

const ReviewCard = ({
  review,
  voterId,
  onReply,
  onReaction,
  nested = false,
}: {
  review: PropertyReview | PropertyReview["replies"][number];
  voterId: string;
  onReply?: () => void;
  onReaction: (type: ReviewReactionType, replyId?: string) => void;
  nested?: boolean;
}) => {
  const isReply = !("replies" in review);
  const replyId = isReply ? review.id : undefined;

  return (
    <div
      className={`card shadow-none review-items ${nested ? "bg-light border-0 mb-0 ms-lg-5 ms-md-5 ms-3" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex align-center flex-wrap justify-content-between gap-1 mb-2">
          <div className="d-flex align-center gap-2 flex-wrap">
            <AuthorAvatar name={review.authorName} />
            <div>
              <h6 className="fs-16 fw-medium mb-1">{review.authorName}</h6>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <p className="fs-14 mb-0 text-body">
                  {formatRelativeTime(review.createdAt)}
                </p>
                <i className="fa-solid fa-circle text-body" />
                <StarDisplay rating={review.rating} />
                {review.title && (
                  <>
                    <p className="fs-14 mb-0 text-body">{review.title}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {onReply && (
            <button
              type="button"
              className="btn d-inline-flex align-items-center fs-13 fw-semibold reply-btn"
              onClick={onReply}
            >
              <i className="material-icons-outlined text-dark me-1">repeat</i>
              Reply
            </button>
          )}
        </div>
        <p className="mb-2 text-body">{review.body}</p>
        <ReviewReactionBar
          reactions={review.reactions}
          voterId={voterId}
          onToggle={(type) => onReaction(type, replyId)}
        />
      </div>
    </div>
  );
};

export const PropertyRatingDisplay = ({
  propertyId,
  fallbackRating = 5,
  className = "",
}: {
  propertyId: string;
  fallbackRating?: number;
  className?: string;
}) => {
  const [summary, setSummary] = useState(() =>
    getReviewSummary(propertyId, fallbackRating),
  );

  useEffect(() => {
    const refresh = () =>
      setSummary(getReviewSummary(propertyId, fallbackRating));
    refresh();
    return subscribePropertyReviews(refresh);
  }, [propertyId, fallbackRating]);

  const displayRating =
    summary.total > 0 ? summary.average.toFixed(1) : fallbackRating.toFixed(1);

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <StarDisplay rating={Number(displayRating)} />
      <span className="text-white ms-1">{displayRating}</span>
      {summary.total > 0 && (
        <span className="text-white-50 ms-1 fs-14">({summary.total})</span>
      )}
    </div>
  );
};

const PropertyReviewsSection = ({
  propertyId,
  fallbackRating = 5,
}: Props) => {
  const voterId = getVisitorId();
  const defaultAuthor = useReviewAuthor();

  const [reviews, setReviews] = useState(() => getReviewsForProperty(propertyId));
  const [feedback, setFeedback] = useState(() =>
    getFeedbackForProperty(propertyId),
  );
  const [showAll, setShowAll] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    body: "",
    authorName: defaultAuthor.authorName,
    authorEmail: defaultAuthor.authorEmail,
  });

  const [replyForm, setReplyForm] = useState({
    rating: 5,
    title: "",
    body: "",
    authorName: defaultAuthor.authorName,
  });

  const [feedbackForm, setFeedbackForm] = useState({
    feedbackType: "general" as "general" | "issue" | "praise",
    message: "",
    authorName: defaultAuthor.authorName,
    authorEmail: defaultAuthor.authorEmail,
  });

  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const refresh = () => {
      setReviews(getReviewsForProperty(propertyId));
      setFeedback(getFeedbackForProperty(propertyId));
    };
    refresh();
    return subscribePropertyReviews(refresh);
  }, [propertyId]);

  const summary = useMemo(
    () => getReviewSummary(propertyId, fallbackRating),
    [propertyId, fallbackRating, reviews],
  );

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  const progressWidth = (star: 1 | 2 | 3 | 4 | 5) => {
    if (!summary.total) return 0;
    return Math.round((summary.distribution[star] / summary.total) * 100);
  };

  const handleSubmitReview = (event: FormEvent) => {
    event.preventDefault();
    if (!reviewForm.body.trim()) {
      setSubmitMessage("Please write your review before submitting.");
      return;
    }

    const session = getSession();
    addPropertyReview({
      propertyId,
      authorId: session?.id ?? voterId,
      authorName:
        reviewForm.authorName.trim() || defaultAuthor.authorName,
      authorEmail:
        reviewForm.authorEmail.trim() || defaultAuthor.authorEmail || "guest@dueno.local",
      rating: reviewForm.rating,
      title: reviewForm.title,
      body: reviewForm.body,
    });

    setReviewForm({
      rating: 5,
      title: "",
      body: "",
      authorName: defaultAuthor.authorName,
      authorEmail: defaultAuthor.authorEmail,
    });
    setShowReviewModal(false);
    setSubmitMessage("");
  };

  const handleSubmitReply = (event: FormEvent) => {
    event.preventDefault();
    if (!replyTargetId || !replyForm.body.trim()) return;

    const session = getSession();
    addReviewReply({
      reviewId: replyTargetId,
      authorId: session?.id ?? voterId,
      authorName: replyForm.authorName.trim() || defaultAuthor.authorName,
      authorRole: session?.role,
      rating: replyForm.rating,
      title: replyForm.title,
      body: replyForm.body,
    });

    setReplyForm({
      rating: 5,
      title: "",
      body: "",
      authorName: defaultAuthor.authorName,
    });
    setShowReplyModal(false);
    setReplyTargetId(null);
  };

  const handleSubmitFeedback = (event: FormEvent) => {
    event.preventDefault();
    if (!feedbackForm.message.trim()) return;

    const session = getSession();
    addPropertyFeedback({
      propertyId,
      authorId: session?.id ?? voterId,
      authorName:
        feedbackForm.authorName.trim() || defaultAuthor.authorName,
      authorEmail:
        feedbackForm.authorEmail.trim() ||
        defaultAuthor.authorEmail ||
        "guest@dueno.local",
      feedbackType: feedbackForm.feedbackType,
      message: feedbackForm.message,
    });

    setFeedbackForm({
      feedbackType: "general",
      message: "",
      authorName: defaultAuthor.authorName,
      authorEmail: defaultAuthor.authorEmail,
    });
  };

  const openReply = (reviewId: string) => {
    setReplyTargetId(reviewId);
    setShowReplyModal(true);
  };

  return (
    <>
      <div className="accordion-item mb-xl-0">
        <div className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#accordion-9"
            aria-expanded="true"
          >
            Reviews &amp; Feedback
          </button>
        </div>
        <div id="accordion-9" className="accordion-collapse collapse show">
          <div className="accordion-body">
            <div className="sub-head d-flex align-items-center justify-content-between mb-4">
              <h6 className="fs-16 fw-semibold mb-0">
                Reviews ({summary.total})
              </h6>
              <button
                type="button"
                className="btn btn-dark d-flex align-items-center"
                onClick={() => setShowReviewModal(true)}
              >
                <i className="material-icons-outlined me-1 fs-13">edit_note</i>
                Write a Review
              </button>
            </div>

            <div className="row mb-3 gap-xl-0 gap-lg-0 gap-3">
              <div className="col-lg-6 d-flex">
                <div className="p-4 bg-light rounded text-center d-flex align-items-center justify-content-center flex-column flex-fill">
                  <h6 className="fs-16 fw-medium mb-3">
                    Customer Reviews &amp; Ratings
                  </h6>
                  <div className="mb-3">
                    <h2 className="mb-1">
                      {summary.total > 0 ? summary.average.toFixed(1) : fallbackRating.toFixed(1)}
                      <span className="fs-16 text-body fw-normal"> / 5.0</span>
                    </h2>
                    <StarDisplay
                      rating={
                        summary.total > 0 ? summary.average : fallbackRating
                      }
                    />
                  </div>
                  <p className="mb-0 fs-14">
                    Based on {summary.total} review
                    {summary.total === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 d-flex">
                <div className="card shadow-none review-progress flex-fill mb-0">
                  <div className="card-body">
                    {([5, 4, 3, 2, 1] as const).map((star, index) => (
                      <div
                        key={star}
                        className={`progress-lvl ${index === 4 ? "mb-0" : "mb-2"}`}
                      >
                        <p className={index === 4 ? "mb-0" : undefined}>
                          {star} Star Rating{star === 1 ? "" : "s"}
                        </p>
                        <div className="progress">
                          <div
                            className={`progress-bar bg-warning${star === 5 ? " five-star" : ""}`}
                            role="progressbar"
                            style={{ width: `${progressWidth(star)}%` }}
                            aria-valuenow={progressWidth(star)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className={index === 4 ? "mb-0" : undefined}>
                          {summary.distribution[star]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-4 mb-4 bg-light rounded">
                <p className="mb-2 text-body">
                  No reviews yet. Be the first to share your experience.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowReviewModal(true)}
                >
                  Write the first review
                </button>
              </div>
            )}

            {visibleReviews.map((review) => (
              <div key={review.id} className="mb-4">
                <ReviewCard
                  review={review}
                  voterId={voterId}
                  onReply={() => openReply(review.id)}
                  onReaction={(type, replyId) =>
                    toggleReviewReaction(review.id, type, voterId, replyId)
                  }
                />
                {review.replies.map((reply) => (
                  <ReviewCard
                    key={reply.id}
                    review={reply}
                    voterId={voterId}
                    nested
                    onReaction={(type) =>
                      toggleReviewReaction(review.id, type, voterId, reply.id)
                    }
                  />
                ))}
              </div>
            ))}

            {reviews.length > 3 && (
              <div className="text-center mb-4">
                <button
                  type="button"
                  className="btn btn-dark d-inline-flex align-center gap-1 review-btn"
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll ? "Show Fewer Reviews" : "See All Reviews"}
                </button>
              </div>
            )}

            <div className="border-top pt-4 mt-2">
              <h6 className="fs-16 fw-semibold mb-3">Property Feedback</h6>
              <p className="fs-14 text-body mb-3">
                Share quick feedback about this listing — report an issue, suggest
                improvements, or send praise to the agent.
              </p>

              <form
                className="card shadow-none border mb-4"
                onSubmit={handleSubmitFeedback}
              >
                <div className="card-body">
                  <div className="row g-3">
                    {!getSession() && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">Your name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={feedbackForm.authorName}
                            onChange={(event) =>
                              setFeedbackForm((prev) => ({
                                ...prev,
                                authorName: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={feedbackForm.authorEmail}
                            onChange={(event) =>
                              setFeedbackForm((prev) => ({
                                ...prev,
                                authorEmail: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </>
                    )}
                    <div className="col-md-4">
                      <label className="form-label">Feedback type</label>
                      <select
                        className="form-select"
                        value={feedbackForm.feedbackType}
                        onChange={(event) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            feedbackType: event.target
                              .value as typeof prev.feedbackType,
                          }))
                        }
                      >
                        <option value="general">General</option>
                        <option value="issue">Report an issue</option>
                        <option value="praise">Praise</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Your feedback</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={feedbackForm.message}
                        onChange={(event) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            message: event.target.value,
                          }))
                        }
                        placeholder="Tell us what you think about this property..."
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {feedback.length > 0 && (
                <div className="d-flex flex-column gap-3">
                  {feedback.map((item) => (
                    <div key={item.id} className="card shadow-none border mb-0">
                      <div className="card-body py-3">
                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                          <AuthorAvatar name={item.authorName} />
                          <div>
                            <h6 className="fs-15 fw-medium mb-0">
                              {item.authorName}
                            </h6>
                            <p className="fs-13 mb-0 text-body">
                              {formatRelativeTime(item.createdAt)} ·{" "}
                              <span className="text-capitalize">
                                {item.feedbackType.replace("_", " ")}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="mb-0 text-body">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <form onSubmit={handleSubmitReview}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Write a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {submitMessage && (
              <div className="alert alert-warning py-2">{submitMessage}</div>
            )}
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <StarPicker
                name="review-rating"
                value={reviewForm.rating}
                onChange={(rating) =>
                  setReviewForm((prev) => ({ ...prev, rating }))
                }
              />
            </div>
            {!getSession() && (
              <>
                <div className="mb-3">
                  <label className="form-label">Your name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reviewForm.authorName}
                    onChange={(event) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        authorName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={reviewForm.authorEmail}
                    onChange={(event) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        authorEmail: event.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="form-label">Review title</label>
              <input
                type="text"
                className="form-control"
                value={reviewForm.title}
                onChange={(event) =>
                  setReviewForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Summarize your experience"
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Write your review</label>
              <textarea
                className="form-control"
                rows={4}
                value={reviewForm.body}
                onChange={(event) =>
                  setReviewForm((prev) => ({ ...prev, body: event.target.value }))
                }
                placeholder="What did you like or dislike about this property?"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-lg btn-primary">
              Submit Review
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} centered>
        <form onSubmit={handleSubmitReply}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Reply to Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <StarPicker
                name="reply-rating"
                value={replyForm.rating}
                onChange={(rating) =>
                  setReplyForm((prev) => ({ ...prev, rating }))
                }
              />
            </div>
            {!getSession() && (
              <div className="mb-3">
                <label className="form-label">Your name</label>
                <input
                  type="text"
                  className="form-control"
                  value={replyForm.authorName}
                  onChange={(event) =>
                    setReplyForm((prev) => ({
                      ...prev,
                      authorName: event.target.value,
                    }))
                  }
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Reply title</label>
              <input
                type="text"
                className="form-control"
                value={replyForm.title}
                onChange={(event) =>
                  setReplyForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Your reply</label>
              <textarea
                className="form-control"
                rows={3}
                value={replyForm.body}
                onChange={(event) =>
                  setReplyForm((prev) => ({ ...prev, body: event.target.value }))
                }
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Post Reply
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default PropertyReviewsSection;
