import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type RenderContext } from './RenderContext.js'

/**
 * Function for rendering the view into a pipeable stream.
 *
 * @param request The request.
 * @param context See {@link RenderContext}.
 * @param options See {@link RenderToPipeableStreamOptions}.
 *
 * @returns The pipeable stream.
 */
export type RenderFunction = (request: Request, context: RenderContext, options: RenderToPipeableStreamOptions) => Promise<PipeableStream>
