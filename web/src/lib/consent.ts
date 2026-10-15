"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent, GDPR-style:
 * - "necessary" is always on (language choice, this very consent record);
 * - every optional category starts OFF and is only enabled by an explicit action;
 * - the choice expires after 6 months (Garante Privacy guidelines), then we ask again;
 * - bumping CONSENT_VERSION (e.g. a new tracking tool) asks everyone again.
 */

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "onetech-consent";
const CHANGE_EVENT = "onetech-consent-change";
const OPEN_EVENT = "onetech-open-cookie-preferences";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

export type ConsentCategories = { analytics: boolean };

export type Consent = ConsentCategories & {
  version: number;
  /** ISO date: kept as proof of when the choice was made. */
  decidedAt: string;
};

let cachedRaw: string | null | undefined;
let cached: Consent | null = null;
let memory: string | null = null; // fallback when storage is blocked

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return memory;
  }
}

/** Returns the stored choice, or null when we still have to ask. Stable reference between calls. */
function getSnapshot(): Consent | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = null;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Consent;
    const fresh = Date.now() - new Date(parsed.decidedAt).getTime() < MAX_AGE_MS;
    if (parsed.version === CONSENT_VERSION && fresh) cached = parsed;
  } catch {
    /* corrupted entry: ask again */
  }
  return cached;
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Deletes analytics cookies already set (e.g. after a withdrawal). */
function clearAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat)/.test(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

export function saveConsent(categories: ConsentCategories) {
  const previous = getSnapshot();
  const value: Consent = { ...categories, version: CONSENT_VERSION, decidedAt: new Date().toISOString() };
  const raw = JSON.stringify(value);
  memory = raw;
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* storage blocked: `memory` keeps the choice for this visit */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));

  // Withdrawing consent must actually stop tracking: wipe cookies and reload
  // so scripts already running are gone too.
  if (previous?.analytics && !categories.analytics) {
    clearAnalyticsCookies();
    location.reload();
  }
}

export function useConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

/** Reopen the preferences panel from anywhere (footer link, privacy page). */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookiePreferences(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}
