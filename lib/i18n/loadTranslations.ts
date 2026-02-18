import { type Translations } from './types/Translations.js'

/**
 * Loads translations from a directory via Webpack `RequireContext`.
 *
 * @param sources The translation files.
 *
 * @returns The translations dictionary.
 */
export function loadTranslations(sources: Record<string, any>[]): Translations {
  const translations: Translations = {}

  for (const source of sources) {
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue

      const phrases = source[key].default
      const parts = key.replace(/.*\/locales/i, '').split('/').filter(Boolean)

      let t: any = translations

      for (const part of parts) {
        const subkey = part.replace('.json', '')
        t[subkey] = deepMerge(t[subkey], part.endsWith('.json') ? phrases : {})
        t = t[subkey]
      }
    }
  }

  return translations
}

function deepMerge(target: Record<string, any>, ...sources: Record<string, any>[]) {
  if (!sources.length) return target
  const source = sources.shift()

  let result = target

  if (typeof result !== 'object' || result === null) result = {}
  if (typeof source !== 'object' || source === null) return result

  for (const key of Object.keys(source)) {
    const value = source[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!result[key] || typeof result[key] !== 'object') {
        result[key] = {}
      }

      deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  }

  return deepMerge(result, ...sources)
}
