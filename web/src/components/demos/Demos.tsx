"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useLoop } from "./useLoop";
import styles from "./Demos.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

/* KORE — a loan application moving through its stages. */
export function KoreDemo() {
  const { t } = useLanguage();
  const KORE_STEPS = t.demos.kore.steps;
  const { ref, step } = useLoop<HTMLDivElement>(KORE_STEPS.length + 1, 1100);
  const done = Math.min(step, KORE_STEPS.length - 1);
  return (
    <div ref={ref} className={styles.kore}>
      <div className={styles.koreHead}>
        <span>{t.demos.kore.case}</span>
        <strong>€ 15.000</strong>
      </div>
      <ol className={styles.koreSteps}>
        {KORE_STEPS.map((label, i) => (
          <li key={label} data-state={i < done ? "done" : i === done ? "now" : "next"}>
            <span className={styles.koreDot}>{i < done || (i === done && i === 3) ? "✓" : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className={styles.koreBar}>
        <motion.span animate={{ width: `${((done + 1) / KORE_STEPS.length) * 100}%` }} transition={{ duration: 0.6, ease }} />
      </div>
    </div>
  );
}

/* ARGO — reads a document, the data falls out already in order. */
export function ArgoDemo() {
  const { t } = useLanguage();
  const ARGO_FIELDS = t.demos.argo;
  const { ref, step } = useLoop<HTMLDivElement>(ARGO_FIELDS.length + 2, 900);
  return (
    <div ref={ref} className={styles.argo}>
      <div className={styles.doc} aria-hidden>
        <span className={styles.docTitle} />
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={styles.docLine} style={{ width: `${55 + ((i * 37) % 40)}%` }} />
        ))}
        <span className={styles.scan} />
      </div>
      <ul className={styles.fields}>
        {ARGO_FIELDS.map(([k, v], i) => (
          <li key={k} data-visible={i < step}>
            <span>{k}</span>
            <strong>{v}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ALL MESSAGE — four apps, one thread. */
const CHANNELS = {
  wa: { label: "WhatsApp", color: "#25D366", short: "WA" },
  ig: { label: "Instagram", color: "#E1306C", short: "IG" },
  fb: { label: "Facebook", color: "#1877F2", short: "FB" },
  em: { label: "Email", color: "#A7A2BB", short: "@" },
} as const;

const THREAD_CHANNELS: (keyof typeof CHANNELS)[] = ["ig", "wa", "em", "fb"];

export function AllMessageDemo() {
  const { t } = useLanguage();
  const THREAD = t.demos.allmessage.thread.map((text, i) => ({ ch: THREAD_CHANNELS[i], text }));
  const { ref, step } = useLoop<HTMLDivElement>(THREAD.length + 2, 1000);
  const visible = THREAD.slice(0, Math.min(step, THREAD.length));
  return (
    <div ref={ref} className={styles.allm}>
      <ul className={styles.channels}>
        {Object.entries(CHANNELS).map(([id, c]) => {
          const active = visible.length > 0 && visible[visible.length - 1].ch === id;
          return (
            <li key={id} data-active={active} style={{ "--c": c.color } as React.CSSProperties}>
              <span>{c.short}</span>
              {c.label}
            </li>
          );
        })}
      </ul>
      <div className={styles.thread}>
        <p className={styles.threadHead}>{t.demos.allmessage.head}</p>
        <AnimatePresence initial={false}>
          {visible.map((m) => (
            <motion.p
              key={m.text}
              className={styles.bubble}
              style={{ "--c": CHANNELS[m.ch].color } as React.CSSProperties}
              initial={{ opacity: 0, x: -16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease }}
            >
              <span>{CHANNELS[m.ch].short}</span>
              {m.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* MILO — the AI agent that asks the right questions. */
export function MiloDemo() {
  const { t } = useLanguage();
  const CHAT = t.demos.milo.map((text, i) => ({ from: i % 2 === 0 ? ("user" as const) : ("milo" as const), text }));
  const { ref, step } = useLoop<HTMLDivElement>(CHAT.length * 2 + 2, 800);
  const shown = Math.min(Math.floor((step + 1) / 2), CHAT.length);
  const typing = step % 2 === 1 && shown < CHAT.length && CHAT[shown]?.from === "milo";
  return (
    <div ref={ref} className={styles.milo}>
      <AnimatePresence initial={false}>
        {CHAT.slice(0, shown).map((m) => (
          <motion.p
            key={m.text}
            className={styles.msg}
            data-from={m.from}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            {m.text}
          </motion.p>
        ))}
        {typing && (
          <motion.p key="typing" className={`${styles.msg} ${styles.typing}`} data-from="milo" exit={{ opacity: 0 }}>
            <i />
            <i />
            <i />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
