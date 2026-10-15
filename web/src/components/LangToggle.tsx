"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/dictionaries";
import styles from "./LangToggle.module.css";

const OPTIONS: Locale[] = ["it", "en"];

/** IT / EN segmented switch. Each option is a real button with aria-pressed. */
export function LangToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className={styles.toggle} role="group" aria-label={t.lang.label} data-locale={locale}>
      <span className={styles.thumb} aria-hidden />
      {OPTIONS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          aria-label={t.lang[l]}
          onClick={() => setLocale(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
