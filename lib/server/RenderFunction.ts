import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'

export type RenderFunction = (req: Request, options: RenderToPipeableStreamOptions) => Promise<PipeableStream>
