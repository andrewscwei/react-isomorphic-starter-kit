import { type TranslationsByLocale } from './types/Translations.js'

const UNSAFE_KEYS = ['__proto__', 'constructor', 'prototype']

/**
 * Loads translations from eagerly imported translation files, keyed by their
 * path relative to their translations directory, e.g. the result of Vite's
 * `import.meta.glob` with `eager: true` and `base` set to that directory.
 *
 * Every file or directory directly in the translations directory is named after
 * a locale, e.g. `./en-GB.json` or `./en-GB/common.json`, nested directories
 * and files becoming nested keys.
 *
 * @param sources The imported translation files, keyed by relative path.
 *
 * @returns The translations dictionary.
 */
export function loadTranslations(sources: Record<string, any>[]): TranslationsByLocale {
  const translations: TranslationsByLocale = {}

  for (const files of sources) {
    for (const path of Object.keys(files)) {
      if (!path.startsWith('./')) throw Error(`Translation file path "${path}" must be relative to its translations directory`)

      const parts = path.slice(2).split('/').filter(Boolean)

      let t: any = translations

      parts.forEach((part, i) => {
        const isFile = i === parts.length - 1
        const subkey = isFile ? part.replace(/\.[^./]+$/, '') : part
        t[subkey] = deepMerge(t[subkey], isFile ? files[path].default : {})
        t = t[subkey]
      })
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
    if (UNSAFE_KEYS.includes(key)) continue

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
