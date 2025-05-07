import type { Locale } from '../types/Locale.js'
import type { ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { constructURL } from './constructURL.js'
import { getUnlocalizedURL } from './getUnlocalizedURL.js'
import { parseURL } from './parseURL.js'

/**
 * Returns the localized version of a URL.
 *
 * @param url The URL.
 * @param locale The target locale.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The localized URL.
 */
export function getLocalizedURL(url: string, locale: Locale, { defaultLocale, resolveStrategy, supportedLocales }: ResolveLocaleOptions): string {
  const parts = parseURL(url)
  const targetLocale = sanitizeLocale(locale, { defaultLocale, resolveStrategy, supportedLocales })

  if (!targetLocale) return url

  if (targetLocale === defaultLocale) return getUnlocalizedURL(url, { defaultLocale, resolveStrategy, supportedLocales })

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
    default: {
      const pathParts = parts.path?.split('/').filter(t => t)
      if (pathParts && supportedLocales.includes(pathParts[0] as Locale)) pathParts.shift()

      return constructURL({
        ...parts,
        path: pathParts ? [targetLocale, ...pathParts].join('/') : undefined,
      })
    }
  }
}

function sanitizeLocale(locale: Locale, { defaultLocale, supportedLocales }: ResolveLocaleOptions): Locale | undefined {
  if (supportedLocales) {
    if (locale && supportedLocales.indexOf(locale) >= 0) return locale
    if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) return defaultLocale

    return undefined
  }

  return locale ?? defaultLocale
}
