export type URLParts = {
  base?: string
  hash?: string
  host?: string
  path?: string
  port?: string
  protocol?: string
  query?: string
}

/**
 * Constructs a URL from {@link URLParts}.
 *
 * @param parts - See {@link URLParts}.
 *
 * @returns The constructed URL.
 */
export default function constructURL(parts: URLParts): string {
  const protocol = parts.protocol?.concat('://') ?? ''
  const host = parts.host?.concat('/') ?? ''
  const port = parts.port ? `:${parts.port}` : ''
  const path = parts.path ? `/${parts.path.split('/').filter(t => t).join('/')}` : ''
  const query = parts.query ? `?${parts.query}` : ''
  const hash = parts.hash ? `#${parts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}
