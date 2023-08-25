import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouteObject } from 'react-router'
import { I18nConfig, generateLocalizedRoutes } from '../i18n'
import { useDebug } from '../utils'
import loadLazyComponents from './loadLazyComponents'

type Config = {
  i18n: I18nConfig
  routes: RouteObject[]
  containerId?: string
}

type RenderProps = {
  routes: RouteObject[]
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
