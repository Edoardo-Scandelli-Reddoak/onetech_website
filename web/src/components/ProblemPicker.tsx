"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ENGINES } from "@/lib/content";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Problem } from "@/lib/i18n/dictionaries";
import { ProblemIcon } from "./ProblemIcon";
import { SectionHead } from "./SectionHead";
import styles from "./ProblemPicker.module.css";

type CardProps = { p: Problem; index: number; total: number; open: boolean; onToggle: () => void };

function ProblemCard({ p, index, total, open, onToggle }: CardProps) {
  const { t } = useLanguage();
  const c = t.problems;
  const engine = ENGINES.find((e) => e.id === p.engine);
  const href = engine ? `#motore-${engine.id}` : "#tailor-lab";
  const name = engine ? engine.name : "Tailor Lab";

  return (
    <motion.article
      className={styles.card}
      data-open={open}
      tabIndex={0}
      onClick={() => {
        // Touch screens have no hover: a tap flips the card instead.
        if (window.matchMedia("(hover: none)").matches) onToggle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) onToggle();
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`${c.cardLabel} ${index + 1}: ${p.problem}`}
    >
      {/* Front — the problem, the only thing to read. */}
      <div className={styles.front}>
        <div className={styles.top}>
          <span className={styles.icon}>
            <ProblemIcon name={p.icon} />
          </span>
          <span className={styles.count}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <p className={styles.label}>{c.labelProblem}</p>
        <p className={styles.problem}>“{p.problem}”</p>
        <p className={styles.hint}>
          <span className={styles.hintHover}>{c.hintHover}</span>
          <span className={styles.hintTouch}>{c.hintTouch}</span>
          <span className={styles.hintDot} aria-hidden>
            →
          </span>
        </p>
      </div>

      {/* Back — the answer, revealed with a circular wipe. */}
      <div className={styles.back} aria-hidden={!open}>
        <div className={styles.top}>
          <span className={styles.engine}>{name}</span>
          <span className={styles.solved}>{c.solved}</span>
        </div>
        <p className={styles.labelBack}>{c.labelSolution}</p>
        <p className={styles.solution}>{p.solution}</p>
        <p className={styles.detail}>{p.detail}</p>
        <a href={href} className={styles.cta} onClick={(e) => e.stopPropagation()}>
          {c.discover} {name} <span className="arrow">→</span>
        </a>
      </div>
    </motion.article>
  );
}

export function ProblemPicker() {
  const { t } = useLanguage();
  const c = t.problems;
  const [openId, setOpenId] = useState<string | null>(null);
  const [desktop, setDesktop] = useState(false);
  const [travel, setTravel] = useState(0);
  const [progress, setProgress] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Desktop: vertical scroll drives the row sideways. Mobile: native swipe.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setDesktop(mq.matches);
      const t = trackRef.current;
      if (t) setTravel(Math.max(0, t.scrollWidth - t.clientWidth));
    };
    measure();
    mq.addEventListener("change", measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      mq.removeEventListener("change", measure);
      ro.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  useMotionValueEvent(scrollYProgress, "change", (v) => desktop && setProgress(v));

  const onTrackScroll = () => {
    const t = trackRef.current;
    if (!desktop && t) setProgress(t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth));
  };

  const nudge = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const step = (t.firstElementChild as HTMLElement)?.offsetWidth ?? 360;
    if (desktop && pinRef.current) {
      const top = pinRef.current.getBoundingClientRect().top + window.scrollY;
      const target = top + (progress * travel + dir * (step + 16));
      window.scrollTo({ top: Math.max(top, Math.min(top + travel, target)), behavior: "smooth" });
    } else {
      t.scrollBy({ left: dir * (step + 16), behavior: "smooth" });
    }
  };

  return (
    <section id="difficile" className={styles.section} aria-labelledby="difficile-title">
      <div className="container">
        <SectionHead
          id="difficile-title"
          title={
            <>
              {c.title[0]}
              <em>{c.title[1]}</em>
              {c.title[2]}
            </>
          }
          intro={c.intro}
        />
      </div>

      <div ref={pinRef} className={styles.pin} style={desktop ? { height: `calc(100svh + ${travel}px)` } : undefined}>
        <div className={styles.sticky}>
          <div className={styles.viewport}>
            <motion.div
              ref={trackRef}
              className={styles.track}
              style={desktop ? { x } : undefined}
              onScroll={onTrackScroll}
              data-desktop={desktop}
            >
              {c.items.map((p, i) => (
                <ProblemCard
                  key={p.id}
                  p={p}
                  index={i}
                  total={c.items.length}
                  open={openId === p.id}
                  onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
                />
              ))}
            </motion.div>
          </div>

          <div className={`container ${styles.controls}`}>
            <div className={styles.bar} aria-hidden>
              <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
            </div>
            <div className={styles.arrows}>
              <button onClick={() => nudge(-1)} aria-label={c.prev} disabled={progress <= 0.01}>
                ←
              </button>
              <button onClick={() => nudge(1)} aria-label={c.next} disabled={progress >= 0.99}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
