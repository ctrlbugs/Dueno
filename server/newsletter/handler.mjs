import { parseNewsletterPayload } from "./validate.mjs";
import { sendNewsletterSubscription } from "./send.mjs";

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
};

export const handleNewsletterRequest = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const parsed = parseNewsletterPayload(body);

    if (!parsed.ok) {
      sendJson(res, 400, { error: parsed.error });
      return;
    }

    const { referenceId } = await sendNewsletterSubscription(parsed.data);
    sendJson(res, 200, {
      success: true,
      message: "Thank you — you are subscribed to our newsletter.",
      referenceId,
    });
  } catch (error) {
    console.error("[newsletter]", error);
    const rawMessage =
      error instanceof Error ? error.message : "Unable to subscribe right now.";
    const friendlyMessage = /SMTP is not configured|Contact email is not configured/i.test(
      rawMessage,
    )
      ? "We could not complete your subscription right now. Please email contact@duenoproperty.com or try again shortly."
      : rawMessage;

    sendJson(res, 500, { error: friendlyMessage });
  }
};

export default async function vercelNewsletterHandler(req, res) {
  await handleNewsletterRequest(req, res);
}
