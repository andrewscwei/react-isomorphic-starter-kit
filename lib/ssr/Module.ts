import { type LocalDataFunction } from './LocalDataFunction.js'
import { type RenderFunction } from './RenderFunction.js'

/**
 * Type defining the entry module for server-side rendering.
 */
export type Module = {
  /**
   * See {@link LocalDataFunction}.
   */
  localData?: LocalDataFunction

  /**
   * See {@link RenderFunction}.
   */
  render: RenderFunction

  /**
   * Returns the content of the `robots.txt` file.
   *
   * @returns The content of the `robots.txt` file.
   */
  robots?: () => Promise<string>

  /**
   * Returns the content of the `sitemap.xml` file.
   *
   * @returns The content of the `sitemap.xml` file.
   */
  sitemap?: () => Promise<string>
}
