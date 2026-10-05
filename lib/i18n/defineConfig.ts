import { loadTranslations } from './loadTranslations.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type LocaleChangeStrategy } from './types/LocaleChangeStrategy.js'
import { type TranslationsByLocale } from './types/Translations.js'
import { isLocale } from './utils/isLocale.js'

type Params = {
  /**
   * @see {@link I18nConfig.defaultLocale}
   */
  defaultLocale?: string

  /**
   * @see {@link I18nConfig.localeChangeStrategy}
   */
  localeChangeStrategy?: LocaleChangeStrategy

  /**
   * Imported translation files to load translations from when translations are
   * not provided, see {@link loadTranslations}.
   */
  sources?: Record<string, any>[]

  /**
   * @see {@link I18nConfig.supportedLocales}
   */
  supportedLocales?: string[]

  /**
   * @see {@link I18nConfig.translations}
   */
  translations?: TranslationsByLocale
}

export function defineConfig({
  defaultLocale = 'en',
  localeChangeStrategy = 'path',
  sources = [],
  supportedLocales = [defaultLocale],
  translations: providedTranslations,
}: Params): I18nConfig {
  const translations = providedTranslations ?? loadTranslations(sources)

  const invalid = [defaultLocale, ...supportedLocales, ...Object.keys(translations)].find(l => !isLocale(l))
  if (invalid !== undefined) {
    throw Error(`Invalid locale "${invalid}"`)
  }

  if (!supportedLocales.includes(defaultLocale)) {
    throw Error(`Supported locales do not contain the default locale "${defaultLocale}"`)
  }

  return {
    defaultLocale,
    localeChangeStrategy,
    supportedLocales,
    translations,
  }
}
