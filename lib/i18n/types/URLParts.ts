/**
 * A dictionary containing segmented parts of a URL.
 */
export type URLParts = {
  /**
   * The base of the URL containing the protocol, domain and port (i.e.
   * `https://example.com:8080`).
   */
  base?: string

  /**
   * The hash of the URL (i.e. `foo` in `https://example.com#foo`)
   */
  hash?: string

  /**
   * The host/domain of the URL, including the subdomain (i.e.
   * `foo.example.com`).
   */
  host?: string

  /**
   * The path following the host (i.e. `/users/foo` in
   * `https://example.com/users/foo`).
   */
  path?: string

  /**
   * Port (i.e. `8080` in `https://example.com:8080`).
   */
  port?: string

  /**
   * URL protocol (i.e. `https`).
   */
  protocol?: string

  /**
   * Query params (i.e. `foo=foo&bar=bar`) in
   * `https://example.com/?foo=foo&bar=bar`).
   */
  query?: string
}
