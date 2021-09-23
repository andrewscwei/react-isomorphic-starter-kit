/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express'
import _ from 'lodash'
import React, { ComponentType } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { matchRoutes } from 'react-router-config'
import { RouteComponentProps } from 'react-router-dom'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import appConf from '../app.conf'
import App from '../containers/App'
import routesConf from '../routes.conf'
import { createStore, PartialAppState } from '../store'
import Layout from '../templates/Layout'
import debug from '../utils/debug'
import { markup } from '../utils/dom'
import { getLocaleFromPath, getPolyglotByLocale } from '../utils/i18n'

interface RenderOptions {
  /**
   * The Webpack generated bundle ID.
   */
  bundleId?: string

  /**
   * The browser window title ID (for localization) of the rendered page. If provided, this title will take precedence.
   */
  titleId?: string

  /**
   * The initial state of the rendered page, which will be merged with `res.locals.store`.
   */
   initialState?: PartialAppState
}

export function render<P extends { route: RouteComponentProps }>(Component: ComponentType<P>, options: RenderOptions = {}): RequestHandler {
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
export function renderWithMarkup<P extends { route: RouteComponentProps }>(Component: ComponentType<P>, { bundleId, titleId, initialState }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const store = createStore(_.merge(initialState ?? {}, res.locals.store ?? {}))
    const sheet = new ServerStyleSheet()
    const matches = matchRoutes(routesConf, req.path)
    const locale = getLocaleFromPath(req.path)
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : ((matches.length > 0) && (matches[0].route as any).title)
    const context: { [key: string]: any } = {}

    // For each matching route, fetch async data if required.
    for (const t of matches) {
      const { route, match } = t
      if (!route.component) continue
      if ((route.component as any).fetchData === undefined) continue
      await (route.component as any).fetchData(store)
      debug(`Fetching data for route <${match.url}>...`, 'OK')
    }

    const body = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        {markup(App, {
          store,
          staticRouter: {
            location: req.url,
            context,
          },
        })}
      </StyleSheetManager>
    )

    switch (context['statusCode']) {
    case 302:
      res.redirect(302, context['url'])
      return
    case 404:
      res.status(404)
      break
    }

    debug(`Rendering with context <${req.path}>...`, 'OK')

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
    const matches = matchRoutes(routesConf, req.path)
    const locale = getLocaleFromPath(req.path)
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : ((matches.length > 0) && (matches[0].route as any).title)

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
