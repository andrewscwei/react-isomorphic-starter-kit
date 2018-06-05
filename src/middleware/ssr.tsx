/**
 * @file Express middleware for server-side rendering of React views.
 *
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */

import App from '@/containers/App';
import routes from '@/routes';
import * as reducers from '@/store';
import theme from '@/styles/theme';
import Layout from '@/templates/Layout';
import ConnectedIntlProvider from '@/utils/ConnectedIntlProvider';
import debug from 'debug';
import { RequestHandler } from 'express';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { Route, RouteComponentProps, StaticRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider } from 'styled-components';

const log = debug(`app:ssr`);
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

/**
 * Express middleware for rendering React views to string based on the request
 * path and sending the string as a response.  This method renders the view with
 * body context.
 *
 * @return Express middleware.
 */
export function renderWithContext(): RequestHandler {
  return async (req, res) => {
    log(`Rendering with context: ${req.path}`);

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.path);

    // For each matching route, fetch async data if required.
    for (const t of matches) {
      const { route, match } = t;
      if (!route.component) continue;
      if ((route.component as any).fetchData === undefined) continue;
      log(`Fetching data for route: ${match.url}`);
      await (route.component as any).fetchData(store);
    }

    const context: { [key: string]: any } = {};

    const body = renderToString(
      <Provider store={store}>
        <ConnectedIntlProvider>
          <ThemeProvider theme={theme}>
            <StaticRouter location={req.url} context={context}>
              <Route render={(route: RouteComponentProps<any>) => (
                <App route={route}/>
              )}/>
            </StaticRouter>
          </ThemeProvider>
        </ConnectedIntlProvider>
      </Provider>,
    );

    switch (context[`statusCode`]) {
    case 302:
      return res.redirect(302, context[`url`]);
    case 404:
      res.status(404);
      break;
    }

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout body={body} initialState={store.getState()}/>,
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
    log(`Rendering without context: ${req.path}`);

    res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout initialState={store.getState()}/>,
    )}`);
  };
}
