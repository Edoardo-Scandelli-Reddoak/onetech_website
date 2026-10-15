"use client";

import type { ComponentType, PointerEvent } from "react";
import { motion } from "motion/react";
import { ENGINES, type EngineId } from "@/lib/content";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AllMessageDemo, ArgoDemo, KoreDemo, MiloDemo } from "./demos/Demos";
import { SectionHead } from "./SectionHead";
import styles from "./Engines.module.css";

const DEMOS: Record<EngineId, ComponentType> = {
  kore: KoreDemo,
  argo: ArgoDemo,
  allmessage: AllMessageDemo,
  milo: MiloDemo,
};

/** Spotlight follows the pointer across the card. */
function track(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Engines() {
  const { t } = useLanguage();
  const c = t.engines;
  return (
    <section id="motori" className={styles.section} aria-labelledby="motori-title">
      <div className="container">
        <SectionHead
          id="motori-title"
          title={
            <>
              {c.title[0]}
              <em>{c.title[1]}</em>
            </>
          }
          intro={c.intro}
        />

        <div className={styles.grid}>
          {ENGINES.map((engine, i) => {
            const Demo = DEMOS[engine.id];
            const copy = c.items[engine.id];
            return (
              <motion.article
                key={engine.id}
                id={`motore-${engine.id}`}
                className={styles.card}
                onPointerMove={track}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                aria-labelledby={`motore-${engine.id}-name`}
              >
                <div className={styles.top}>
                  <span className={styles.num}>0{i + 1}</span>
                  <span className={styles.domain}>{copy.domain}</span>
                </div>

                <div className={styles.demo} aria-hidden>
                  <Demo />
                </div>

                <h3 id={`motore-${engine.id}-name`} className={styles.name}>
                  {engine.name}
                </h3>
                <p className={styles.tagline}>{copy.tagline}</p>
                <p className={styles.desc}>{copy.description}</p>
                <a href="#contatti" className={styles.link}>
                  {c.demoCta} {engine.name} <span className="arrow">→</span>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
