import { createRoot, hydrateRoot } from 'react-dom/client'
import type { RouteObject } from 'react-router'
import type { I18nConfig } from '../i18n'
import { generateLocalizedRoutes } from '../i18n'
import { useDebug } from '../utils'
import loadLazyComponents from './loadLazyComponents'
import type { RenderProps } from './types'

type Config = {
  i18n: I18nConfig
  routes: RouteObject[]
  containerId?: string
}

const debug = useDebug(undefined, 'app')

export default async function initClient(render: (props: RenderProps) => JSX.Element, {
  routes,
  i18n,
  containerId = 'root',
}: Config) {
  window.__VERSION__ = __BUILD_ARGS__.version

  const localizedRoutes = generateLocalizedRoutes(routes, i18n)
  const container = document.getElementById(containerId ?? 'root')

  if (!container) throw console.warn(`No container with ID <${containerId}> found`)

  await loadLazyComponents(localizedRoutes)

  const root = render({ routes: localizedRoutes })

  if (process.env.NODE_ENV === 'development') {
    createRoot(container).render(root)
  }
  else {
    hydrateRoot(container, root)
  }

  debug('Initializing client...', 'OK')
}
