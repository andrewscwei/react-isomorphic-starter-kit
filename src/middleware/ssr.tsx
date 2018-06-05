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
import { LocalizedRequest } from '@/types';
import debug from 'debug';
import { RequestHandler } from 'express';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { Route, RouteComponentProps, StaticRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider } from 'styled-components';

const log = debug(`app:ssr`);

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

/**
 * Express middleware for rendering React views to string based on the request
 * path and sending the string as a response.
 *
 * @param options Options.
 * @param options.excludeContext Specifies whether the view body should be
 *                               excluded from the rendering process.
 *
 * @return Express middleware.
 */
function render({ excludeContext = false }: { excludeContext?: boolean } = {}): RequestHandler {
  return async (req: LocalizedRequest, res) => {
    log(`Processing path: ${req.normalizedPath || req.path}`);

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.normalizedPath || req.path);

    // If `excludeContext` is specified, just render the layout without the app
    // markup.
    if (excludeContext) {
      return res.send(`<!doctype html>${renderToStaticMarkup(
        <Layout
          initialState={store.getState()}
        />,
      )}`);
    }

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
              <Route render={(routeProps: RouteComponentProps<any>) => (
                <App route={routeProps}/>
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

    return res.send(`<!doctype html>${renderToStaticMarkup(
      <Layout
        body={body}
        initialState={store.getState()}
      />,
    )}`);
  };
}

/**
 * Express middleware to render React views with context.
 *
 * @return Express middleware.
 */
export function renderWithContext(): RequestHandler {
  return render({ excludeContext: false });
}

/**
 * Express middleware to render React views without context.
 *
 * @return Express middleware.
 */
export function renderWithoutContext(): RequestHandler {
  return render({ excludeContext: true });
}
