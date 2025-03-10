import type { Module } from '../types/index.js'

export function serveRobots({ robots }: Module) {
  return async (req: Request, path: string) => {
    if (robots) {
      return new Response(await robots(), {
        headers: { 'content-type': 'text/plain' },
      })
    }
    else {
      return new Response(undefined, {
        status: 404,
      })
    }
  }
}
