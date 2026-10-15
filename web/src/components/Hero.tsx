"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Thread } from "./hero/Thread";
import styles from "./Hero.module.css";

type Kind = "file" | "chat" | "mail" | "note" | "alert" | "call";

/** Where each piece of Monday-morning chaos lands on screen (percent of the stage). */
const LAYOUT: { x: number; y: number; r: number; kind: Kind; above: boolean; mobile: boolean }[] = [
  { x: 14, y: 15, r: -6, kind: "file", above: false, mobile: true },
  { x: 66, y: 13, r: 4, kind: "chat", above: true, mobile: true },
  { x: 84, y: 32, r: -3, kind: "mail", above: false, mobile: false },
  { x: 10, y: 68, r: 5, kind: "note", above: true, mobile: true },
  { x: 27, y: 84, r: -2, kind: "alert", above: false, mobile: true },
  { x: 74, y: 78, r: -5, kind: "chat", above: true, mobile: true },
  { x: 88, y: 60, r: 7, kind: "note", above: false, mobile: false },
  { x: 42, y: 9, r: 3, kind: "call", above: false, mobile: false },
  { x: 52, y: 90, r: 2, kind: "alert", above: true, mobile: false },
  { x: 16, y: 40, r: -4, kind: "mail", above: false, mobile: false },
  { x: 90, y: 90, r: -8, kind: "file", above: true, mobile: true },
  { x: 34, y: 27, r: 6, kind: "alert", above: true, mobile: false },
];

const ICON: Record<Kind, string> = {
  file: "📎",
  chat: "💬",
  mail: "✉",
  note: "",
  alert: "!",
  call: "☎",
};

function Fragment({ text, index, progress }: { text: string; index: number; progress: MotionValue<number> }) {
  const f = LAYOUT[index];
  // Pulled into the thread from the right, in step with the thread itself.
  const start = 0.03 + (1 - f.x / 100) * 0.3;
  const end = start + 0.17;
  const y = useTransform(progress, [start, end], ["0vh", `${50 - f.y}vh`]);
  const scale = useTransform(progress, [start, end], [1, 0.12]);
  const opacity = useTransform(progress, [start, end - 0.04], [1, 0]);
  const rotate = useTransform(progress, [start, end], [f.r, 0]);

  return (
    <motion.div
      className={styles.fragment}
      data-kind={f.kind}
      data-mobile={f.mobile}
      style={{ "--x": `${f.x}%`, top: `${f.y}%`, y, scale, opacity, rotate } as MotionStyle}
    >
      <span className={styles.float} style={{ animationDelay: `${-index * 0.7}s` }}>
        {ICON[f.kind] && <i aria-hidden>{ICON[f.kind]}</i>}
        {text}
      </span>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const h = t.hero;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const solved = useMotionValue(1);
  // Reduced motion: no scroll-jacking, just the calm final state.
  const p = reduced ? solved : scrollYProgress;

  const hardOpacity = useTransform(p, [0.4, 0.56], [1, 0.22]);
  const answerOpacity = useTransform(p, [0.48, 0.62], [0, 1]);
  const answerY = useTransform(p, [0.48, 0.62], [50, 0]);
  const bubbleOpacity = useTransform(p, [0.6, 0.72], [0, 1]);
  const bubbleScale = useTransform(p, [0.6, 0.72], [0.85, 1]);
  const bubbleY = useTransform(p, [0.6, 0.72], [24, 0]);
  const footOpacity = useTransform(p, [0.68, 0.82], [0, 1]);
  const footY = useTransform(p, [0.68, 0.82], [30, 0]);
  const footEvents = useTransform(p, (v) => (v > 0.72 ? "auto" : "none"));
  const hintOpacity = useTransform(p, [0, 0.05], [1, 0]);

  const below = h.fragments.map((text, i) => ({ text, i })).filter(({ i }) => !LAYOUT[i].above);
  const above = h.fragments.map((text, i) => ({ text, i })).filter(({ i }) => LAYOUT[i].above);

  return (
    <section ref={ref} id="top" className={styles.hero} data-reduced={!!reduced} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={styles.glow} aria-hidden />

        <div className={styles.layer} aria-hidden>
          {below.map(({ text, i }) => (
            <Fragment key={i} text={text} index={i} progress={p} />
          ))}
        </div>

        <h1 id="hero-title" className={styles.title}>
          <motion.span className={styles.hard} style={{ opacity: hardOpacity }}>
            {h.hard}
          </motion.span>{" "}
          <motion.span className={`${styles.answer} serif`} style={{ opacity: answerOpacity, y: answerY }}>
            {h.answer}
          </motion.span>
        </h1>

        <Thread progress={p} className={styles.thread} />

        <div className={styles.layer} aria-hidden>
          {above.map(({ text, i }) => (
            <Fragment key={i} text={text} index={i} progress={p} />
          ))}
        </div>

        <motion.figure
          className={styles.bubble}
          style={{ opacity: bubbleOpacity, scale: bubbleScale, y: bubbleY }}
          aria-hidden
        >
          <span className={styles.avatar}>G</span>
          <div>
            <figcaption>
              {h.bubble.who} <time>{h.bubble.time}</time>
            </figcaption>
            <p>{h.bubble.text}</p>
          </div>
        </motion.figure>

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

        <motion.a href="#difficile" className={styles.hint} style={{ opacity: hintOpacity }}>
          <span className={styles.mouse} aria-hidden>
            <i />
          </span>
          {h.hint}
        </motion.a>
      </div>
    </section>
  );
}
