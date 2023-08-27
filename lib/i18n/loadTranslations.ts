import type { Translations } from './types'

/**
 * Loads translations from a directory via Webpack `RequireContext`.
 *
 * @param ctx - See {@link __WebpackModuleApi.RequireContext}.
 *
 * @returns The translations dictionary.
 */
export default function loadTranslations(ctx: __WebpackModuleApi.RequireContext): Translations {
  const translations: Translations = {}

  try {
    for (const key of ctx.keys()) {
      const phrases = ctx(key)
      const parts = key.replace('./', '').split('/')

      let t: any = translations

      for (const part of parts) {
        const subkey = part.replace('.json', '')
        t[subkey] = part.endsWith('.json') ? phrases : {}
        t = t[subkey]
      }
    }
  }
  catch (err) {
    console.error('Loading translations...', 'ERR', err)
  }

  return translations
}
