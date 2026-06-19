import { CONTACT_CATEGORY_VALUES } from "./categories.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseContactPayload = (body) => {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const category = String(body.category ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const service = String(body.service ?? "").trim();
  const website = String(body.website ?? "").trim();

  if (website) {
    return { ok: false, error: "Unable to submit enquiry." };
  }

  if (!name || name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!CONTACT_CATEGORY_VALUES.includes(category)) {
    return { ok: false, error: "Please select a category." };
  }
  if (!subject || subject.length < 3) {
    return { ok: false, error: "Please enter a subject." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Please enter a message (at least 10 characters)." };
  }

  return {
    ok: true,
    data: { name, email, phone, category, subject, message, service },
  };
};
