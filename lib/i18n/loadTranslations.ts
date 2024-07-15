import { type Translations } from './types/index.js'

/**
 * Loads translations from a directory via Webpack `RequireContext`.
 *
 * @param sources The translation files.
 *
 * @returns The translations dictionary.
 */
export function loadTranslations(sources: Record<string, any>): Translations {
  const translations: Translations = {}

  for (const key in sources) {
    if (!Object.prototype.hasOwnProperty.call(sources, key)) continue

    const phrases = sources[key].default
    const parts = key.replace('./locales', '').split('/').filter(Boolean)

    let t: any = translations

    for (const part of parts) {
      const subkey = part.replace('.json', '')
      t[subkey] = part.endsWith('.json') ? phrases : {}
      t = t[subkey]
    }
  }

  return translations
}
