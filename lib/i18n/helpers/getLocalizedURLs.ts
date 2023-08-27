import type { ResolveLocaleOptions } from '../types'
import getLocalizedURL from './getLocalizedURL'

/**
 * Returns all localized versions of a URL based on the specified
 * `supportedLocales`.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocaleOptions}.
 *
 * @returns The localized URLs.
 */
export default function getLocalizedURLs(url: string, { defaultLocale, resolveStrategy, supportedLocales }: ResolveLocaleOptions): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, supportedLocales }))
}
