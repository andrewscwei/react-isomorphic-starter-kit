import Locale from './Locale'
import LocaleChangeStrategy from './LocaleChangeStrategy'
import Translations from './Translations'

/**
 * Properties defining i18n localization behavior.
 */
type I18nOptions = {
  /**
   * The default locale.
   */
  defaultLocale: Locale

  /**
   * See {@link LocaleChangeStrategy}.
   */
  localeChangeStrategy: LocaleChangeStrategy

  /**
   * Dictionary of all translations.
   */
  translations: Translations
}

export default I18nOptions
