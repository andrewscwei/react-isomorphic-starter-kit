import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { getUnlocalizedURL } from './getUnlocalizedURL.js'
import { negotiateLocale } from './negotiateLocale.js'
import { splitURL } from './splitURL.js'

/**
 * Returns the localized version of a URL. Under the `path` strategy, relative
 * URLs, e.g. `scan`, `?tab=1` or `#top`, are returned unchanged since their
 * path cannot be localized.
 *
 * @param url The URL.
 * @param locale The target locale.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The localized URL.
 */
export function getLocalizedURL(url: string, locale: string, options: ResolveLocaleOptions): string {
  const { defaultLocale, localeChangeStrategy } = options
  if (localeChangeStrategy === 'action') return url

  const targetLocale = sanitizeLocale(locale, options)
  if (!targetLocale) return url

  const unlocalizedURL = getUnlocalizedURL(url, options)
  if (targetLocale === defaultLocale) return unlocalizedURL

  const { hash, origin, path, search } = splitURL(unlocalizedURL)

  switch (localeChangeStrategy) {
    case 'query': {
      const searchParams = new URLSearchParams(search)
      searchParams.set('locale', targetLocale)

      return `${origin}${path}?${searchParams.toString()}${hash}`
    }
    case 'path':
    default: {
      if (!origin && !path.startsWith('/')) return url

      const localizedPath = path === '' || path === '/' ? `/${targetLocale}` : `/${targetLocale}${path}`

      return `${origin}${localizedPath}${search}${hash}`
    }
  }
}

function sanitizeLocale(locale: string, { defaultLocale, supportedLocales }: ResolveLocaleOptions): string | undefined {
  const match = negotiateLocale(locale, supportedLocales)
  if (match !== undefined) return match
  if (supportedLocales.includes(defaultLocale)) return defaultLocale

  return undefined
}
