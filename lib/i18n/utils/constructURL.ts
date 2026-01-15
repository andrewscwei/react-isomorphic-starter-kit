import { type URLParts } from '../types/URLParts.js'

/**
 * Constructs a URL from {@link URLParts}.
 *
 * @param urlParts See {@link URLParts}.
 *
 * @returns The constructed URL.
 */
export function constructURL(urlParts: URLParts): string {
  const protocol = urlParts.protocol?.concat('://') ?? ''
  const host = urlParts.host?.concat('/') ?? ''
  const port = urlParts.port !== undefined ? `:${urlParts.port}` : ''
  const path = urlParts.path !== undefined ? `/${urlParts.path.split('/').filter(v => v).join('/')}` : ''
  const query = urlParts.query !== undefined ? `?${urlParts.query}` : ''
  const hash = urlParts.hash !== undefined ? `#${urlParts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}
