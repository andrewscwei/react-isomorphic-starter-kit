import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'

/**
 * Type defining the entry module for edge-side rendering.
 */
export type Module = {
  /**
   * Populates local data on each request. The returned data will be JSON
   * stringified and available in the client-side JavaScript as
   * `window.__localData`.
   */
  localData?: (request: Request) => Promise<any>

  /**
   * Renders the view into a readable stream and returns it.
   */
  render: (request: Request, metadata: Record<string, any>, options: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>

  /**
   * Returns the content of the `sitemap.xml` file.
   *
   * @returns The content of the `sitemap.xml` file.
   */
  sitemap?: () => Promise<string>
}
