import { type ResolveLocaleOptions } from './ResolveLocaleOptions.js'
import { type TranslationsByLocale } from './Translations.js'

/**
 * Configuration for i18n behavior.
 */
export type I18nConfig = {
  /**
   * Dictionary of all translations, keyed by locale.
   */
  translations: TranslationsByLocale
} & ResolveLocaleOptions
