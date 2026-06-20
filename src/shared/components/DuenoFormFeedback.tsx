import { useEffect, useState } from "react";
import "../styles/duenoFormFeedback.scss";

type DuenoStatusMessageProps = {
  variant: "success" | "error";
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  layout?: "inline" | "toast";
  autoDismissMs?: number;
};

export const DuenoStatusMessage = ({
  variant,
  title,
  message,
  onDismiss,
  className = "",
  layout = "inline",
  autoDismissMs,
}: DuenoStatusMessageProps) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const isToast = layout === "toast";
  const toastText = title ? `${title} · ${message}` : message;

  useEffect(() => {
    if (!autoDismissMs || !onDismiss) return;

    const timer = window.setTimeout(() => {
      setIsLeaving(true);
      window.setTimeout(onDismiss, 180);
    }, autoDismissMs);

    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss, message, title]);

  return (
    <div
      className={`dueno-status-message dueno-status-message--${variant}${
        isToast ? " dueno-status-message--toast" : ""
      }${isLeaving ? " dueno-status-message--leaving" : ""} ${className}`.trim()}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <span className="dueno-status-message__icon" aria-hidden="true">
        {variant === "success" ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12.2L10.6 14.8L16 9.4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 8.5V12.5M12 15.8H12.01"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <p className="dueno-status-message__text">
        {isToast ? (
          toastText
        ) : (
          <>
            {title ? (
              <strong className="dueno-status-message__title">{title}</strong>
            ) : null}
            {title ? " " : null}
            {message}
          </>
        )}
      </p>
      {onDismiss && !autoDismissMs ? (
        <button
          type="button"
          className="dueno-status-message__dismiss"
          aria-label="Dismiss message"
          onClick={onDismiss}
        >
          <span className="material-icons-outlined" aria-hidden="true">
            close
          </span>
        </button>
      ) : null}
    </div>
  );
};

type DuenoSubmitButtonProps = {
  isLoading?: boolean;
  loadingLabel?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "dark" | "primary";
};

export const DuenoSubmitButton = ({
  isLoading = false,
  loadingLabel = "Saving…",
  children,
  className = "",
  disabled = false,
  type = "submit",
  variant = "primary",
}: DuenoSubmitButtonProps) => (
  <button
    type={type}
    className={`dueno-submit-btn dueno-submit-btn--${variant} ${className}`.trim()}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <>
        <span className="dueno-submit-btn__spinner" aria-hidden="true" />
        <span>{loadingLabel}</span>
      </>
    ) : (
      children
    )}
  </button>
);
