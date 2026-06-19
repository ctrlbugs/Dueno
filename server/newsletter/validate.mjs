const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseNewsletterPayload = (body) => {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const website = String(body.website ?? "").trim();
  const source = String(body.source ?? "website").trim().slice(0, 80);

  if (website) {
    return { ok: false, error: "Unable to subscribe." };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  return { ok: true, data: { email, source: source || "website" } };
};
