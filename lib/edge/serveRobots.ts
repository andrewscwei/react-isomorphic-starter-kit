import { generateRobots, type SEOConfig } from '../seo'

type Params = {
  seo?: SEOConfig
}

export function serveRobots({ seo }: Params = {}) {
  return async (request: Request) => {
    const robots = generateRobots({ seo })

    return new Response(robots, {
      headers: { 'content-type': 'text/plain' },
    })
  }
}
