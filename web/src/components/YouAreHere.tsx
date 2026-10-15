"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./YouAreHere.module.css";

const SECTION_IDS = ["difficile", "motori", "tailor-lab", "metodo", "contatti"];

/** A small "Sei qui" pill: tells the visitor where they are and what comes next. */
export function YouAreHere() {
  const { t } = useLanguage();
  const c = t.youAreHere;
  const SECTIONS = SECTION_IDS.map((id, i) => ({ id, label: c.sections[i] }));
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let current = -1;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top < mid) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = SECTIONS[active];
  const next = SECTIONS[active + 1];

  return (
    <AnimatePresence>
      {current && next && (
        <motion.nav
          aria-label={c.nav}
          className={styles.pill}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.progress} aria-hidden>
            {SECTIONS.map((s, i) => (
              <i key={s.id} data-on={i <= active} />
            ))}
          </span>
          <span className={styles.here}>
            <small>{c.here}</small>
            {current.label}
          </span>
          <a href={`#${next.id}`} className={styles.next}>
            {c.next}: {next.label} ↓
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
