import type { RequestHandler } from 'express'

export type Middleware = [string, ...RequestHandler[]] | RequestHandler | RequestHandler[]
