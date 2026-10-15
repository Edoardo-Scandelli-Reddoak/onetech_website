"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionHead } from "./SectionHead";
import styles from "./TailorLab.module.css";

/** A tailor's tape measure, rendered as ticks + centimetre labels. */
function Tape({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ["-30%", "0%"] : ["0%", "-30%"]);
  return (
    <div ref={ref} className={styles.tape} aria-hidden>
      <motion.div className={styles.tapeTrack} style={{ x }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <span key={i} className={styles.cm}>
            {i + 1}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function TailorLab() {
  const { t } = useLanguage();
  const c = t.tailor;
  return (
    <section id="tailor-lab" className={styles.section} aria-labelledby="tailor-title">
      <Tape />

      <div className={`container ${styles.inner}`}>
        <SectionHead
          tone="light"
          id="tailor-title"
          title={
            <>
              {c.title[0]}
              <em>{c.title[1]}</em>
            </>
          }
        />

        <div className={styles.body}>
          <div className={styles.text}>
            <p className={styles.lead}>
              {c.leadA}
              <strong>{c.leadStrong}</strong>.
            </p>
            <p>{c.body}</p>
            <a href="#contatti" className={`btn ${styles.btn}`}>
              {c.cta} <span className="arrow">→</span>
            </a>
          </div>

          <figure className={styles.pattern}>
            <figcaption className={styles.patternHead}>
              <span>{c.file}</span>
              <span className={styles.fit}>{c.fit}</span>
            </figcaption>
            <ol>
              {c.pattern.map((line, i) => (
                <motion.li
                  key={line.fn}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.15 + i * 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={styles.fn}>{line.fn}</span>(<span className={styles.args}>{line.args}</span>);
                </motion.li>
              ))}
            </ol>
            <div className={styles.stitch} aria-hidden />
            <p className={styles.patternNote}>
              <span>✂</span> {c.note}
            </p>
          </figure>
        </div>
      </div>

      <Tape reverse />
    </section>
  );
}
