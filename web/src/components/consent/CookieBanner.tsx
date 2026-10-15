"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { onOpenCookiePreferences, saveConsent, useConsent } from "@/lib/consent";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./CookieBanner.module.css";

export function CookieBanner() {
  const { t } = useLanguage();
  const c = t.cookie;
  const consent = useConsent(); // undefined = server/hydrating, null = not decided yet
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);
  const uid = useId();

  const openPrefs = () => {
    // Start from the current choice; optional categories default to OFF.
    setAnalytics(consent?.analytics ?? false);
    dialogRef.current?.showModal();
  };

  useEffect(() => onOpenCookiePreferences(openPrefs));

  const decide = (value: boolean) => {
    saveConsent({ analytics: value });
    dialogRef.current?.close();
  };

  const showBanner = consent === null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.section
            className={styles.banner}
            role="region"
            aria-labelledby={`${uid}-title`}
            aria-describedby={`${uid}-text`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.25 } }}
          >
            {/* Closing without choosing counts as "reject": no tracking by default. */}
            <button type="button" className={styles.close} onClick={() => decide(false)} aria-label={c.close}>
              ✕
            </button>
            <h2 id={`${uid}-title`} className={styles.title}>
              {c.title}
            </h2>
            <p id={`${uid}-text`} className={styles.text}>
              {c.text}{" "}
              <a href="/privacy#cookie" className={styles.link}>
                {c.policy}
              </a>
            </p>
            {/* Same size, same weight, same place: rejecting is as easy as accepting. */}
            <div className={styles.choices}>
              <button type="button" className={styles.choice} onClick={() => decide(false)}>
                {c.reject}
              </button>
              <button type="button" className={styles.choice} onClick={() => decide(true)}>
                {c.accept}
              </button>
            </div>
            <button type="button" className={styles.customize} onClick={openPrefs}>
              {c.customize}
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={`${uid}-prefs`}>
        <form method="dialog" className={styles.prefs} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.prefsHead}>
            <h2 id={`${uid}-prefs`}>{c.prefsTitle}</h2>
            <button type="button" className={styles.closeDialog} onClick={() => dialogRef.current?.close()} aria-label={t.nav.close}>
              ✕
            </button>
          </div>
          <p className={styles.prefsIntro}>{c.prefsIntro}</p>

          <ul className={styles.categories}>
            <li>
              <div>
                <h3 id={`${uid}-nec`}>{c.necessary.name}</h3>
                <p>{c.necessary.desc}</p>
              </div>
              <span className={styles.always}>{c.necessary.always}</span>
            </li>
            <li>
              <div>
                <h3 id={`${uid}-ana`}>{c.analytics.name}</h3>
                <p id={`${uid}-ana-desc`}>{c.analytics.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analytics}
                aria-labelledby={`${uid}-ana`}
                aria-describedby={`${uid}-ana-desc`}
                className={styles.switch}
                onClick={() => setAnalytics((v) => !v)}
              >
                <span className={styles.knob} aria-hidden />
                <span className={styles.switchLabel}>{analytics ? c.on : c.off}</span>
              </button>
            </li>
          </ul>

          <div className={styles.prefsActions}>
            <button type="button" className={styles.choice} onClick={() => decide(false)}>
              {c.rejectAll}
            </button>
            <button type="button" className={styles.choice} onClick={() => decide(true)}>
              {c.acceptAll}
            </button>
            <button type="button" className={`${styles.choice} ${styles.save}`} onClick={() => decide(analytics)}>
              {c.save}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
