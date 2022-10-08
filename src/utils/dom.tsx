/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
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
