import { type SitemapTags } from './SitemapTags.js'

export type SitemapOptions = {
  /**
   * Hostname of the sitemap, i.e. `https://example.com`.
   */
  hostname: string

  /**
   * Date when the sitemap was last modified.
   */
  updatedAt: string

  /**
   * Route to filter out when generating the sitemap.
   *
   * @param route Route iteratee.
   *
   * @returns `true` to include the route, `false` to exclude.
   */
  filter?: (route: string) => boolean

  /**
   * Transforms routes (path patterns) to URLs or sitemap tags.
   *
   * @param routes Routes.
   *
   * @returns Array of URLs or tags for generating the sitemap.
   */
  transform?: (routes: string[]) => Promise<(string | SitemapTags)[]>
}
