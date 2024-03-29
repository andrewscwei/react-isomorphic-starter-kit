import { type RouteObject } from 'react-router'
import { type SitemapTags } from './SitemapTags'

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
  robotsProvider?: (routes: RouteObject[]) => Promise<string>

  /**
   * Custom function to provide URLs or sitemap tags for generating the sitemap.
   *
   * @param routes Route config.
   *
   * @returns Array of URLs or tags to use for generating the sitemap.
   */
  urlsProvider?: (routes: RouteObject[]) => Promise<(string | SitemapTags)[]>

  /**
   * Filter for each URL.
   *
   * @param url URL iteratee.
   *
   * @returns `true` to include the URL, `false` to exclude.
   */
  urlFilter?: (url: string) => boolean
}
