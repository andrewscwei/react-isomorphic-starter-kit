import parseURL from './parseURL'

/**
 * Constructs a URL from {@link Params}.
 *
 * @param urlParts - See {@link Params}.
 *
 * @returns The constructed URL.
 */
export default function constructURL(urlParts: ReturnType<typeof parseURL>): string {
  const protocol = urlParts.protocol?.concat('://') ?? ''
  const host = urlParts.host?.concat('/') ?? ''
  const port = urlParts.port !== undefined ? `:${urlParts.port}` : ''
  const path = urlParts.path !== undefined ? `/${urlParts.path.split('/').filter(t => t).join('/')}` : ''
  const query = urlParts.query !== undefined ? `?${urlParts.query}` : ''
  const hash = urlParts.hash !== undefined ? `#${urlParts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}
