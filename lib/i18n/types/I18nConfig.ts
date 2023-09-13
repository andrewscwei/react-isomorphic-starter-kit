import { type Locale } from './Locale'
import { type Translations } from './Translations'

/**
 * Configuration for i18n behavior.
 */
export type I18nConfig = {
  /**
   * The default locale.
   */
  defaultLocale: Locale

  /**
   * Specifies how locale will be changed:
   * 1. `action`: Locale is changed by dispatching an action.
   * 2. `path`: Locale is changed by altering the path of the URL.
   * 3. `query`: Locale is changed by altering the query parameters of the URL.
   */
  localeChangeStrategy: 'action' | 'path' | 'query'

  /**
   * Dictionary of all translations.
   */
  translations: Translations
}
