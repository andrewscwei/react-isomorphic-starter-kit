/* globals $manifest: true */
/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import * as reducers from '@/reducers';
import config from '@/../config/app.conf';
import debug from 'debug';
import routes from '@/routes';
import thunk from 'redux-thunk';
import Layout from '@/templates/Layout';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { i18n } from '@/middleware/i18n';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

const log = debug(`app:ssr`);
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));
const publicPath = process.env.NODE_ENV === `development` ? `/` : config.build.publicPath;

/**
 * Express middleware for rendering React views to string based on the request
 * path and sending the string as a response.
 *
 * @param {Object} [options] - Options.
 * @param {string} [options.publicPath] - Public path of loaded assets.
 * @param {Object} [options.manifest] - Optional asset manifest object for
 *                                      mapping raw asset paths to fingerprinted
 *                                      asset paths.
 * @param {Object} [options.excludeContext=false] - Specifies whether the view
 *                                                  body should be excluded from
 *                                                  the rendering process.
 *
 * @return {Function} - Express middleware.
 */
function render({ excludeContext = false } = {}) {
  let manifest = undefined;

  // See if `$manifest` variable is defined. This is defined by Webpack.
  try {
    manifest = $manifest;
    log(`Using defined manifest object`);
  }
  catch (err) {
    log(`No manifest object defined`);
  }

  return async function(req, res) {
    log(`Processing path: ${req.normalizedPath || req.path}`);

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.normalizedPath || req.path);
    const locale = req.language;
    const translations = config.locales.reduce((obj, val) => {
      obj[val] = i18n.getResourceBundle(val);
      return obj;
    }, {});

    i18n.changeLanguage(locale);

    // If `excludeContext` is specified, just render the layout without the app
    // markup.
    if (excludeContext) {
      return res.send(`<!doctype html>${renderToStaticMarkup(
        <Layout config={config} initialState={store.getState()} initialLocale={{ locale, translations }} publicPath={publicPath} manifest={manifest}/>
      )}`);
    }

    // For each matching route, fetch async data if required.
    for (let i = 0; i < matches.length; i++) {
      const { route, match } = matches[i];
      if (!(route.component.fetchData instanceof Function)) continue;
      log(`Fetching data for route: ${match.url}`);
      await route.component.fetchData(store);
    }

    let context = {};

    const body = renderToString(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </I18nextProvider>
    );

    switch (context.status) {
    case 302:
      return res.redirect(302, context.url);
    case 404:
      res.status(404);
      break;
    }

    return res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout body={body} config={config} initialState={store.getState()} initialLocale={{ locale, translations }} publicPath={publicPath} manifest={manifest}/>
    )}`);
  };
}

/**
 * Express middleware to render React views with context.
 *
 * @return {Function} - Express middleware.
 */
export function renderWithContext() {
  return render({ excludeContext: false });
}

/**
 * Express middleware to render React views without context.
 *
 * @return {Function} - Express middleware.
 */
export function renderWithoutContext() {
  return render({ excludeContext: true });
}
