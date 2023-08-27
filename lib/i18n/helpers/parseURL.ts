import type { URLParts } from '../types'

/**
 * Parses a URL into parts.
 *
 * @param url The URL to parse.
 *
 * @returns The parsed result.
 */
export function parseURL(url: string): URLParts {
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
