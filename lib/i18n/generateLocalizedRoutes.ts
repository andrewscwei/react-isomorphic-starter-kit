import { RouteObject } from 'react-router'
import { joinURL } from '../utils'

type Options = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * Specifies how locale should be changed.
   */
  localeChangeStrategy: 'action' | 'path' | 'query'

  /**
   * An array of supported locales to validate the inferred locale against. If
   * it doesn't exist in the list of supported locales, the default locale (if
   * specified) or `undefined` will be returned.
   */
  supportedLocales?: string[]
}

export default function generateLocalizedRoutes(routes: RouteObject[], {
  defaultLocale,
  localeChangeStrategy,
  supportedLocales,
}: Options): RouteObject[] {
  return routes.reduce((out, route) => {
    const path = route.path
    if (!path) return out

    switch (localeChangeStrategy) {
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
