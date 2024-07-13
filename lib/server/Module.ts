import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../layouts'

/**
 * Type defining the entry module for server-side rendering.
 */
export type Module = {
  /**
   * Returns view specific metadata and render function for the provided
   * request.
   *
   * @param request The request.
   *
   * @returns The metadata and the pipeable stream factory.
   */
  render: (request: Request) => Promise<{
    /**
     * The view metadata for the current request.
     */
    metadata: Metadata

    /**
     * Function for rendering the view into a pipeable stream.
     *
     * @param options See {@link RenderToPipeableStreamOptions}.
     *
     * @returns The pipeable stream.
     */
    stream: (options: RenderToPipeableStreamOptions) => PipeableStream
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
