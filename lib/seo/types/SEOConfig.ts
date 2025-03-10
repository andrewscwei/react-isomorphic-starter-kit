import { type RouteObject } from 'react-router'
import { type SitemapTags } from './SitemapTags.js'

/**
 * SEO configuration.
 */
export type SEOConfig = {
  /**
   * Plain text robots.txt.
   *
   * @param routes Route config.
   *
   * @returns `robots.txt` content.
   */
  robotsProvider: (routes: RouteObject[]) => Promise<string>

  /**
   * Custom function to provide URLs or sitemap tags for generating the sitemap.
   *
   * @param routes Route config.
   *
   * @returns Array of URLs or tags to use for generating the sitemap.
   */
  urlsProvider: (routes: RouteObject[]) => Promise<(string | SitemapTags)[]>
}
