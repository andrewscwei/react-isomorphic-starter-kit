import getLocaleInfoFromURL from './getLocaleInfoFromURL'
import constructURL from './helpers/constructURL'
import parseURL from './helpers/parseURL'

type Options = {
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

/**
 * Returns the unlocalized version of a URL.
 *
 * @param url - The URL.
 * @param options - See {@link Options}.
 *
 * @returns The unlocalized URL.
 */
export default function getUnlocalizedURL(url: string, {
  resolver,
  resolveStrategy = 'auto',
  supportedLocales,
}: Options = {}): string {
  const currLocaleInfo = getLocaleInfoFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)

  if (!currLocaleInfo) return url

  switch (currLocaleInfo.resolveStrategy) {
    case 'domain':
      return constructURL({ ...parts, host: parts.host ? parts.host.split('.').filter(t => t).slice(1).join('.') || '/' : undefined })
    case 'query': {
      if (!parts.query) return url

      const searchParams = new URLSearchParams(parts.query)
      searchParams.delete('locale')

      return constructURL({ ...parts, query: searchParams.toString() })
    }
    case 'path':
    case 'auto':
    default:
      return constructURL({ ...parts, path: parts.path ? [...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
  }
}
