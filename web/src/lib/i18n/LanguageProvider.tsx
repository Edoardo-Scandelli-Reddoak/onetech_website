"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { DICTIONARIES, type Dict, type Locale } from "./dictionaries";

const STORAGE_KEY = "onetech-locale";
const EVENT = "onetech-locale-change";

/** Tiny external store: the choice lives in localStorage and survives reloads. */
let memory: Locale | null = null;

function read(): Locale {
  if (memory) return memory;
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "it";
  } catch {
    return "it";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function write(locale: Locale) {
  memory = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage blocked: `memory` keeps the choice for this visit */
  }
  window.dispatchEvent(new Event(EVENT));
}

type Ctx = { locale: Locale; t: Dict; setLocale: (l: Locale) => void };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, read, () => "it" as Locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t: DICTIONARIES[locale], setLocale: write }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
