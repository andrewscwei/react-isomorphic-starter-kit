/**
 * SEO configuration.
 */
export type SEOConfig = {
  /**
   * Plain text robots.txt.
   */
  robots?: string

  /**
   * Filter for each URL.
   *
   * @param url URL iteratee.
   *
   * @returns `true` to include the URL, `false` to exclude.
   */
  urlFilter?: (url: string) => boolean
}
