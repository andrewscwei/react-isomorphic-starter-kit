import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { splitURL } from './splitURL.js'

/**
 * Retrieves the locale from a URL based on the specified locale change
 * strategy, matching the supported locales case-insensitively.
 *
 * @param url The URL, can be a full URL or a valid path.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The supported locale in the URL as it appears in
 *          `supportedLocales`, or `undefined` if there is none.
 */
export function resolveLocaleFromURL(url: string, { localeChangeStrategy, supportedLocales }: ResolveLocaleOptions): string | undefined {
  const { path, search } = splitURL(url)

  let locale: null | string | undefined

  switch (localeChangeStrategy) {
    case 'path':
      locale = path.startsWith('/') ? path.split('/')[1] : undefined
      break
    case 'query':
      locale = new URLSearchParams(search).get('locale')
      break
    case 'action':
    default:
      return undefined
  }

  if (!locale) return undefined

  return supportedLocales.find(l => l.toLowerCase() === locale.toLowerCase())
}
