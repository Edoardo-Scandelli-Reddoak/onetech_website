"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Visitor accessibility preferences (bottom-left widget).
 * Stored on this device only and mirrored as data-a11y-* attributes on <html>,
 * so plain CSS (globals.css) does the heavy lifting.
 */

export const TEXT_SIZES = [100, 110, 120, 130] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

export type A11yPrefs = {
  text: TextSize;
  contrast: boolean;
  underline: boolean;
  spacing: boolean;
  motion: boolean; // true = reduce motion
  grayscale: boolean;
};

export const DEFAULT_PREFS: A11yPrefs = {
  text: 100,
  contrast: false,
  underline: false,
  spacing: false,
  motion: false,
  grayscale: false,
};

export const A11Y_STORAGE_KEY = "onetech-a11y";
const EVENT = "onetech-a11y-change";

let cachedRaw: string | null | undefined;
let cached: A11yPrefs = DEFAULT_PREFS;
let memory: string | null = null;

function readRaw() {
  try {
    return localStorage.getItem(A11Y_STORAGE_KEY);
  } catch {
    return memory;
  }
}

function getSnapshot(): A11yPrefs {
  const raw = readRaw();
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    cached = raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    cached = DEFAULT_PREFS;
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Writes <html data-a11y-*> so CSS can react. Also inlined in layout.tsx to avoid a flash on load. */
export function applyA11yAttributes(p: A11yPrefs) {
  const el = document.documentElement;
  const set = (name: string, on: boolean, value = "on") =>
    on ? el.setAttribute(`data-a11y-${name}`, value) : el.removeAttribute(`data-a11y-${name}`);
  set("text", p.text !== 100, String(p.text));
  set("contrast", p.contrast);
  set("underline", p.underline);
  set("spacing", p.spacing);
  set("motion", p.motion, "reduced");
  set("grayscale", p.grayscale);
}

export function saveA11y(next: A11yPrefs) {
  const raw = JSON.stringify(next);
  memory = raw;
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, raw);
  } catch {
    /* storage blocked: `memory` keeps it for this visit */
  }
  applyA11yAttributes(next);
  window.dispatchEvent(new Event(EVENT));
}

export function useA11y() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PREFS);
}

/** True when the OS asks for less motion OR the visitor switched animations off in the widget. */
export function useMotionOff() {
  const system = useReducedMotion();
  const { motion } = useA11y();
  return !!system || motion;
}
