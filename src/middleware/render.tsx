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
import routesConf from '../routes.conf'
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
export function renderWithMarkup(Component: ComponentType, { bundleId, titleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const sheet = new ServerStyleSheet()
    const matches = _.compact(routesConf.map(config => !!matchPath(req.path, config.path) ? config : undefined))
    const locale = getLocaleFromPath(req.path) ?? getDefaultLocale()
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : matches[0]?.title

    const body = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        {markup(Component, {
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
        initialStyles={sheet.getStyleElement()}
        locals={res.locals}
        title={title}
      />,
    )}`)
  }
}

/**
 * Renders a React component to string without body markup.
 *
 * @param options - @see RenderOptions
 *
 * @return Express middleware.
 */
export function renderWithoutMarkup({ bundleId, titleId }: RenderOptions = {}): RequestHandler {
  return async (req, res) => {
    const matches = _.compact(routesConf.map(config => !!matchPath(req.path, config.path) ? config : undefined))
    const locale = getLocaleFromPath(req.path) ?? getDefaultLocale()
    const title = titleId ? getPolyglotByLocale(locale).t(titleId) : matches[0]?.title

    debug(`Rendering <${req.path}> without markup...`, 'OK', bundleId, req.query)

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout
        bundleId={bundleId}
        locals={res.locals}
        title={title}
      />,
    )}`)
  }
}
