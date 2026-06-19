const sanitizeSiteUrl = (raw) => {
  const fallback = "https://duenoproperty.com";
  const cleaned = (raw ?? fallback).trim().replace(/[\r\n\t]/g, "");
  return cleaned.replace(/\/$/, "");
};

const SITE_URL = sanitizeSiteUrl(
  process.env.VITE_SITE_URL || process.env.SITE_URL,
);

const BRAND = {
  teal: "#00ABA9",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e8eef2",
  surface: "#f8fafc",
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatSubmittedAt = (date = new Date()) =>
  date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
    timeZoneName: "short",
  });

const shell = (title, subtitle, bodyHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">
          <tr>
            <td style="background:#ffffff;padding:36px 32px 28px;text-align:center;border-bottom:1px solid ${BRAND.border};">
              <a href="${escapeHtml(SITE_URL)}" style="text-decoration:none;display:inline-block;">
                <img src="cid:dueno-logo" alt="Dueno Property" width="136" height="58" style="display:block;margin:0 auto;border:0;max-width:136px;height:auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 8px;font-size:22px;line-height:1.35;color:${BRAND.text};font-weight:700;">${escapeHtml(title)}</h1>
              ${subtitle ? `<p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.muted};">${subtitle}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;">${bodyHtml}</td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${BRAND.border};background:${BRAND.surface};">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                Dueno Property ·
                <a href="mailto:contact@duenoproperty.com" style="color:${BRAND.teal};text-decoration:none;">contact@duenoproperty.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const buildTeamNewsletterEmail = (subscription) => {
  const submittedAt = formatSubmittedAt();

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
      A new visitor subscribed to the Dueno Property newsletter.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:12px 16px;font-size:12px;color:${BRAND.muted};font-weight:600;width:128px;vertical-align:top;border-bottom:1px solid ${BRAND.border};">Reference</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${escapeHtml(subscription.referenceId)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:12px;color:${BRAND.muted};font-weight:600;vertical-align:top;border-bottom:1px solid ${BRAND.border};">Submitted</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${escapeHtml(submittedAt)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:12px;color:${BRAND.muted};font-weight:600;vertical-align:top;border-bottom:1px solid ${BRAND.border};">Email</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.text};border-bottom:1px solid ${BRAND.border};">${escapeHtml(subscription.email)}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:12px;color:${BRAND.muted};font-weight:600;vertical-align:top;">Source</td>
        <td style="padding:12px 16px;font-size:14px;color:${BRAND.text};">${escapeHtml(subscription.source)}</td>
      </tr>
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:${BRAND.muted};">
      Reply:
      <a href="mailto:${escapeHtml(subscription.email)}" style="color:${BRAND.teal};text-decoration:none;font-weight:600;">${escapeHtml(subscription.email)}</a>
    </p>`;

  const text = [
    "New newsletter subscription — Dueno Property",
    "",
    `Reference: ${subscription.referenceId}`,
    `Submitted: ${submittedAt}`,
    `Email: ${subscription.email}`,
    `Source: ${subscription.source}`,
  ].join("\n");

  return {
    subject: `[Dueno] Newsletter signup: ${subscription.email}`,
    html: shell("New newsletter subscriber", "Someone joined the mailing list on duenoproperty.com.", bodyHtml),
    text,
  };
};

export const buildSubscriberWelcomeEmail = (subscription) => {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">Thank you for subscribing to Dueno Property updates.</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
      You will receive property news, market insights, and special offers at
      <strong>${escapeHtml(subscription.email)}</strong>.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.65;color:${BRAND.muted};">
      Reference: ${escapeHtml(subscription.referenceId)}<br />
      Browse verified listings at
      <a href="${escapeHtml(SITE_URL)}" style="color:${BRAND.teal};text-decoration:none;">duenoproperty.com</a>.
    </p>`;

  const text = [
    "Thank you for subscribing to Dueno Property.",
    "",
    `We will send updates to ${subscription.email}.`,
    `Reference: ${subscription.referenceId}`,
    "",
    `Visit ${SITE_URL}`,
  ].join("\n");

  return {
    subject: "You are subscribed — Dueno Property",
    html: shell("Welcome to our newsletter", "Stay updated on verified property listings across Nigeria.", bodyHtml),
    text,
  };
};
