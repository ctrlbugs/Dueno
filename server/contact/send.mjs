import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import {
  buildTeamEnquiryEmail,
  buildUserConfirmationEmail,
} from "./template.mjs";

const logoPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/assets/img/logo.svg",
);

const logoAttachment = () => ({
  filename: "logo.svg",
  content: readFileSync(logoPath),
  cid: "dueno-logo",
});

const truthy = (value) =>
  value === true || value === "true" || value === "1" || value === 1;

const DEFAULT_CONTACT_TO = "contact@duenoproperty.com";

const normalizeEmail = (value) => String(value ?? "").trim();

export const getSmtpConfig = (env = process.env) => {
  const host = normalizeEmail(env.SMTP_HOST);
  const user = normalizeEmail(env.SMTP_USER);
  const pass = normalizeEmail(env.SMTP_PASSWORD);
  const from = normalizeEmail(env.SMTP_FROM) || user;
  const to =
    normalizeEmail(env.CONTACT_TO_EMAIL) ||
    user ||
    from ||
    DEFAULT_CONTACT_TO;
  const port = Number(env.SMTP_PORT || 465);
  const secure =
    env.SMTP_SECURE !== undefined
      ? truthy(env.SMTP_SECURE)
      : port === 465;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.",
    );
  }

  if (!from || !to) {
    throw new Error(
      "Contact email is not configured. Set SMTP_FROM or CONTACT_TO_EMAIL.",
    );
  }

  return { host, user, pass, from, to, port, secure };
};

export const createMailTransport = (env = process.env) => {
  const cfg = getSmtpConfig(env);
  return {
    cfg,
    transport: nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
    }),
  };
};

export const sendContactEnquiry = async (payload, env = process.env) => {
  const referenceId = `DUO-${Date.now().toString(36).toUpperCase()}`;
  const enquiry = { ...payload, referenceId };
  const { cfg, transport } = createMailTransport(env);

  const teamMail = buildTeamEnquiryEmail(enquiry);
  const userMail = buildUserConfirmationEmail(enquiry);
  const userEmail = normalizeEmail(enquiry.email);

  if (!userEmail) {
    throw new Error("Please enter a valid email address.");
  }

  const attachments = [logoAttachment()];

  await transport.sendMail({
    from: `"Dueno Property" <${cfg.from}>`,
    to: cfg.to,
    replyTo: {
      name: enquiry.name,
      address: userEmail,
    },
    subject: teamMail.subject,
    text: teamMail.text,
    html: teamMail.html,
    attachments,
  });

  await transport.sendMail({
    from: `"Dueno Property" <${cfg.from}>`,
    to: userEmail,
    subject: userMail.subject,
    text: userMail.text,
    html: userMail.html,
    attachments,
  });

  return { referenceId };
};
