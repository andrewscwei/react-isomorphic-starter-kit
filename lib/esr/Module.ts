import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../seo/index.js'

/**
 * Type defining the entry module for edge-side rendering.
 */
export type Module = {
  /**
   * Function for rendering the view into a readable stream.
   *
   * @param request The request.
   * @param metadata The metadata context.
   * @param options See {@link RenderToReadableStreamOptions}.
   *
   * @returns The readable stream.
   */
  render: (request: Request, metadata?: Metadata, options?: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>

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
