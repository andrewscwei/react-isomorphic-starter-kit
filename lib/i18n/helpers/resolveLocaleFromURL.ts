import type { ResolveLocaleOptions } from '../types'
import { parseURL } from './parseURL'

type Result = {
  /**
   * The matched locale.
   */
  locale: string

  /**
   * Specifies where in the URL the locale was matched.
   */
  resolveStrategy: Required<ResolveLocaleOptions>['resolveStrategy']
}

/**
 * Retrieves the locale identifier from a URL. The default behavior of this
 * function is to look for the locale identifier in the domain first, followed
 * by the first directory of the path. You can also provide a custom resolver.
 *
 * @param url The URL, can be a full URL or a valid path.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The result of the resolution if successful, `undefined` otherwise.
 */
export function resolveLocaleFromURL(url: string, { defaultLocale, resolver, resolveStrategy = 'auto', supportedLocales = [] }: Partial<ResolveLocaleOptions> = {}): Result | undefined {
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
