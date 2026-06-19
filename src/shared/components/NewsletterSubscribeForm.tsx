import { FormEvent, useState } from "react";
import {
  subscribeToNewsletter,
  type NewsletterSource,
} from "../../services/newsletterService";

type Variant = "hero" | "footer" | "support";

type Props = {
  variant?: Variant;
  source: NewsletterSource;
  className?: string;
};

const NewsletterSubscribeForm = ({
  variant = "hero",
  source,
  className = "",
}: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const result = await subscribeToNewsletter(email, source);
      setStatus("success");
      setFeedback(result.message ?? "Thank you — you are subscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    }
  };

  const honeypot = (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ display: "none" }}
    />
  );

  const feedbackClass =
    variant === "hero"
      ? status === "success"
        ? "text-white"
        : "text-warning"
      : status === "success"
        ? "text-success"
        : "text-danger";

  const feedbackNode =
    feedback && status !== "idle" ? (
      <p className={`small mb-0 mt-2 ${feedbackClass}`} role="status">
        {feedback}
      </p>
    ) : null;

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className={className} noValidate>
        {honeypot}
        <div className="d-flex align-items-center subscribe-wrap">
          <div className="input-group input-group-flat">
            <span className="input-group-text">
              <i className="material-icons-outlined">email</i>
            </span>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={status === "loading"}
              aria-label="Email address"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            aria-label="Subscribe to newsletter"
          >
            <i className="material-icons-outlined">send</i>
          </button>
        </div>
        {feedbackNode}
      </form>
    );
  }

  if (variant === "support") {
    return (
      <div className={className}>
        <form
          onSubmit={handleSubmit}
          className="d-flex align-items-center justify-content-between gap-2"
          noValidate
        >
          {honeypot}
          <div className="position-relative support-custom-icons flex-fill">
            <div className="input-group input-group-flat">
              <input
                type="email"
                className="form-control bg-white w-100"
                placeholder="Enter Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={status === "loading"}
                aria-label="Email address"
              />
            </div>
            <i className="material-icons-outlined text-dark z-2">email</i>
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={status === "loading"}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
        {feedbackNode}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {honeypot}
      <div className="d-flex align-items-center email-forms">
        <div className="contact-box align-items-center justify-content-center flex-fill">
          <span className="input-icon d-inline-flex align-items-center">
            <i className="material-icons-outlined">email</i>
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={status === "loading"}
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe to newsletter"
        >
          <i className="material-icons-outlined">send</i>
        </button>
      </div>
      {feedbackNode}
    </form>
  );
};

export default NewsletterSubscribeForm;
