export type NewsletterSource = "homepage" | "footer" | "support";

export const subscribeToNewsletter = async (
  email: string,
  source: NewsletterSource = "homepage",
) => {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, website: "" }),
  });

  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
    message?: string;
    referenceId?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Unable to subscribe right now.");
  }

  return data;
};
