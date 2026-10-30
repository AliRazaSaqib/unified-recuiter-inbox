import { createContext } from "react";
import type { Locale } from "./dictionary";

export interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tList: <T>(key: string) => T[];
}

export const I18nContext = createContext<I18nValue | null>(null);
