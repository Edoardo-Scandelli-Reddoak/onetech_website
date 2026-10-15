"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Steps through 0..length-1 on a timer, only while the element is on screen.
 * Reduced-motion users get the final, complete state.
 */
export function useLoop<T extends Element>(length: number, interval = 1200) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % length), interval);
    return () => clearInterval(id);
  }, [reduced, inView, length, interval]);

  return { ref, step: reduced ? length - 1 : step };
}
