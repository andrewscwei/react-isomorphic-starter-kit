import type { SEOConfig } from '../seo'
import { generateRobots } from '../seo'

type Params = {
  seo?: SEOConfig
}

export default function serveRobots({ seo }: Params = {}) {
  return async (request: Request) => {
    const robots = generateRobots({ seo })

    return new Response(robots, {
      headers: { 'content-type': 'text/plain' },
    })
  }
}
