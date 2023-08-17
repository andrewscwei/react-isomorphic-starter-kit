import { I18nOptions, ResolveLocaleOptions } from '../types'

export default function createResolveLocaleOptions({ defaultLocale, localeChangeStrategy, translations }: I18nOptions): ResolveLocaleOptions {
  const resolveStrategy = localeChangeStrategy === 'path' ? 'path' : 'query'
  const supportedLocales = Object.keys(translations)

  if (supportedLocales.indexOf(defaultLocale) < 0) console.warn(`Provided supported locales do not contain the default locale <${defaultLocale}>`)

  return {
    defaultLocale,
    resolveStrategy,
    supportedLocales,
  }
}
