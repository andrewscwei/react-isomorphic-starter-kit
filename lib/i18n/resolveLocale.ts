export type ResolveLocaleOptions = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * An array of supported locales to validate the inferred locale against. If
   * it doesn't exist in the list of supported locales, the default locale (if
   * specified) or `undefined` will be returned.
   */
  supportedLocales?: string[]
}

/**
 * Resolves the specified locale with the provided options. All parameters are
 * optional.
 *
 * @param locale - The locale to resolve.
 * @param options - See {@link ResolveLocaleOptions}.
 *
 * @returns - The resolved locale.
 */
export default function resolveLocale(locale?: string, { defaultLocale, supportedLocales }: ResolveLocaleOptions = {}): string | undefined {
  if (supportedLocales) {
    if (locale && supportedLocales.indexOf(locale) >= 0) return locale
    if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) return defaultLocale

    return undefined
  }

  return locale ?? defaultLocale
}
