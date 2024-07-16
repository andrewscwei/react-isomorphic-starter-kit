import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../seo/index.js'

/**
 * Type defining the entry module for server-side rendering.
 */
export type Module = {
  /**
   * Function for rendering the view into a pipeable stream.
   *
   * @param request The request.
   * @param metadata The metadata context.
   * @param options See {@link RenderToPipeableStreamOptions}.
   *
   * @returns The pipeable stream.
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
