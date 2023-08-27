import { generateRobots, type SEOConfig } from '../seo'

type Params = {
  /**
   * Configuration for SEO (see {@link SEOConfig}).
   */
  seo?: SEOConfig
}

/**
 * Creates a {@link Request} handler that returns a {@link Response} containing
 * the `robots.txt` of the application in plain text.
 *
 * @param params See {@link Params}.
 *
 * @returns The {@link Request} handler.
 */
export function serveRobots({ seo }: Params = {}) {
  return async (request: Request) => {
    const robots = generateRobots(seo)

    return new Response(robots, {
      headers: { 'content-type': 'text/plain' },
    })
  }
}
