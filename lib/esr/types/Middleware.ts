import { type RequestHandler } from './RequestHandler.js'

export type Middleware = {
  path: string
  handler: RequestHandler
}
