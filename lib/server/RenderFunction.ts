import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'

export type RenderFunction = (request: Request, options: RenderToPipeableStreamOptions) => Promise<PipeableStream>
