import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../dom/Metadata.js'

/**
 * Function for rendering the view into a readable stream.
 *
 * @param request The request.
 * @param metadata The metadata context.
 * @param options See {@link RenderToReadableStreamOptions}.
 *
 * @returns The readable stream.
 */
export type RenderFunction = (request: Request, metadata?: Metadata, options?: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>
