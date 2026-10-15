import type { ContactPayload } from "./contact";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

/**
 * Sends the (already validated and stored) request by email via Web3Forms.
 * Web3Forms access keys are public by design, and the free plan only accepts
 * browser submissions — so this runs client-side, after our own API said OK.
 * Without a key (e.g. a reviewer running the repo locally) it's a no-op.
 */
export async function sendEmail(data: ContactPayload, requestId: string): Promise<boolean> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return true;

  // FormData keeps this a CORS "simple request": no preflight, which Web3Forms rejects.
  const fields: Record<string, string> = {
    access_key: accessKey,
    subject: `Nuova richiesta dal sito One Tech — ${data.name}`,
    from_name: "Sito One Tech",
    replyto: data.email,
    name: data.name,
    email: data.email,
    company: data.company || "—",
    message: data.message || "—",
    language: data.locale,
    request_id: requestId,
    botcheck: data.botcheck ?? "",
  };
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);

  const res = await fetch(WEB3FORMS_URL, { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean };
  return res.ok && json.success === true;
}
