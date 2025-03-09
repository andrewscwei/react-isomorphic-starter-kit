import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../dom/index.js'

/**
 * Type defining the entry module for server-side rendering.
 */
export type Module = {
  /**
   * Populates local data on each request. The returned data will be JSON
   * stringified and available in the client-side JavaScript as
   * `window.__localData`.
   */
  localData?: (request: Request) => Promise<any>

  /**
   * Renders the view into a pipeable stream and returns it.
   */
  render: (request: Request, metadata?: Metadata, options?: RenderToPipeableStreamOptions) => Promise<PipeableStream>

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
