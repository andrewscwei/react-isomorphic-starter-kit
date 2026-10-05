import { sprintf } from 'sprintf-js'

import { type GetLocalizedString } from '../types/GetLocalizedString.js'
import { type I18nConfig } from '../types/I18nConfig.js'
import { type TranslationDict, type TranslationsByLocale } from '../types/Translations.js'
import { negotiateLocale } from './negotiateLocale.js'

const warned = new Set<string>()

/**
 * Creates a function for getting the localized string for a key path in the
 * target locale.
 *
 * A key is looked up in the translations that best match the target locale,
 * from best to worst, e.g. `en-GB` then `en`. A key missing from all of them
 * falls back to the translations of the default locale, and then to the key
 * path itself, warning once for each per module.
 *
 * @param locale The target locale.
 * @param config See {@link I18nConfig}.
 *
 * @returns A function for getting the localized string for a key path in the
 *          target locale.
 */
export function createGetLocalizedString(locale: string, { defaultLocale, translations }: I18nConfig): GetLocalizedString {
  const available = Object.keys(translations)
  const locales = rankLocales(locale, available)
  const defaultLocales = rankLocales(defaultLocale, available).filter(l => !locales.includes(l))

  if (locales.length === 0) warnOnce(`No translations found for locale "${locale}", falling back to the default locale "${defaultLocale}"`)

  return (keyPath: string, ...args) => {
    const str = lookUp(translations, locales, keyPath)
    if (str !== undefined) return sprintf(str, ...args)

    const defaultStr = lookUp(translations, defaultLocales, keyPath)

    if (defaultStr !== undefined) {
      if (locales.length > 0) warnOnce(`Missing translation for "${keyPath}" in locale "${locale}", falling back to the default locale "${defaultLocale}"`)

      return sprintf(defaultStr, ...args)
    }

    warnOnce(`Missing translation for "${keyPath}"`)

    return keyPath
  }
}

/**
 * Logs a warning, at most once per message for the lifetime of the module, so
 * that it is not repeated across renders or server-rendered requests.
 *
 * @param message The warning.
 */
function warnOnce(message: string) {
  if (warned.has(message)) return
  warned.add(message)
  console.warn(message)
}

/**
 * Ranks the available locales by how well they match a locale, best first,
 * leaving out those that do not match at all.
 *
 * @param locale The locale to match.
 * @param available The locales to rank.
 *
 * @returns The matching locales, best first.
 */
function rankLocales(locale: string, available: string[]): string[] {
  const ranked: string[] = []
  let remaining = available

  for (let match = negotiateLocale(locale, remaining); match !== undefined; match = negotiateLocale(locale, remaining)) {
    ranked.push(match)
    remaining = remaining.filter(l => l !== match)
  }

  return ranked
}

/**
 * Returns the first string found for a key path in the translations of a list
 * of locales.
 *
 * @param translations The translations.
 * @param locales The locales to look in, in order of preference.
 * @param keyPath The dot-separated key path.
 *
 * @returns The string, or `undefined` if none of the translations has it.
 */
function lookUp(translations: TranslationsByLocale, locales: string[], keyPath: string): string | undefined {
  for (const locale of locales) {
    const value = getValue(translations[locale] ?? {}, keyPath)
    if (typeof value === 'string') return value
  }

  return undefined
}

/**
 * Returns the value at a key path of a translation dictionary.
 *
 * @param dict The translation dictionary.
 * @param keyPath The dot-separated key path.
 *
 * @returns The value or the nested translation dictionary, or `undefined` if
 *          the key path does not exist.
 */
function getValue(dict: TranslationDict, keyPath: string): string | TranslationDict | undefined {
  let out: string | TranslationDict | undefined = dict

  for (const key of keyPath.split('.')) {
    if (typeof out !== 'object') return undefined
    out = out[key]
  }

  return out
}
