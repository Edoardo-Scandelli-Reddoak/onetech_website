"use client";

import { CONTACTS, ENGINES } from "@/lib/content";
import { openCookiePreferences } from "@/lib/consent";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ContactForm } from "./ContactForm";
import { Logo } from "./Logo";
import styles from "./Contact.module.css";

export function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  return (
    <section id="contatti" className={styles.section} aria-labelledby="contatti-title">
      {/* Neon frame: violet light leaking in from every edge, dark at the centre. */}
      <div className={styles.neon}>
        <div className={styles.mesh} aria-hidden />
        <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <h2 id="contatti-title" className={styles.title}>
            {c.titleA}
            <span className="serif">{c.titleEm}</span>
            <span className={styles.titleSub}>{c.titleB}</span>
          </h2>
          <p className={styles.lead}>{c.lead}</p>

          <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost ${styles.wa}`}>
            {c.whatsapp} <span className="arrow">↗</span>
          </a>

          <dl className={styles.cards}>
            <div>
              <dt>{c.labels.sales}</dt>
              <dd>
                <a href={`mailto:${CONTACTS.sales}`}>{CONTACTS.sales}</a>
              </dd>
            </div>
            <div>
              <dt>{c.labels.partnerships}</dt>
              <dd>
                <a href={`mailto:${CONTACTS.partnerships}`}>{CONTACTS.partnerships}</a>
              </dd>
            </div>
            <div>
              <dt>{c.labels.press}</dt>
              <dd>
                <a href={`mailto:${CONTACTS.press}`}>{CONTACTS.press}</a>
              </dd>
            </div>
            <div>
              <dt>{c.labels.address}</dt>
              <dd>{CONTACTS.address}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
        </div>
      </div>

      <footer className={`container ${styles.footer}`}>
        <div className={styles.brand}>
          <Logo size={22} />
          <span>One Tech Srl · Milano</span>
        </div>
        <nav aria-label={c.footer} className={styles.footLinks}>
          {ENGINES.map((e) => (
            <a key={e.id} href={`#motore-${e.id}`}>
              {e.name}
            </a>
          ))}
          <a href="#tailor-lab">Tailor Lab</a>
        </nav>
        <div className={styles.legal}>
          <a href="/privacy">{t.cookie.footerPolicy}</a>
          <button type="button" onClick={openCookiePreferences}>
            {t.cookie.footerPrefs}
          </button>
        </div>
        <p>{c.copy}</p>
      </footer>
    </section>
  );
}
