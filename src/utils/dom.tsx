/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'

type MarkupOptions = {
  staticRouter?: StaticRouterProps
  browserRouter?: BrowserRouterProps
}

/**
 * Factory function for generating base React app markup. Defaults to targeting a `BrowserRouter`.
 *
 * @param Component - The React component to wrap around.
 * @param options - @see MarkupOptions
 *
 * @returns The JSX markup.
 */
export function markup(Component: ComponentType, { staticRouter, browserRouter }: MarkupOptions = {}) {
  return staticRouter ? (
    <StaticRouter {...staticRouter}>
      <Component/>
    </StaticRouter>
  ) : (
    <BrowserRouter {...browserRouter}>
      <Component/>
    </BrowserRouter>
  )
}

/**
 * Mounts a React component to a DOM element.
 *
 * @param Component - The React component to mount.
 * @param elementId - The ID of the DOM element to mount the React component to.
 */
export function mount(Component: ComponentType, elementId = 'app') {
  if (process.env.APP_ENV !== 'client') return

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const app = createRoot(document.getElementById(elementId)!)
  app.render(markup(Component))
}
