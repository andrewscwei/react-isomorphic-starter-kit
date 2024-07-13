import { type Request, type RequestHandler, type Response } from 'express'
import { type RouteObject } from 'react-router'
import { type SEOConfig } from '../seo'
import { type RobotsBuilder } from './RobotsBuilder'

type Params = {
  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]

  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

/**
 * Creates an Express router for serving the `robots.txt` of the application.
 *
 * @param params See {@link Params}.
 *
 * @returns The request handler.
 */
export function renderRobots(robots: RobotsBuilder): RequestHandler {
  return async (req: Request, res: Response) => {
    if (robots) {
      res.setHeader('content-type', 'text/plain')
      res.send(await robots())
    }
    else {
      res.sendStatus(404)
    }
  }
}
