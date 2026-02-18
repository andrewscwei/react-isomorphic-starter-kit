import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { constructURL } from './constructURL.js'
import { parseURL } from './parseURL.js'
import { resolveLocaleFromURL } from './resolveLocaleFromURL.js'

/**
 * Returns the unlocalized version of a URL.
 *
 * @param url The URL.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The unlocalized URL.
 */
export function getUnlocalizedURL(url: string, { resolveStrategy, supportedLocales }: ResolveLocaleOptions): string {
  const currLocaleInfo = resolveLocaleFromURL(url, { resolveStrategy, supportedLocales })
  const parts = parseURL(url)

  if (!currLocaleInfo) return url

  switch (currLocaleInfo.resolveStrategy) {
    case 'domain':
      return constructURL({ ...parts, host: parts.host ? parts.host.split('.').filter(v => v).slice(1).join('.') || '/' : undefined })
    case 'query': {
      if (!parts.query) return url

      const searchParams = new URLSearchParams(parts.query)
      searchParams.delete('locale')

      return constructURL({ ...parts, query: searchParams.toString() })
    }
    case 'auto':
    case 'path':
    default:
      return constructURL({ ...parts, path: parts.path ? [...parts.path.split('/').filter(v => v).slice(1)].join('/') : undefined })
  }
}
