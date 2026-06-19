import { sendContactEnquiry } from "../server/contact/send.mjs";

const enquiry = {
  name: "Dueno Test User",
  email: process.env.SMTP_USER,
  phone: "+234 800 000 0000",
  category: "Property Sales",
  subject: "SMTP test — Dueno contact form",
  message:
    "This is a test enquiry from scripts/test-contact-email.mjs. If you receive this, SMTP and templates are working.",
  service: "Property Sales",
};

try {
  const { referenceId } = await sendContactEnquiry(enquiry);
  console.log("Success!");
  console.log(`Reference: ${referenceId}`);
  console.log(`Team inbox: ${process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER}`);
  console.log(`Confirmation sent to: ${enquiry.email}`);
} catch (error) {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
