import { ComponentType, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import useDebug from './useDebug'

const debug = useDebug()

export default function mountRoot(root: ComponentType, containerId = 'root') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  if (__BUILD_ARGS__.isDev) {
    createRoot(container).render(createElement(root))
  }
  else {
    hydrateRoot(container, createElement(root))
  }

  debug('Mounting root...', 'OK')
}
