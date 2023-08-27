import React from 'react'
import type { RouteObject } from 'react-router'
import { Outlet } from 'react-router'
import { joinURL } from '../utils'
import { I18nProvider } from './I18nProvider'
import { createResolveLocaleOptions } from './helpers'
import type { I18nConfig } from './types'

/**
 * Returns an array of {@link RouteObject} containg the localized version of
 * each {@link RouteObject} (specified by the `routes` argument). The locales to
 * generate are specified by `config`.
 *
 * @param routes An array of {@link RouteObject} to localize.
 * @param config See {@link I18nConfig}.
 *
 * @returns The localized array of {@link RouteObject}.
 */
export function generateLocalizedRoutes(routes: RouteObject[], config: I18nConfig): RouteObject[] {
  const { defaultLocale, resolveStrategy, supportedLocales } = createResolveLocaleOptions(config)

  const Container = () => (
    <I18nProvider {...config}>
      <Outlet/>
    </I18nProvider>
  )

  return [{
    Component: Container,
    children: routes.reduce((out, route) => {
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
    }, [] as RouteObject[]),
  }]
}
