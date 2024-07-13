import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type Metadata } from '../layouts'

export type RenderFunction = (request: Request) => Promise<{
  metadata: Metadata
  stream: (options: RenderToPipeableStreamOptions) => PipeableStream
}>
