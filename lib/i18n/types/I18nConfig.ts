import Locale from './Locale'
import Translations from './Translations'

/**
 * Properties defining i18n localization behavior.
 */
type I18nConfig = {
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

export default I18nConfig
