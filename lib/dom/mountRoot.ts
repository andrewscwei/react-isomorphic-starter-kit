import { ComponentType, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { useDebug } from '../utils'

const debug = useDebug()

export default function mountRoot(root: ComponentType<RootComponentProps>, containerId = 'root') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  const rootElement = createElement(root)

  if (process.env.NODE_ENV === 'development') {
    createRoot(container).render(rootElement)

    debug('Creating root...', 'OK')
  }
  else {
    hydrateRoot(container, rootElement)

    debug('Hydrating root...', 'OK')
  }
}
