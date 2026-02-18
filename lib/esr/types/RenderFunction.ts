import { type ReactDOMServerReadableStream, type RenderToReadableStreamOptions } from 'react-dom/server'

import { type RenderContext } from './RenderContext.js'

/**
 * Function for rendering the view into a readable stream.
 *
 * @param request The request.
 * @param context See {@link RenderContext}.
 * @param options See {@link RenderToReadableStreamOptions}.
 *
 * @returns The readable stream.
 */
export type RenderFunction = (request: Request, context: RenderContext, options: RenderToReadableStreamOptions) => Promise<ReactDOMServerReadableStream>
