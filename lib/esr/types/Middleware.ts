import { type RequestHandler } from './RequestHandler.js'

export type Middleware = {
  handler: RequestHandler
  path: string
}
