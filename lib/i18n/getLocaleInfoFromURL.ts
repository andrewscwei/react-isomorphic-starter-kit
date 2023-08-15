import parseURL from './parseURL'

type Options = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * Specifies where in the URL the locale should be matched. If `resolver` is
   * provided, this option is ignored.
   */
  resolveStrategy?: 'auto' | 'domain' | 'path' | 'query' | 'custom'

  /**
   * An array of supported locales to validate the inferred locale against. If
   * it doesn't exist in the list of supported locales, the default locale (if
   * specified) or `undefined` will be returned.
   */
  supportedLocales?: string[]

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
  resolver?: (urlParts: ReturnType<typeof parseURL>) => string | undefined
}

type Output = {
  /**
   * The matched locale.
   */
  locale: string

  /**
   * Specifies where in the URL the locale was matched.
   */
  resolveStrategy: 'auto' | 'domain' | 'path' | 'query' | 'custom'
}

/**
 * Retrieves the locale identifier from a URL. The default behavior of this
 * function to look for the locale identifier in the domain first followed by
 * the first directory of the path. You can provide a custom resolver.
 *
 * @param url - The URL, can be a full URL or a valid path.
 * @param options - See {@link Options}.
 *
 * @returns The inferred locale if it exists.
 */
export default function getLocaleInfoFromURL(url: string, {
  defaultLocale,
  resolver,
  resolveStrategy = 'auto',
  supportedLocales,
}: Options = {}): Output | undefined {
  const parts = parseURL(url)

  if (resolver) {
    const matchedLocale = resolver(parts)

    if (matchedLocale && (!supportedLocales || supportedLocales.indexOf(matchedLocale) >= 0)) return { locale: matchedLocale, resolveStrategy: 'custom' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
  else {
    const matchedLocaleFromHost = parts.host?.split('.').filter(t => t)[0]
    const matchedLocaleFromPath = parts.path?.split('/').filter(t => t)[0]
    const matchedLocaleFromQuery = new URLSearchParams(parts.query).get('locale')

    if (matchedLocaleFromHost && (resolveStrategy === 'auto' || resolveStrategy === 'domain') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromHost) >= 0)) return { locale: matchedLocaleFromHost, resolveStrategy: 'domain' }
    if (matchedLocaleFromPath && (resolveStrategy === 'auto' || resolveStrategy === 'path') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromPath) >= 0)) return { locale: matchedLocaleFromPath, resolveStrategy: 'path' }
    if (matchedLocaleFromQuery && (resolveStrategy === 'auto' || resolveStrategy === 'query') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromQuery) >= 0)) return { locale: matchedLocaleFromQuery, resolveStrategy: 'query' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
}
