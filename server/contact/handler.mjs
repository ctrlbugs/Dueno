import { parseContactPayload } from "./validate.mjs";
import { sendContactEnquiry } from "./send.mjs";

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

export const handleContactRequest = async (req, res) => {
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
    const parsed = parseContactPayload(body);

    if (!parsed.ok) {
      sendJson(res, 400, { error: parsed.error });
      return;
    }

    const { referenceId } = await sendContactEnquiry(parsed.data);
    sendJson(res, 200, {
      success: true,
      message: "Thank you — your enquiry has been sent.",
      referenceId,
    });
  } catch (error) {
    console.error("[contact]", error);
    const rawMessage =
      error instanceof Error ? error.message : "Unable to send your enquiry.";
    const friendlyMessage = /recipients defined|SMTP is not configured|Contact email is not configured/i.test(
      rawMessage,
    )
      ? "We could not send your enquiry right now. Please email us at contact@duenoproperty.com or try again shortly."
      : rawMessage;

    sendJson(res, 500, {
      error: friendlyMessage,
    });
  }
};

/** Vercel serverless adapter */
export default async function vercelContactHandler(req, res) {
  await handleContactRequest(req, res);
}
