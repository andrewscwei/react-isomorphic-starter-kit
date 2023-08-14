import getLocalizedURL, { ResolveLocalizedURLOptions } from './getLocalizedURL'

/**
 * Returns all localized versions of a URL based on the specified
 * `supportedLocales`.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URLs.
 */
export default function getLocalizedURLs(url: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, resolver, supportedLocales }))
}
