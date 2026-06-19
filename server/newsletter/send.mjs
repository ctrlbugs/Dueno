import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createMailTransport } from "../contact/send.mjs";
import {
  buildSubscriberWelcomeEmail,
  buildTeamNewsletterEmail,
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

export const sendNewsletterSubscription = async (payload, env = process.env) => {
  const referenceId = `NL-${Date.now().toString(36).toUpperCase()}`;
  const subscription = { ...payload, referenceId };
  const { cfg, transport } = createMailTransport(env);

  const teamMail = buildTeamNewsletterEmail(subscription);
  const welcomeMail = buildSubscriberWelcomeEmail(subscription);
  const attachments = [logoAttachment()];

  await transport.sendMail({
    from: `"Dueno Property" <${cfg.from}>`,
    to: cfg.to,
    replyTo: subscription.email,
    subject: teamMail.subject,
    text: teamMail.text,
    html: teamMail.html,
    attachments,
  });

  await transport.sendMail({
    from: `"Dueno Property" <${cfg.from}>`,
    to: subscription.email,
    subject: welcomeMail.subject,
    text: welcomeMail.text,
    html: welcomeMail.html,
    attachments,
  });

  return { referenceId };
};
