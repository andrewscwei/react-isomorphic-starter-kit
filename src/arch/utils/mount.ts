import { ComponentType, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import useDebug from './useDebug'

const debug = useDebug('arch')

export default function mount(app: ComponentType, containerId = 'root') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  if (process.env.NODE_ENV === 'development') {
    createRoot(container).render(createElement(app))
  }
  else {
    hydrateRoot(container, createElement(app))
  }

  debug('Mounting app...', 'OK')
}
