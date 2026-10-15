"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

const N = 460; // points along the thread
const LINE_Y = 0.5; // the straight thread sits at mid-screen, right through the headline

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A messy knot that keeps wriggling: the shape of a bad Monday. */
function knot(t: number, time: number, phase: number) {
  const a = t * Math.PI * 2 * 7 + phase;
  const w = time * 0.00025;
  return {
    x: 0.5 + 0.34 * Math.sin(a * 1.0 + w * 3) + 0.14 * Math.sin(a * 2.3 - w * 4 + phase) + 0.04 * Math.cos(a * 6.1 + w * 6),
    y: 0.5 + 0.3 * Math.cos(a * 1.17 - w * 2) + 0.12 * Math.sin(a * 3.1 + w * 5) + 0.04 * Math.sin(a * 5.3 - w * 7),
  };
}

/**
 * One thread, two states. `progress` 0 = tangled, 1 = a single straight line.
 * It's pulled from the right end, so it straightens progressively, like real thread.
 */
type Props = { progress: MotionValue<number>; className?: string; /** No continuous animation: redraw only when progress changes. */ still?: boolean };

export function Thread({ progress, className, still = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    const trace = (time: number, u: number, phase: number) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        // The right end is pulled first; the left end follows.
        const local = ease(clamp(u * 1.7 - (1 - t) * 0.7));
        const k = knot(t, time, phase);
        const sx = -0.04 + t * 1.08;
        pts.push({
          x: (k.x + (sx - k.x) * local) * w,
          y: (k.y + (LINE_Y - k.y) * local) * h,
        });
      }
      return pts;
    };

    const stroke = (pts: { x: number; y: number }[]) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.stroke();
    };

    const draw = (time: number) => {
      const u = clamp(progress.get() / 0.5);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Ghost thread: depth while tangled, merges into the main one when straight.
      ctx.strokeStyle = `rgba(157,135,255,${0.18 * (1 - u)})`;
      ctx.lineWidth = 1.2;
      stroke(trace(time * 0.8, u, 1.7));

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#5a39f0");
      grad.addColorStop(0.5, "#9d87ff");
      grad.addColorStop(1, "#6f4dff");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 + u * 1.5;
      ctx.shadowColor = "rgba(111,77,255,0.8)";
      ctx.shadowBlur = 10 + u * 14;
      const pts = trace(time, u, 0);
      stroke(pts);
      ctx.shadowBlur = 0;

      // Once straight, a spark runs along the line: things are flowing now.
      if (u > 0.98 && !still) {
        const x = ((time * 0.00022) % 1.2) * w - 0.1 * w;
        const g = ctx.createRadialGradient(x, LINE_Y * h, 0, x, LINE_Y * h, 90);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 90, LINE_Y * h - 3, 180, 6);
      }

      if (visible && !still) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const unsubscribe = still ? progress.on("change", () => requestAnimationFrame(draw)) : undefined;
    const ro = new ResizeObserver(() => {
      resize();
      if (still) requestAnimationFrame(draw);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe?.();
      ro.disconnect();
      io.disconnect();
    };
  }, [progress, still]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
