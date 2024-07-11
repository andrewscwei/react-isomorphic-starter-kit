import { type PipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server'
import { type RouteObject } from 'react-router'
import { type StaticHandlerContext } from 'react-router-dom/server'

export type RenderFunc = (props: {
  context: StaticHandlerContext
  routes: RouteObject[]
}, options?: RenderToPipeableStreamOptions) => PipeableStream
