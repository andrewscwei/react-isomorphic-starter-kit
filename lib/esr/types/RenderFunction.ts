import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'

/**
 * Function for rendering the view into a readable stream.
 *
 * @param request The request.
 * @param metadata Metadata to inject into the rendered view.
 * @param options See {@link RenderToReadableStreamOptions}.
 *
 * @returns The readable stream.
 */
export type RenderFunction = (request: Request, metadata: Record<string, any>, options: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>
