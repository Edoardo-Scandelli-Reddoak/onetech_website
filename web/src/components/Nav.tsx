"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LangToggle } from "./LangToggle";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

export function Nav() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.bar}>
          <Link href="/#top" className={styles.brand} aria-label={t.nav.home}>
            <Logo size={26} />
            <span>
              One<span className={styles.brandLight}>Tech</span>
            </span>
          </Link>

          <nav aria-label={t.nav.main} className={styles.links}>
            {t.nav.links.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.right}>
            <LangToggle />
            <Link href="/#contatti" className={`btn btn-primary ${styles.cta}`}>
              {t.nav.cta} <span className="arrow">→</span>
            </Link>
            <button
              className={styles.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={styles.burgerLabel}>{open ? t.nav.close : t.nav.menu}</span>
              <span className={styles.burgerIcon} data-open={open} aria-hidden>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={styles.mobile} data-open={open} hidden={!open}>
          <nav aria-label={t.nav.mobile}>
            {t.nav.links.map((item, i) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span className={styles.mIndex}>0{i + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/#contatti" className="btn btn-primary" onClick={() => setOpen(false)}>
            {t.nav.cta} <span className="arrow">→</span>
          </Link>
        </div>
      </header>
    </>
  );
}
