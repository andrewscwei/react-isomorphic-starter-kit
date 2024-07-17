import { type Locale } from './Locale.js'
import { type URLParts } from './URLParts.js'

/**
 * Options that determine how locales are resolved from a URL.
 */
export type ResolveLocaleOptions = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale: Locale

  /**
   * An array of supported locales to validate the inferred locale against. If
   * it doesn't exist in the list of supported locales, the default locale (if
   * specified) or `undefined` will be returned.
   */
  supportedLocales: Locale[]

  /**
   * Specifies where in the URL the locale should be matched:
   *
   * 1. `auto`: The locale is automatically inferred.
   * 2. `domain`: The locale is specified in the domain name, i.e.
   *              `en.example.com`.
   * 3. `path`: The locale is specified in the path, i.e. `example.com/en/`/
   * 4. `query`: The locale is specified in the query parameters, i.e.
   *             `example.com/?lang=en`/
   * 5. `custom`: The locale is inferred using a custom function.
   */
  resolveStrategy: 'auto' | 'domain' | 'path' | 'query' | 'custom'

  /**
   * Custom resolver function.
   *
   * @param protocol - The matched protocol of the provided url, if available.
   * @param host - The matched host of the provided url, if available.
   * @param port - The matched port of the provided url, if available.
   * @param path - The matched path of the provided url, if available.
   *
   * @returns The resolved locale.
   */
  resolver?: (urlParts: URLParts) => Locale | undefined
}
