import { type RouteObject } from 'react-router'
import { type SitemapTags } from './SitemapTags.js'

export type SitemapOptions = {
  /**
   * Hostname of the sitemap, i.e. `https://example.com`.
   */
  hostname: string

  /**
   * Routes to generate the sitemap from.
   */
  routes: RouteObject[]

  /**
   * Date when the sitemap was last modified.
   */
  updatedAt: string

  /**
   * Path to filter out when generating the sitemap.
   *
   * @param path Path iteratee.
   *
   * @returns `true` to include the path, `false` to exclude.
   */
  filter?: (path: string) => boolean

  /**
   * Transforms paths to URLs or sitemap tags.
   *
   * @param paths Paths.
   *
   * @returns Array of URLs or tags for generating the sitemap.
   */
  transform?: (paths: string[]) => Promise<(string | SitemapTags)[]>
}
