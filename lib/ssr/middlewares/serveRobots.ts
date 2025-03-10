import { type RequestHandler } from 'express'
import { type Module } from '../types/index.js'

/**
 * Request handler for serving `robots.txt`.
 *
 * @param module See {@link Module}.
 *
 * @returns The request handler.
 */
export function serveRobots({ robots }: Module): RequestHandler {
  return async (req, res) => {
    if (robots) {
      res.setHeader('content-type', 'text/plain')
      res.send(await robots())
    }
    else {
      res.sendStatus(404)
    }
  }
}
