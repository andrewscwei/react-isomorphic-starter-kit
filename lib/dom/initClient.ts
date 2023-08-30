import { createRoot, hydrateRoot } from 'react-dom/client'
import type { RouteObject } from 'react-router'
import { generateLocalizedRoutes, type I18nConfig } from '../i18n'
import { useDebug } from '../utils'
import { loadLazyComponents } from './loadLazyComponents'
import type { RenderProps } from './types'

type Config = {
  /**
   * ID of the DOM element to render the application root in. in.
   */
  containerId?: string

  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n: I18nConfig

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]
}

const debug = useDebug(undefined, 'app')

/**
 * Initializes the client application.
 *
 * @param render Render function for the application.
 * @param config Additional configurations, see {@link Config}.
 *
 * @returns The application root.
 */
export async function initClient(render: (props: RenderProps) => JSX.Element, {
  routes,
  i18n,
  containerId = 'root',
}: Config) {
  window.__VERSION__ = __BUILD_ARGS__.version

  const localizedRoutes = generateLocalizedRoutes(routes, i18n)
  const container = document.getElementById(containerId ?? 'root')

  if (!container) throw console.warn(`No container with ID <${containerId}> found`)

  await loadLazyComponents(localizedRoutes)

  const app = render({ routes: localizedRoutes })
  let root

  if (process.env.NODE_ENV === 'development') {
    root = createRoot(container)
    root.render(app)
  }
  else {
    root = hydrateRoot(container, app)
  }

  debug('Initializing client...', 'OK')

  return root
}
