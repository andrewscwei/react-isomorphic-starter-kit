import type { RouteObject } from 'react-router'
import { matchRoutes } from 'react-router'

export async function loadLazyComponents(routes: RouteObject[]) {
  const matches = matchRoutes(routes, window.location)?.filter(t => t.route.lazy)

  if (!matches || matches.length === 0) return

  await Promise.all(
    matches.map(async t => {
      const routeModule = await t.route.lazy?.()

      Object.assign(t.route, {
        ...routeModule,
        lazy: undefined,
      })
    })
  )
}
