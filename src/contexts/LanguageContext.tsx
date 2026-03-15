"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

const messages: Record<string, Record<string, unknown>> = { en, zh };

export type Locale = "en" | "zh";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function get(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const t = useCallback(
    (key: string) => {
      const dict = messages[locale];
      return get(dict as Record<string, unknown>, key) ?? key;
    },
    [locale]
  );
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
