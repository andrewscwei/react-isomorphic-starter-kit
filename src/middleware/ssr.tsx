/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import { RequestHandler } from 'express';
import _ from 'lodash';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { Route, RouteComponentProps, StaticRouter } from 'react-router-dom';
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
export function renderWithContext(): RequestHandler {
  return async (req, res) => {
    debug(`Rendering with context: ${req.path}`);

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.path);
    const title = (matches.length > 0) && (matches[0].route as any).title;

    // For each matching route, fetch async data if required.
    for (const t of matches) {
      const { route, match } = t;
      if (!route.component) continue;
      if ((route.component as any).fetchData === undefined) continue;
      await (route.component as any).fetchData(store);
      debug(`Fetching data for route <${match.url}`>..., 'OK');
    }

    const context: { [key: string]: any } = {};
    const sheet = new ServerStyleSheet();

    const body = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Route render={(route: RouteComponentProps<any>) => (
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
export function renderWithoutContext(): RequestHandler {
  return async (req, res) => {
    debug(`Rendering without context <${req.path}>...`, 'OK');

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.path);
    const title = (matches.length > 0) && (matches[0].route as any).title;

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout title={title}/>,
    )}`);
  };
}
