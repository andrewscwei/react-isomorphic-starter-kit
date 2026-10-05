type Result = {
  /**
   * The scheme and authority, e.g. `https://user@example.com:8080`, or an empty
   * string for URLs without one.
   */
  origin: string

  /**
   * The path, e.g. `/scan/get`, which may be empty or relative.
   */
  path: string

  /**
   * The query including its leading `?`, or an empty string.
   */
  search: string

  /**
   * The fragment including its leading `#`, or an empty string.
   */
  hash: string
}

/**
 * Splits a URL into its origin, path, query and fragment as written, without
 * resolving or normalizing any of them.
 *
 * @param url The URL, absolute or relative.
 *
 * @returns The parts of the URL.
 */
export function splitURL(url: string): Result {
  const [, origin = '', path = '', search = '', hash = ''] = /^((?:[a-z][\d+.a-z-]*:)?\/\/[^#/?]*)?([^#?]*)(\?[^#]*)?(#.*)?$/is.exec(url) ?? []

  return { hash, origin, path, search }
}
