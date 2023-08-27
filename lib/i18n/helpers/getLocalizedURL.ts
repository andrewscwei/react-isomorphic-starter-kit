import type { ResolveLocaleOptions } from '../types'
import constructURL from './constructURL'
import getUnlocalizedURL from './getUnlocalizedURL'
import parseURL from './parseURL'
import resolveLocaleFromURL from './resolveLocaleFromURL'

/**
 * Returns the localized version of a URL.
 *
 * @param url - The URL.
 * @param locale - The target locale.
 * @param options - See {@link ResolveLocaleOptions}.
 *
 * @returns The localized URL.
 */
export default function getLocalizedURL(url: string, locale: string, { defaultLocale, resolveStrategy, supportedLocales }: ResolveLocaleOptions): string {
  const currLocaleInfo = resolveLocaleFromURL(url, { resolveStrategy, supportedLocales })
  const parts = parseURL(url)
  const targetLocale = sanitizeLocale(locale, { defaultLocale, resolveStrategy, supportedLocales })

  if (!targetLocale) return url

  if (targetLocale === defaultLocale) return getUnlocalizedURL(url, { defaultLocale, resolveStrategy, supportedLocales })

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

function sanitizeLocale(locale: string, { defaultLocale, supportedLocales }: ResolveLocaleOptions): string | undefined {
  if (supportedLocales) {
    if (locale && supportedLocales.indexOf(locale) >= 0) return locale
    if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) return defaultLocale

    return undefined
  }

  return locale ?? defaultLocale
}
