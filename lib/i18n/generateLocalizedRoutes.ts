import { RouteObject } from 'react-router'
import { joinURL } from '../utils'
import { createResolveLocaleOptions } from './helpers'
import { I18nOptions } from './types'

export default function generateLocalizedRoutes(routes: RouteObject[], options: I18nOptions): RouteObject[] {
  const { defaultLocale, resolveStrategy, supportedLocales } = createResolveLocaleOptions(options)

  return routes.reduce((out, route) => {
    const path = route.path
    if (!path) return out

    switch (resolveStrategy) {
      case 'path': {
        const localizedRoutes = supportedLocales?.filter(t => t !== defaultLocale).map(t => ({ ...route, path: joinURL(`/${t}`, path) }))

        return [
          ...out,
          ...localizedRoutes ?? [],
          route,
        ]
      }
      default: {
        return routes
      }
    }
  }, [] as RouteObject[])
}
