import getLocalizedURL from './getLocalizedURL'

/**
 * Returns all localized versions of a URL based on the specified
 * `supportedLocales`.
 *
 * @param url - The URL.
 * @param options - See {@link Options}.
 *
 * @returns The localized URLs.
 */
export default function getLocalizedURLs(url: string, {
  defaultLocale,
  resolver,
  resolveStrategy = 'auto',
  supportedLocales,
}: Parameters<typeof getLocalizedURL>[2] = {}): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, resolver, supportedLocales }))
}
