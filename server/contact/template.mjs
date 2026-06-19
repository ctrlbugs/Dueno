const SITE_URL =
  process.env.VITE_SITE_URL?.trim() ||
  process.env.SITE_URL?.trim() ||
  "https://duenoproperty.com";

const BRAND = {
  teal: "#00ABA9",
  mint: "#B7DBA3",
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

/** @typedef {"general" | "service"} EnquiryCategoryId */

/**
 * @param {{ service?: string; subject?: string }} enquiry
 * @returns {{ id: EnquiryCategoryId; label: string; serviceName?: string }}
 */
export const getEnquiryCategory = (enquiry) => {
  const serviceName = enquiry.service?.trim();
  if (serviceName) {
    return { id: "service", label: "Service request", serviceName };
  }

  const subjectMatch = enquiry.subject?.match(/^Service request:\s*(.+)$/i);
  if (subjectMatch?.[1]?.trim()) {
    return {
      id: "service",
      label: "Service request",
      serviceName: subjectMatch[1].trim(),
    };
  }

  return { id: "general", label: "General enquiry" };
};

/**
 * @param {{ subject?: string; service?: string }} enquiry
 * @param {{ id: EnquiryCategoryId; serviceName?: string }} category
 */
export const getEmailSubjects = (enquiry, category) => {
  if (category.id === "service") {
    const serviceName =
      category.serviceName ||
      enquiry.service?.trim() ||
      enquiry.subject?.replace(/^Service request:\s*/i, "").trim() ||
      "Service";

    return {
      team: `[Dueno] Service request: ${serviceName}`,
      user: `We received your ${serviceName} request — Dueno Property`,
    };
  }

  return {
    team: `[Dueno] General enquiry: ${enquiry.subject}`,
    user: "We received your enquiry — Dueno Property",
  };
};

const row = (label, value) => {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:12px 16px;font-size:12px;color:${BRAND.muted};font-weight:600;width:128px;vertical-align:top;border-bottom:1px solid ${BRAND.border};letter-spacing:0.02em;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;font-size:14px;color:${BRAND.text};line-height:1.55;border-bottom:1px solid ${BRAND.border};">${escapeHtml(value)}</td>
    </tr>`;
};

const badge = (label, color = BRAND.teal) => `
  <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${color}14;color:${color};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${escapeHtml(label)}</span>`;

const shell = (title, subtitle, bodyHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">
          <tr>
            <td style="background:#ffffff;padding:36px 32px 28px;text-align:center;border-bottom:1px solid ${BRAND.border};">
              <a href="${escapeHtml(SITE_URL)}" style="text-decoration:none;display:inline-block;">
                <img src="cid:dueno-logo" alt="Dueno Property" width="136" height="58" style="display:block;margin:0 auto;border:0;max-width:136px;height:auto;" />
              </a>
              <p style="margin:14px 0 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.teal};font-weight:700;">Verified real estate in Nigeria</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 8px;font-size:22px;line-height:1.35;color:${BRAND.text};font-weight:700;">${escapeHtml(title)}</h1>
              ${subtitle ? `<p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${BRAND.muted};">${subtitle}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${BRAND.border};background:${BRAND.surface};">
              <p style="margin:0 0 6px;font-size:13px;color:${BRAND.text};font-weight:600;">Dueno Property</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
                Asokoro District Abuja, Diplomatic Zone, Abuja<br />
                <a href="mailto:contact@duenoproperty.com" style="color:${BRAND.teal};text-decoration:none;">contact@duenoproperty.com</a>
                · <a href="${escapeHtml(SITE_URL)}" style="color:${BRAND.teal};text-decoration:none;">duenoproperty.com</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;line-height:1.5;">You received this email from Dueno Property.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

const nextStepsBlock = (category) => {
  const steps =
    category.id === "service"
      ? [
          "Our team reviews your service request within one business day.",
          "A Dueno specialist will contact you to discuss requirements and next steps.",
          "Keep your reference number handy if you follow up by phone or email.",
        ]
      : [
          "Our team reviews your message within one business day.",
          "We will reply to the email address you provided.",
          "Keep your reference number handy if you follow up by phone or email.",
        ];

  const items = steps
    .map(
      (step) =>
        `<li style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(step)}</li>`,
    )
    .join("");

  return `
    <p style="margin:24px 0 10px;font-size:13px;font-weight:700;color:${BRAND.text};letter-spacing:0.02em;">What happens next</p>
    <ul style="margin:0;padding:0 0 0 18px;">${items}</ul>`;
};

export const buildTeamEnquiryEmail = (enquiry) => {
  const category = getEnquiryCategory(enquiry);
  const subjects = getEmailSubjects(enquiry, category);
  const submittedAt = formatSubmittedAt();

  const table = `
    <p style="margin:0 0 16px;">${badge(category.label)}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;margin:0 0 20px;">
      ${row("Reference", enquiry.referenceId)}
      ${row("Submitted", submittedAt)}
      ${row("Name", enquiry.name)}
      ${row("Email", enquiry.email)}
      ${row("Phone", enquiry.phone)}
      ${row("Category", enquiry.category)}
      ${row("Subject", enquiry.subject)}
      ${category.id === "service" ? row("Service", category.serviceName || enquiry.service) : ""}
    </table>
    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:${BRAND.text};">Message</p>
    <div style="padding:18px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:10px;font-size:14px;line-height:1.7;color:#334155;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>
    <p style="margin:20px 0 0;font-size:13px;color:${BRAND.muted};">
      Reply directly to the sender:
      <a href="mailto:${escapeHtml(enquiry.email)}" style="color:${BRAND.teal};text-decoration:none;font-weight:600;">${escapeHtml(enquiry.email)}</a>
    </p>`;

  const text = [
    `${category.label} — Dueno Property`,
    "",
    `Reference: ${enquiry.referenceId}`,
    `Submitted: ${submittedAt}`,
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.category ? `Category: ${enquiry.category}` : null,
    `Subject: ${enquiry.subject}`,
    category.id === "service"
      ? `Service: ${category.serviceName || enquiry.service}`
      : null,
    "",
    "Message:",
    enquiry.message,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: subjects.team,
    html: shell("New contact enquiry", "A visitor submitted the contact form on duenoproperty.com.", table),
    text,
  };
};

export const buildUserConfirmationEmail = (enquiry) => {
  const category = getEnquiryCategory(enquiry);
  const subjects = getEmailSubjects(enquiry, category);
  const firstName = enquiry.name.trim().split(/\s+/)[0] || "there";

  const intro =
    category.id === "service"
      ? `Thank you for your <strong>${escapeHtml(category.serviceName || enquiry.service)}</strong> request. We have received the details below and a member of our team will be in touch shortly.`
      : "Thank you for contacting <strong>Dueno Property</strong>. We have received your enquiry and a member of our team will get back to you shortly.";

  const summaryRows = [
    row("Reference", enquiry.referenceId),
    row("Category", enquiry.category),
    row("Subject", enquiry.subject),
    category.id === "service"
      ? row("Service", category.serviceName || enquiry.service)
      : "",
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">${intro}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;margin:0 0 4px;">
      ${summaryRows}
    </table>
    ${nextStepsBlock(category)}
    <p style="margin:24px 0 0;font-size:14px;line-height:1.65;color:${BRAND.muted};">
      If your request is urgent, reply to this email or call us at
      <a href="tel:+2348000000000" style="color:${BRAND.teal};text-decoration:none;">+234 800 000 0000</a>.
    </p>`;

  const text = [
    `Hi ${firstName},`,
    "",
    category.id === "service"
      ? `Thank you for your ${category.serviceName || enquiry.service} request. We have received your details and will be in touch shortly.`
      : "Thank you for contacting Dueno Property. We have received your enquiry and will get back to you shortly.",
    "",
    `Reference: ${enquiry.referenceId}`,
    enquiry.category ? `Category: ${enquiry.category}` : null,
    `Subject: ${enquiry.subject}`,
    category.id === "service"
      ? `Service: ${category.serviceName || enquiry.service}`
      : null,
    "",
    "What happens next:",
    ...(category.id === "service"
      ? [
          "- Our team reviews your service request within one business day.",
          "- A Dueno specialist will contact you to discuss requirements.",
          "- Keep your reference number handy if you follow up.",
        ]
      : [
          "- Our team reviews your message within one business day.",
          "- We will reply to the email address you provided.",
          "- Keep your reference number handy if you follow up.",
        ]),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: subjects.user,
    html: shell("We received your enquiry", "Your message is in safe hands.", bodyHtml),
    text,
  };
};
