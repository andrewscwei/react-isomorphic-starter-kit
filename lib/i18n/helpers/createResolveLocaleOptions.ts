import { type I18nConfig, type ResolveLocaleOptions } from '../types'

/**
 * Creates {@link ResolveLocaleOptions} from {@link I18nConfig}.
 *
 * @param params The target {@link I18nConfig}.
 *
 * @returns The corresponding {@link ResolveLocaleOptions}.
 */
export function createResolveLocaleOptions({ defaultLocale, localeChangeStrategy, translations }: I18nConfig): ResolveLocaleOptions {
  const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
  const supportedLocales = Object.keys(translations)

  if (supportedLocales.indexOf(defaultLocale) < 0) console.warn(`Provided supported locales do not contain the default locale <${defaultLocale}>`)

  return {
    defaultLocale,
    resolveStrategy,
    supportedLocales,
  }
}
