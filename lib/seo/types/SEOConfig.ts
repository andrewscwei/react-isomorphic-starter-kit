import { type SitemapTags } from './SitemapTags.js'

/**
 * SEO configuration.
 */
export type SEOConfig = {
  /**
   * Base URL for the application.
   */
  baseURL: string

  /**
   * Date when the application was last modified.
   */
  modifiedAt: string

  /**
   * Custom function to provide URLs or sitemap tags for generating the sitemap.
   *
   * @param routes Application routes.
   *
   * @returns Array of URLs or tags to use for generating the sitemap.
   */
  urlsProvider: (routes: string[]) => Promise<(string | SitemapTags)[]>
}
