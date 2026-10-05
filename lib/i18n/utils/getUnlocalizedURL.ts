import { type ResolveLocaleOptions } from '../types/ResolveLocaleOptions.js'
import { resolveLocaleFromURL } from './resolveLocaleFromURL.js'
import { splitURL } from './splitURL.js'

/**
 * Returns the unlocalized version of a URL.
 *
 * @param url The URL.
 * @param options See {@link ResolveLocaleOptions}.
 *
 * @returns The unlocalized URL.
 */
export function getUnlocalizedURL(url: string, options: ResolveLocaleOptions): string {
  if (resolveLocaleFromURL(url, options) === undefined) return url

  const { hash, origin, path, search } = splitURL(url)

  switch (options.localeChangeStrategy) {
    case 'query': {
      const searchParams = new URLSearchParams(search)
      searchParams.delete('locale')

      const query = searchParams.toString()

      return `${origin}${path}${query ? `?${query}` : ''}${hash}`
    }
    case 'path':
    default: {
      const segments = path.split('/')
      segments.splice(1, 1)

      return `${origin}${segments.join('/') || '/'}${search}${hash}`
    }
  }
}
