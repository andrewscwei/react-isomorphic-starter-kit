import constructURL, { URLParts } from './constructURL'
import getLocaleInfoFromURL from './getLocaleInfoFromURL'
import getUnlocalizedURL from './getUnlocalizedURL'
import parseURL from './parseURL'
import resolveLocale, { ResolveLocaleOptions } from './resolveLocale'

export type ResolveLocalizedURLOptions = ResolveLocaleOptions & {
  /**
   * Specifies where in the URL the locale should be matched. If `resolver` is
   * provided, this option is ignored.
   */
  resolveStrategy?: 'auto' | 'domain' | 'path' | 'query'

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
  resolver?: (urlParts: URLParts) => string | undefined
}

/**
 * Returns the localized version of a URL.
 *
 * @param url - The URL.
 * @param locale - The target locale.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URL.
 */
export default function getLocalizedURL(url: string, locale: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string {
  const currLocaleInfo = getLocaleInfoFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)
  const targetLocale = resolveLocale(locale, { defaultLocale, supportedLocales })

  if (!targetLocale) return url

  if (targetLocale === defaultLocale) return getUnlocalizedURL(url, { resolveStrategy, resolver, supportedLocales })

  if (currLocaleInfo) {
    switch (currLocaleInfo.resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host.split('.').filter(t => t).slice(1).join('.')}` : undefined })
      case 'query': {
        if (!parts.query) return url

        const searchParams = new URLSearchParams(parts.query)
        if (searchParams.get('locale')) {
          searchParams.set('locale', targetLocale)
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
    }
  }
  else {
    switch (resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host}` : undefined })
      case 'query': {
        const searchParams = new URLSearchParams(parts.query)

        if (targetLocale === defaultLocale) {
          searchParams.delete('locale')
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t)].join('/') : undefined })
    }
  }
}
