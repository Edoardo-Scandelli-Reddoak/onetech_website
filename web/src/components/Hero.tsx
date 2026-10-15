"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useMotionOff } from "@/lib/a11y";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Thread } from "./hero/Thread";
import styles from "./Hero.module.css";

type Kind = "file" | "chat" | "mail" | "alert" | "call";

/** Where each piece of Monday-morning chaos sits (percent of the stage). Order matches the copy. */
const LAYOUT: { x: number; y: number; my?: number; kind: Kind; mobile: boolean }[] = [
  { x: 16, y: 15, kind: "file", mobile: true }, // contract pdf
  { x: 68, y: 13, my: 26, kind: "chat", mobile: true }, // WhatsApp
  { x: 85, y: 34, kind: "mail", mobile: false }, // unread email
  { x: 26, y: 84, kind: "alert", mobile: true }, // missing document
  { x: 74, y: 78, my: 72, kind: "chat", mobile: true }, // Instagram
  { x: 50, y: 24, kind: "call", mobile: false }, // missed calls
  { x: 54, y: 91, kind: "alert", mobile: false }, // wrong IBAN
  { x: 13, y: 64, my: 60, kind: "mail", mobile: true }, // meeting moved
  { x: 88, y: 91, kind: "file", mobile: false }, // scan jpg
  { x: 30, y: 28, kind: "alert", mobile: false }, // call back
];

const ICONS: Record<Kind, React.ReactNode> = {
  file: <path d="M15 7 8.5 13.5a2 2 0 0 0 3 3L18 10a4 4 0 0 0-6-6l-6.5 6.5a6 6 0 0 0 9 9L19 15" />,
  chat: <path d="M5 5h14v10H9l-4 4z" />,
  mail: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  call: <path d="M6 4h3l2 5-2 1.5a11 11 0 0 0 4.5 4.5L15 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 2-2z" />,
  alert: <path d="M12 7v6M12 17h.01" />,
};

/** Seconds: a beat to see the mess, then three seconds to untangle it. */
const HOLD = 0.6;
const DURATION = 3;

function Fragment({ text, index, progress }: { text: string; index: number; progress: MotionValue<number> }) {
  const f = LAYOUT[index];
  // Pulled into the thread from the right, in step with the thread itself.
  const start = 0.03 + (1 - f.x / 100) * 0.3;
  const end = start + 0.17;
  const y = useTransform(progress, [start, end], ["0vh", `${50 - f.y}vh`]);
  const scale = useTransform(progress, [start, end], [1, 0.12]);
  const opacity = useTransform(progress, [start, end - 0.04], [1, 0]);

  return (
    <motion.div
      className={styles.fragment}
      data-kind={f.kind}
      data-mobile={f.mobile}
      style={{ "--x": `${f.x}%`, "--y": `${f.y}%`, "--my": `${f.my ?? f.y}%`, y, scale, opacity } as MotionStyle}
    >
      <span className={styles.float} style={{ animationDelay: `${-index * 0.7}s` }}>
        <span className={styles.icon}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[f.kind]}
          </svg>
        </span>
        {text}
      </span>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const reduced = useMotionOff();
  const p = useMotionValue(0);

  // Plays on its own: no scrolling required. Reduced motion jumps straight to the calm end state.
  useEffect(() => {
    if (reduced) {
      p.set(1);
      return;
    }
    const controls = animate(p, 1, { delay: HOLD, duration: DURATION, ease: [0.45, 0, 0.2, 1] });
    return () => controls.stop();
  }, [p, reduced]);

  const hardOpacity = useTransform(p, [0.4, 0.56], [1, 0.22]);
  const answerOpacity = useTransform(p, [0.48, 0.62], [0, 1]);
  const answerY = useTransform(p, [0.48, 0.62], [50, 0]);
  const footOpacity = useTransform(p, [0.68, 0.82], [0, 1]);
  const footY = useTransform(p, [0.68, 0.82], [30, 0]);
  const footEvents = useTransform(p, (v) => (v > 0.72 ? "auto" : "none"));


  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.glow} aria-hidden />

      <h1 id="hero-title" className={styles.title}>
        <motion.span className={styles.hard} style={{ opacity: hardOpacity }}>
          {h.hard}
        </motion.span>{" "}
        <motion.span className={`${styles.answer} serif`} style={{ opacity: answerOpacity, y: answerY }}>
          {h.answer}
        </motion.span>
      </h1>

      <Thread progress={p} still={reduced} className={styles.thread} />

      {/* Labels sit above the thread so they always stay readable. */}
      <div className={styles.layer} aria-hidden>
        {h.fragments.slice(0, LAYOUT.length).map((text, i) => (
          <Fragment key={i} text={text} index={i} progress={p} />
        ))}
      </div>


      <motion.div className={styles.foot} style={{ opacity: footOpacity, y: footY, pointerEvents: footEvents }}>
        <p className={styles.sub}>{h.sub}</p>
        <div className={styles.actions}>
          <a href="#contatti" className="btn btn-primary">
            {h.ctaPrimary} <span className="arrow">→</span>
          </a>
          <a href="#difficile" className="btn btn-ghost">
            {h.ctaSecondary} <span className="arrow">↓</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
