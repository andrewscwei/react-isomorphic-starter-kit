type Output = {
  base?: string
  hash?: string
  host?: string
  path?: string
  port?: string
  protocol?: string
  query?: string
}

/**
 * Parses a URL into parts.
 *
 * @param url - The URL to parse.
 *
 * @returns The parsed result.
 */
export default function parseURL(url: string): Output {
  const regex = /((?:(.*):\/\/)?((?:[A-Za-z0-9-]+\.?)+)?(?::([0-9]+))?)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  const parts = url.match(regex)

  if (!parts) return {}

  return {
    base: parts[1],
    hash: parts[7],
    host: parts[3],
    path: parts[5],
    port: parts[4],
    protocol: parts[2],
    query: parts[6],
  }
}
