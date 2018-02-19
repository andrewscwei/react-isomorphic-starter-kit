/**
 * @file Server-side rendering middleware.
 */

import * as reducers from '../reducers';
import debug from 'debug';
import routes from '../routes';
import thunk from 'redux-thunk';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

const log = debug(`app:ssr`);
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

export default async function(req, res) {
  // Find and store all matching client routes based on the request URL.
  const matches = matchRoutes(routes, req.url);

  // For each matching route, fetch async data if required.
  for (let i = 0; i < matches.length; i++) {
    const { route, match } = matches[i];

    if (!(route.component.fetchData instanceof Function)) continue;

    log(`Fetching data for route: ${match.url}`);

    await route.component.fetchData(store);
  }

  let context = {};

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  switch (context.status) {
  case 302:
    return res.redirect(302, context.url);
  case 404:
    res.status(404);
    break;
  }

  res.render(`index`, { title: `Express`, data: store.getState(), content });
}
