"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { DEFAULT_PREFS, TEXT_SIZES, applyA11yAttributes, saveA11y, useA11y, type A11yPrefs } from "@/lib/a11y";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./A11yWidget.module.css";

type Toggle = Exclude<keyof A11yPrefs, "text">;
const TOGGLES: Toggle[] = ["contrast", "underline", "spacing", "motion", "grayscale"];

/** Universal-access glyph: a person inside a circle. */
function AccessIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7.2" r="1.3" fill="currentColor" stroke="none" />
      <path d="M7 9.6 12 10.6l5-1M12 10.6v3.6M12 14.2l-2.4 4.2M12 14.2l2.4 4.2" />
    </svg>
  );
}

/** Bottom-left accessibility button + panel, available on every page. */
export function A11yWidget({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const a = t.a11y;
  const prefs = useA11y();
  const [open, setOpen] = useState(false);
  const uid = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep <html> attributes in sync (e.g. after a change in another tab).
  useEffect(() => applyA11yAttributes(prefs), [prefs]);

  // Escape or a click outside closes the panel; focus goes back to the button.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("h2")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const update = (patch: Partial<A11yPrefs>) => saveA11y({ ...prefs, ...patch });
  const sizeIndex = TEXT_SIZES.indexOf(prefs.text);
  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULT_PREFS);

  return (
    <MotionConfig reducedMotion={prefs.motion ? "always" : "user"}>
      {children}

      <button
        ref={buttonRef}
        type="button"
        className={styles.fab}
        aria-label={a.open}
        aria-expanded={open}
        aria-controls={`${uid}-panel`}
        data-active={changed}
        onClick={() => setOpen((v) => !v)}
      >
        <AccessIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={`${uid}-panel`}
            className={styles.panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby={`${uid}-title`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.head}>
              <h2 id={`${uid}-title`} tabIndex={-1}>
                {a.title}
              </h2>
              <button
                type="button"
                className={styles.close}
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                aria-label={a.close}
              >
                ✕
              </button>
            </div>
            <p className={styles.intro}>{a.intro}</p>

            <div className={styles.size} role="group" aria-labelledby={`${uid}-size`}>
              <span id={`${uid}-size`} className={styles.sizeLabel}>
                {a.textSize}
              </span>
              <div className={styles.stepper}>
                <button
                  type="button"
                  aria-label={a.smaller}
                  disabled={sizeIndex <= 0}
                  onClick={() => update({ text: TEXT_SIZES[sizeIndex - 1] })}
                >
                  A−
                </button>
                <output aria-live="polite">{prefs.text}%</output>
                <button
                  type="button"
                  aria-label={a.bigger}
                  disabled={sizeIndex >= TEXT_SIZES.length - 1}
                  onClick={() => update({ text: TEXT_SIZES[sizeIndex + 1] })}
                >
                  A+
                </button>
              </div>
            </div>

            <ul className={styles.list}>
              {TOGGLES.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs[key]}
                    className={styles.toggle}
                    onClick={() => update({ [key]: !prefs[key] })}
                  >
                    <span className={styles.toggleText}>
                      <strong>{a[key].name}</strong>
                      <small>{a[key].desc}</small>
                    </span>
                    <span className={styles.knob} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" className={styles.reset} onClick={() => saveA11y(DEFAULT_PREFS)} disabled={!changed}>
              {a.reset}
            </button>
            <p className={styles.note}>{a.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
