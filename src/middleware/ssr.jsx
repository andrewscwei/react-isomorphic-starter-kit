/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import _ from 'lodash';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { Route, StaticRouter } from 'react-router-dom';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import App from '../containers/App';
import routes from '../routes/client';
import store from '../store';
import Layout from '../templates/Layout';

const debug = require('debug')('app:ssr');

/**
 * Express middleware for rendering React views to string based on the request
 * path and sending the string as a response.  This method renders the view with
 * body context.
 *
 * @return Express middleware.
 */
export function renderWithContext() {
  return async (req, res) => {
    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.path);
    const title = (matches.length > 0) && (matches[0].route).title;

    // For each matching route, fetch async data if required.
    for (const t of matches) {
      const { route, match } = t;
      if (!route.component) continue;
      if ((route.component).fetchData === undefined) continue;
      await (route.component).fetchData(store);
      debug(`Fetching data for route <${match.url}>...`, 'OK');
    }

    const context = {};
    const sheet = new ServerStyleSheet();

    const body = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Route render={(route) => (
            <StyleSheetManager sheet={sheet.instance}>
              <App route={route}/>
            </StyleSheetManager>
          )}/>
        </StaticRouter>
      </Provider>,
    );

    switch (context['statusCode']) {
    case 302:
      res.redirect(302, context['url']);
      return;
    case 404:
      res.status(404);
      break;
    }

    debug(`Rendering with context <${req.path}>...`, 'OK');

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout title={title} body={body} initialState={_.omit(store.getState(), 'i18n')} initialStyles={sheet.getStyleElement()}/>,
    )}`);
  };
}

/**
 * Express middleware for rendering React view to string based on the request
 * path and sending the resulting string as a response. This method renders the
 * view without body context.
 *
 * @return Express middleware.
 */
export function renderWithoutContext() {
  return async (req, res) => {
    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.path);
    const title = (matches.length > 0) && (matches[0].route).title;

    debug(`Rendering without context <${req.path}>...`, 'OK');

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout title={title}/>,
    )}`);
  };
}
