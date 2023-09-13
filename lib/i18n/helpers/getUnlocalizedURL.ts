import { type ResolveLocaleOptions } from '../types'
import { constructURL } from './constructURL'
import { parseURL } from './parseURL'
import { resolveLocaleFromURL } from './resolveLocaleFromURL'

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
      return constructURL({ ...parts, host: parts.host ? parts.host.split('.').filter(t => t).slice(1).join('.') || '/' : undefined })
    case 'query': {
      if (!parts.query) return url

      const searchParams = new URLSearchParams(parts.query)
      searchParams.delete('locale')

      return constructURL({ ...parts, query: searchParams.toString() })
    }
    case 'path':
    case 'auto':
    default:
      return constructURL({ ...parts, path: parts.path ? [...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
  }
}
