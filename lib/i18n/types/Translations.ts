/**
 * The translations of one locale, as nested keys with string values.
 */
export type TranslationDict = { [key: string]: string | TranslationDict }

/**
 * The translations of all locales, keyed by locale.
 */
export type TranslationsByLocale = Partial<Record<string, TranslationDict>>
