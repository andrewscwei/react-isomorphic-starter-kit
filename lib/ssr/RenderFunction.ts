import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../dom/Metadata.js'

/**
 * Function for rendering the view into a pipeable stream.
 *
 * @param request The request.
 * @param metadata The metadata context.
 * @param options See {@link RenderToPipeableStreamOptions}.
 *
 * @returns The pipeable stream.
 */
export type RenderFunction = (request: Request, metadata?: Metadata, options?: RenderToPipeableStreamOptions) => Promise<PipeableStream>
