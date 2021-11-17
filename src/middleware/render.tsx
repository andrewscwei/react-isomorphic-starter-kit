/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import _ from 'lodash'
import React, { ComponentType } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { matchPath } from 'react-router'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import appConf from '../app.conf'
import App from '../containers/App'
import routesConf from '../routes.conf'
import { createStore, PartialAppState } from '../store'
import Layout from '../templates/Layout'
import debug from '../utils/debug'
import { markup } from '../utils/dom'
import { getDefaultLocale, getLocaleFromPath, getPolyglotByLocale } from '../utils/i18n'

interface RenderOptions {
  /**
   * The Webpack generated bundle ID.
   */
  bundleId?: string

  /**
   * The browser window title ID (for localization) of the rendered page. If provided, this title
   * will take precedence.
   */
  titleId?: string

  /**
   * The initial state of the rendered page, which will be merged with `res.locals.store`.
   */
  initialState?: PartialAppState
}

export function render(Component: ComponentType, options: RenderOptions = {}): RequestHandler {
  return appConf.ssrEnabled ? renderWithMarkup(Component, options) : renderWithoutMarkup(options)
}

/**
 * Renders a React component to string with body markup.
 *
 * @param Compnent - The React component to render.
 * @param options - @see RenderOptions
 *
 * @return Express middleware.
 */
export function renderWithMarkup(Component: ComponentType, { bundleId, titleId, initialState }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const store = createStore(_.merge(initialState ?? {}, res.locals.store ?? {}))
    const sheet = new ServerStyleSheet()
    const matches = _.compact(routesConf.map(config => !!matchPath(req.path, config.path) ? config : undefined))
    const locale = getLocaleFromPath(req.path) ?? getDefaultLocale()
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : matches[0]?.title

    // For each matching route, fetch async data if required.
    for (const match of matches) {
      const { component, path } = match
      if (!component.hasOwnProperty('fetchData')) continue
      await (component as any).fetchData(store)
      debug(`Fetching data for route <${path}>...`, 'OK')
    }

    const body = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        {markup(App, {
          store,
          staticRouter: {
            location: req.url,
          },
        })}
      </StyleSheetManager>
    )

    debug(`Rendering <${req.path}> with markup...`, 'OK')

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout
        body={body}
        bundleId={bundleId}
        initialState={_.omit(store.getState(), 'i18n')}
        initialStyles={sheet.getStyleElement()}
        locals={_.omit(res.locals, 'store')}
        title={title}
      />,
    )}`)
  }
}

/**
 * Renders a React component to string without body markup.
 *
 * @param Component - The React component to render.
 * @param options - @see RenderOptions
 *
 * @return Express middleware.
 */
export function renderWithoutMarkup({ bundleId, titleId, initialState }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const store = createStore(_.merge(initialState ?? {}, res.locals.store ?? {}))
    const matches = _.compact(routesConf.map(config => !!matchPath(req.path, config.path) ? config : undefined))
    const locale = getLocaleFromPath(req.path) ?? getDefaultLocale()
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : matches[0]?.title

    debug(`Rendering <${req.path}> without markup...`, 'OK', bundleId, req.query)

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout
        bundleId={bundleId}
        initialState={_.omit(store.getState(), 'i18n')}
        locals={_.omit(res.locals, 'store')}
        title={title}
      />,
    )}`)
  }
}
