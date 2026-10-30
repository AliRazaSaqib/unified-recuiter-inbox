import en from "./locales/en.json";

export type Locale = "en";

export const DEFAULT_LOCALE: Locale = "en";

type Primitive = string | number;
type DictionaryNode = Primitive | DictionaryNode[] | { [key: string]: DictionaryNode };

export const DICTIONARIES: Record<Locale, DictionaryNode> = { en };

let activeLocale: Locale = DEFAULT_LOCALE;

export function setActiveLocale(locale: Locale) {
  activeLocale = locale;
}

function lookup(source: DictionaryNode, path: string[]): DictionaryNode | undefined {
  return path.reduce<DictionaryNode | undefined>((node, segment) => {
    if (node && typeof node === "object" && !Array.isArray(node)) {
      return (node as Record<string, DictionaryNode>)[segment];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: Record<string, Primitive>) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, token: string) =>
    token in vars ? String(vars[token]) : match,
  );
}

export function resolve(key: string, locale: Locale = activeLocale): DictionaryNode | undefined {
  const path = key.split(".");
  const value = lookup(DICTIONARIES[locale], path);
  if (value !== undefined) return value;
  if (locale !== DEFAULT_LOCALE) return lookup(DICTIONARIES[DEFAULT_LOCALE], path);
  return undefined;
}

export function translate(
  key: string,
  vars?: Record<string, Primitive>,
  locale: Locale = activeLocale,
): string {
  const value = resolve(key, locale);

  if (typeof value === "string") return interpolate(value, vars);
  if (typeof value === "number") return String(value);

  if (import.meta.env.DEV) {
    console.warn(`[i18n] missing or non-string key: ${key}`);
  }
  return key;
}

export function translateList<T>(key: string, locale: Locale = activeLocale): T[] {
  const value = resolve(key, locale);
  if (Array.isArray(value)) return value as T[];

  if (import.meta.env.DEV) {
    console.warn(`[i18n] missing or non-array key: ${key}`);
  }
  return [];
}

export const t = translate;
