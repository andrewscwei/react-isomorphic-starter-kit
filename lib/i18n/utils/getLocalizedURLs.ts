import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { getLocalizedURL } from './getLocalizedURL.js'

/**
 * Returns all localized versions of a URL based on the provided
 * {@link ResolveLocaleOptions}.
 *
 * @param url The URL.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The localized URLs.
 */
export function getLocalizedURLs(url: string, { defaultLocale, resolveStrategy, supportedLocales }: ResolveLocaleOptions): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, supportedLocales }))
}
