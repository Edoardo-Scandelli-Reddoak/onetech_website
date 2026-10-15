"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionHead } from "./SectionHead";
import styles from "./Method.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export function Method() {
  const { t } = useLanguage();
  const c = t.method;
  return (
    <section id="metodo" className={styles.section} aria-labelledby="metodo-title">
      <div className="container">
        <SectionHead
          id="metodo-title"
          title={
            <>
              {c.title[0]}
              <em>{c.title[1]}</em>
            </>
          }
          intro={c.intro}
        />

        <div className={styles.race} role="img" aria-label={c.raceLabel}>
          <div className={styles.lane}>
            <p className={styles.laneLabel}>
              {c.slow.name} <span>{c.slow.note}</span>
            </p>
            <div className={styles.track}>
              <motion.div
                className={`${styles.bar} ${styles.slow}`}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 3.2, ease: "linear" }}
              >
                <span>{c.slow.bar}</span>
              </motion.div>
            </div>
          </div>
          <div className={styles.lane}>
            <p className={styles.laneLabel}>
              {c.fast.name} <span>{c.fast.note}</span>
            </p>
            <div className={styles.track}>
              <motion.div
                className={`${styles.bar} ${styles.fast}`}
                initial={{ width: 0 }}
                whileInView={{ width: "34%" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease, delay: 0.3 }}
              >
                <span>{c.fast.bar}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <ol className={styles.steps}>
          {c.steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease }}
            >
              <span className={styles.stepNum}>
                {c.step} 0{i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
