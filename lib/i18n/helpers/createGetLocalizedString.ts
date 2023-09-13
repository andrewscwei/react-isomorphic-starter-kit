import { sprintf } from 'sprintf-js'
import { type GetLocalizedString, type I18nConfig, type Locale } from '../types'

/**
 * Creates a function for getting the localized string for a key path in the
 * target locale.
 *
 * @param locale The target locale.
 * @param config See {@link I18nConfig}.
 *
 * @returns A function for getting the localized string for a key path the
 *          target locale.
 */
export function createGetLocalizedString(locale: Locale | undefined, { defaultLocale, translations }: I18nConfig): GetLocalizedString {
  const dict = translations[locale ?? defaultLocale]

  return (keyPath: string, ...args) => {
    if (!dict) {
      console.warn(`No translations found for locale "${locale}"`)

      return keyPath
    }

    const keys = keyPath.split('.')

    let str: any = dict

    try {
      while (keys.length > 0) {
        const key = keys.shift()
        if (!key || typeof key !== 'string') throw Error(`Invalid key "${key}"`)
        str = str[key]
      }
    }
    catch (err) {
      return keyPath
    }

    if (typeof str !== 'string') return keyPath

    return sprintf(str, ...args)
  }
}
