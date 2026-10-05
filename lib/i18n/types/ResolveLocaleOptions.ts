import { type LocaleChangeStrategy } from './LocaleChangeStrategy.js'

/**
 * Options that determine how locales are resolved from a URL.
 */
export type ResolveLocaleOptions = {
  /**
   * The locale to fallback to when one cannot be inferred. It must be one of
   * `supportedLocales`.
   */
  defaultLocale: string

  /**
   * @see {@link LocaleChangeStrategy}
   */
  localeChangeStrategy: LocaleChangeStrategy

  /**
   * The locales the application supports, as broad or as specific as needed,
   * e.g. `['en', 'ja', 'zh-Hant']`.
   *
   * Under the `path` and `query` change strategies, these are also the locales
   * that may appear in URLs, the default locale being represented by an
   * unlocalized URL.
   */
  supportedLocales: string[]
}
