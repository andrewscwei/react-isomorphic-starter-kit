/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { StaticRouter, StaticRouterProps } from 'react-router-dom/server'
import { Store } from 'redux'
import { ThemeProvider } from 'styled-components'
import { AppAction, AppState, createStore } from '../store'
import * as theme from '../styles/theme'
import { I18nRouterProvider } from './i18n'

type MarkupOptions = {
  store?: Store<AppState, AppAction>
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
export function markup(Component: ComponentType, { store = createStore(), staticRouter, browserRouter }: MarkupOptions = {}): JSX.Element {
  return staticRouter ? (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StaticRouter {...staticRouter}>
          <I18nRouterProvider>
            <Component/>
          </I18nRouterProvider>
        </StaticRouter>
      </ThemeProvider>
    </Provider>
  ) : (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter {...browserRouter}>
          <I18nRouterProvider>
            <Component/>
          </I18nRouterProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
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

  if (process.env.NODE_ENV === 'development') {
    render(markup(Component), document.getElementById(elementId))
  }
  else {
    hydrate(markup(Component), document.getElementById(elementId))
  }
}
