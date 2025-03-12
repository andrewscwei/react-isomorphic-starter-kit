import type { PipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server'

/**
 * Function for rendering the view into a pipeable stream.
 *
 * @param request The request.
 * @param metadata Metadata to inject into the rendered view.
 * @param options See {@link RenderToPipeableStreamOptions}.
 *
 * @returns The pipeable stream.
 */
export type RenderFunction = (request: Request, metadata: Record<string, any>, options: RenderToPipeableStreamOptions) => Promise<PipeableStream>
