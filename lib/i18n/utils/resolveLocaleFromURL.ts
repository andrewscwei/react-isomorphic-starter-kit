import { type Locale, type ResolveLocaleOptions } from '../types/index.js'
import { parseURL } from './parseURL.js'

type Result = {
  /**
   * The matched locale.
   */
  locale: Locale

  /**
   * Specifies where in the URL the locale was matched.
   */
  resolveStrategy: ResolveLocaleOptions['resolveStrategy']
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
export function resolveLocaleFromURL(url: string, {
  defaultLocale,
  resolver, resolveStrategy = 'auto', supportedLocales = [],
}: Partial<ResolveLocaleOptions> = {}): Result | undefined {
  const result = resolver
    ? manualResolveLocaleFromURL(url, { resolver, supportedLocales })
    : autoResolveLocaleFromURL(url, { resolveStrategy, supportedLocales })

  if (result) {
    return result
  }
  else if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) {
    return { locale: defaultLocale, resolveStrategy: 'auto' }
  }
  else {
    return undefined
  }
}

function manualResolveLocaleFromURL(url: string, {
  resolver,
  supportedLocales = [],
}: Omit<Required<ResolveLocaleOptions>, 'defaultLocale' | 'resolveStrategy'>): Result | undefined {
  const matchedLocale = resolver?.(url)

  if (matchedLocale && supportedLocales.indexOf(matchedLocale) >= 0) return { locale: matchedLocale, resolveStrategy: 'custom' }

  return undefined
}

function autoResolveLocaleFromURL(url: string, {
  resolveStrategy,
  supportedLocales,
}: Omit<ResolveLocaleOptions, 'defaultLocale' | 'resolver'>): Result | undefined {
  const parts = parseURL(url)
  const matchedLocaleFromHost = parts.host?.split('.').filter(t => t)[0] as Locale
  const matchedLocaleFromPath = parts.path?.split('/').filter(t => t)[0] as Locale
  const matchedLocaleFromQuery = new URLSearchParams(parts.query).get('locale') as Locale

  if (matchedLocaleFromHost && (resolveStrategy === 'auto' || resolveStrategy === 'domain') && (supportedLocales.indexOf(matchedLocaleFromHost) >= 0)) {
    return {
      locale: matchedLocaleFromHost,
      resolveStrategy: 'domain',
    }
  }

  if (matchedLocaleFromPath && (resolveStrategy === 'auto' || resolveStrategy === 'path') && (supportedLocales.indexOf(matchedLocaleFromPath) >= 0)) {
    return {
      locale: matchedLocaleFromPath,
      resolveStrategy: 'path',
    }
  }

  if (matchedLocaleFromQuery && (resolveStrategy === 'auto' || resolveStrategy === 'query') && (supportedLocales.indexOf(matchedLocaleFromQuery) >= 0)) {
    return {
      locale: matchedLocaleFromQuery,
      resolveStrategy: 'query',
    }
  }

  return undefined
}
