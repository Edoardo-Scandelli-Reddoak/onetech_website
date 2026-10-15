"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FIELD_ORDER,
  LIMITS,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactPayload,
} from "@/lib/contact";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { sendEmail } from "@/lib/web3forms";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY: Omit<ContactPayload, "locale"> = {
  name: "",
  email: "",
  company: "",
  topic: "",
  message: "",
  consent: false,
  botcheck: "",
};

export function ContactForm() {
  const { t, locale } = useLanguage();
  const f = t.form;
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");

  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const payload = (v = values): ContactPayload => ({ ...v, locale });

  const update = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Once a field has been judged, re-judge it live so the error disappears as soon as it's fixed.
    if (key !== "company" && key !== "botcheck" && touched[key as ContactField]) {
      setErrors((e) => ({ ...e, [key]: validateField(key as ContactField, payload(next)) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((tch) => ({ ...tch, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, payload()) }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validateContact(payload());
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true, consent: true });

    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setShowSummary(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; errors?: ContactErrors };
      if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        setShowSummary(true);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      if (!res.ok || !json.ok) throw new Error("api");
      // Our backend has validated and stored it; now the email goes out.
      if (!(await sendEmail(payload(), json.id ?? ""))) throw new Error("delivery");
      setSentName(values.name.trim().split(/\s+/)[0]);
      setStatus("success");
      setValues(EMPTY);
      setTouched({});
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrors({});
  };

  const errorList = FIELD_ORDER.filter((field) => errors[field]);
  const focusField = (field: ContactField) => {
    const target =
      field === "topic"
        ? document.querySelector<HTMLInputElement>(`input[name="${id("topic")}"]`)
        : document.getElementById(id(field));
    target?.focus();
  };

  /** Props shared by every text field: wiring label, hint and error together for screen readers. */
  const describe = (field: ContactField, hasHint: boolean) => {
    const parts = [hasHint && id(`${field}-hint`), errors[field] && id(`${field}-error`)].filter(Boolean);
    return {
      id: id(field),
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": parts.length ? parts.join(" ") : undefined,
      onBlur: () => blur(field),
    } as const;
  };

  const err = (field: ContactField) =>
    errors[field] ? (
      <p id={id(`${field}-error`)} className={styles.error}>
        <span aria-hidden>!</span>
        {f.errors[errors[field]!]}
      </p>
    ) : null;

  const req = <span className={styles.req}>({f.required})</span>;

  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            className={styles.success}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.successIcon} aria-hidden>
              ✓
            </span>
            <h3 ref={successRef} tabIndex={-1}>
              {f.success.title}
            </h3>
            <p>{f.success.text(sentName)}</p>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              {f.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={onSubmit}
            noValidate
            aria-label={f.legend}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showSummary && errorList.length > 0 && (
              <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1}>
                <p>{f.errors.summary(errorList.length)}</p>
                <ul>
                  {errorList.map((field) => (
                    <li key={field}>
                      <a
                        href={`#${id(field)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          focusField(field);
                        }}
                      >
                        {f.errors[errors[field]!]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className={styles.note}>{f.requiredNote}</p>

            <div className={styles.row}>
              <div className={styles.field} data-invalid={!!errors.name}>
                <label htmlFor={id("name")}>
                  {f.name.label} {req}
                </label>
                <input
                  {...describe("name", false)}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={LIMITS.name}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                {err("name")}
              </div>

              <div className={styles.field} data-invalid={!!errors.email}>
                <label htmlFor={id("email")}>
                  {f.email.label} {req}
                </label>
                <input
                  {...describe("email", false)}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  maxLength={LIMITS.email}
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {err("email")}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={id("company")}>
                {f.company.label} <span className={styles.opt}>({f.optional})</span>
              </label>
              <input
                id={id("company")}
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={LIMITS.company}
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>

            <fieldset
              className={styles.choices}
              data-invalid={!!errors.topic}
              aria-describedby={errors.topic ? id("topic-error") : undefined}
            >
              <legend>
                {f.topic.label} {req}
              </legend>
              <div className={styles.choiceGrid}>
                {f.topic.options.map((o) => (
                  <label key={o.value} className={styles.choice}>
                    <input
                      type="radio"
                      name={id("topic")}
                      value={o.value}
                      checked={values.topic === o.value}
                      required
                      onChange={() => {
                        update("topic", o.value as ContactPayload["topic"]);
                        setTouched((tch) => ({ ...tch, topic: true }));
                        setErrors((er) => ({ ...er, topic: undefined }));
                      }}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {err("topic")}
            </fieldset>

            <div className={styles.field} data-invalid={!!errors.message}>
              <label htmlFor={id("message")}>
                {f.message.label} {req}
              </label>
              <p id={id("message-hint")} className={styles.hint}>
                {f.message.hint}
              </p>
              <textarea
                {...describe("message", true)}
                name="message"
                rows={5}
                required
                maxLength={LIMITS.message}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
              />
              {err("message")}
            </div>

            <div className={styles.consent} data-invalid={!!errors.consent}>
              <input
                {...describe("consent", false)}
                type="checkbox"
                name="consent"
                required
                checked={values.consent}
                onChange={(e) => {
                  update("consent", e.target.checked);
                  setTouched((tch) => ({ ...tch, consent: true }));
                  setErrors((er) => ({ ...er, consent: e.target.checked ? undefined : "consentRequired" }));
                }}
              />
              <label htmlFor={id("consent")}>
                {f.consent.label} {req}
              </label>
              {err("consent")}
            </div>

            {/* Honeypot: hidden from people and assistive tech, catches naive bots. */}
            <div className={styles.honeypot} aria-hidden>
              <label htmlFor={id("botcheck")}>Leave empty</label>
              <input
                id={id("botcheck")}
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                value={values.botcheck}
                onChange={(e) => update("botcheck", e.target.value)}
              />
            </div>

            {status === "error" && (
              <p className={styles.failure} role="alert">
                {f.errors.network}
              </p>
            )}

            <div className={styles.actions}>
              <button type="submit" className={`btn btn-primary ${styles.submit}`} aria-disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className={styles.spinner} aria-hidden /> {f.sending}
                  </>
                ) : (
                  <>
                    {f.submit} <span className="arrow">→</span>
                  </>
                )}
              </button>
              <p className={styles.srOnly} role="status">
                {status === "sending" ? f.sending : ""}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
