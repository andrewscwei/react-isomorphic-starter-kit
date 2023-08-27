import type { URLParts } from '../types'

/**
 * Constructs a URL from {@link URLParts}.
 *
 * @param urlParts - See {@link URLParts}.
 *
 * @returns The constructed URL.
 */
export default function constructURL(urlParts: URLParts): string {
  const protocol = urlParts.protocol?.concat('://') ?? ''
  const host = urlParts.host?.concat('/') ?? ''
  const port = urlParts.port !== undefined ? `:${urlParts.port}` : ''
  const path = urlParts.path !== undefined ? `/${urlParts.path.split('/').filter(t => t).join('/')}` : ''
  const query = urlParts.query !== undefined ? `?${urlParts.query}` : ''
  const hash = urlParts.hash !== undefined ? `#${urlParts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}
