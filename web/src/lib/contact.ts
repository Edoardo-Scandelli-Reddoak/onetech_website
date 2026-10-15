/**
 * Contact form schema + validation, shared by the browser and the API route
 * so the rules can never drift apart. Errors are keys, translated in the UI.
 */

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  /** Optional: a few words about the problem. */
  message: string;
  consent: boolean;
  locale: "it" | "en";
  /** Honeypot: humans never see it, bots fill it in. */
  botcheck?: string;
};

export type ContactField = "name" | "email" | "consent";

export type ContactErrorKey =
  | "nameRequired"
  | "nameShort"
  | "emailRequired"
  | "emailInvalid"
  | "consentRequired";

export type ContactErrors = Partial<Record<ContactField, ContactErrorKey>>;

/** Pragmatic email check: something@domain.tld, no spaces. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 120, email: 200, company: 120, message: 3000 };

export function validateField(field: ContactField, data: ContactPayload): ContactErrorKey | undefined {
  switch (field) {
    case "name": {
      const v = data.name.trim();
      if (!v) return "nameRequired";
      if (v.length < 2) return "nameShort";
      return;
    }
    case "email": {
      const v = data.email.trim();
      if (!v) return "emailRequired";
      if (!EMAIL_RE.test(v) || v.length > LIMITS.email) return "emailInvalid";
      return;
    }
    case "consent":
      return data.consent ? undefined : "consentRequired";
  }
}

export const FIELD_ORDER: ContactField[] = ["name", "email", "consent"];

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of FIELD_ORDER) {
    const err = validateField(field, data);
    if (err) errors[field] = err;
  }
  return errors;
}
