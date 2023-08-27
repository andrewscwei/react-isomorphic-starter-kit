import { sprintf } from 'sprintf-js'
import type { GetLocalizedString, I18nConfig, Locale } from '../types'

export default function createGetLocalizedString(locale: Locale | undefined, { defaultLocale, translations }: I18nConfig): GetLocalizedString {
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
