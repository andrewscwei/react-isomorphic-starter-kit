import type { URLParts } from '../types/URLParts.js'

/**
 * Parses a URL into {@link URLParts}.
 *
 * @param url The URL to parse.
 *
 * @returns The resulting {@link URLParts}.
 */
export function parseURL(url: string): URLParts {
  const regex = /((?:(.*):\/\/)?((?:[a-z0-9-]+\.?)+)?(?::(\d+))?)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/i
  const parts = regex.exec(url)

  if (!parts) return {}

  return {
    base: parts[1],
    protocol: parts[2],
    host: parts[3],
    port: parts[4],
    path: parts[5],
    query: parts[6],
    hash: parts[7],
  }
}
