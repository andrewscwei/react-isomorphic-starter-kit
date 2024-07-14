import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../seo'

/**
 * Type defining the entry module for edge-side rendering.
 */
export type Module = {
  /**
   * Returns view specific metadata and render function for the provided
   * request.
   *
   * @param request The request.
   *
   * @returns The metadata and the readable stream factory.
   */
  render: (request: Request) => Promise<{
    /**
     * The view metadata for the current request.
     */
    metadata: Metadata

    /**
     * Function for rendering the view into a readable stream.
     *
     * @param options See {@link RenderToReadableStreamOptions}.
     *
     * @returns The readable stream.
     */
    stream: (options?: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>
  }>

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
