import { ComponentType, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { useDebug } from '../utils'

const debug = useDebug()

export default function mountRoot(root: ComponentType, containerId = 'root') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  createRoot(container).render(createElement(root))

  debug('Mounting root...', 'OK')
}
