import { useCallback, useMemo, useState, type ReactNode } from "react";
import { I18nContext, type I18nValue } from "./context";
import {
  DEFAULT_LOCALE,
  setActiveLocale,
  translate,
  translateList,
  type Locale,
} from "./dictionary";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  const setLocale = useCallback((next: Locale) => {
    setActiveLocale(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(key, vars, locale),
      tList: (key) => translateList(key, locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
