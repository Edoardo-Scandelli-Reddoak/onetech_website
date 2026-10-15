import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LIMITS, validateContact, type ContactPayload } from "@/lib/contact";

// Serverless (Vercel) has a read-only filesystem except the temp dir: there the file is
// only a best-effort log, the source of truth is the email + the Django backoffice.
const DATA_DIR = process.env.VERCEL ? path.join(os.tmpdir(), "onetech") : path.join(process.cwd(), "data");

/** Coerce unknown JSON into a payload, trimming and capping every string. */
function normalise(body: Record<string, unknown>): ContactPayload {
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  return {
    name: str(body.name, LIMITS.name),
    email: str(body.email, LIMITS.email),
    company: str(body.company, LIMITS.company),
    message: str(body.message, LIMITS.message),
    consent: body.consent === true,
    locale: body.locale === "en" ? "en" : "it",
    botcheck: str(body.botcheck, 200),
  };
}

/** Every request is kept locally as JSON Lines: a minimal, inspectable "database". */
async function store(entry: object) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(path.join(DATA_DIR, "contact-requests.jsonl"), JSON.stringify(entry) + "\n", "utf8");
}

/**
 * Hands the request to the Django backoffice (backend/), where the team reads it.
 * Optional: if Django isn't running, the JSONL file above still has everything.
 */
async function pushToBackoffice(entry: object) {
  const url = process.env.CONTACTS_API_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Token": process.env.CONTACTS_API_TOKEN ?? "" },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(8000), // room for a cold start of the Django function
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const data = normalise(body);

  // Bots fill the hidden field: pretend everything went fine and drop it.
  if (data.botcheck) return Response.json({ ok: true });

  // Never trust the browser: the same rules run again here.
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  const id = crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const { botcheck: _ignored, ...record } = data;
  void _ignored;

  const entry = { id, receivedAt, ...record };
  // Storage problems must never block a real person's request.
  await store(entry).catch((e: unknown) => console.warn("[contact] could not write log file:", e));
  const backoffice = await pushToBackoffice(entry);
  console.info(`[contact] ${receivedAt} ${id} ${data.email} backoffice=${backoffice}`);

  // The email itself is sent from the browser (see lib/web3forms.ts):
  // Web3Forms' free plan only accepts client-side submissions.
  return Response.json({ ok: true, id });
}
