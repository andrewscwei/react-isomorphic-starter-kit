/**
 * @file Routes for the Express server.
 */

import * as reducers from '../client/reducers';
import express from 'express';
import routes from '../client/routes';
import thunk from 'redux-thunk';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

const router = express.Router();
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

router.get(`*`, (req, res) => {
  const branch = matchRoutes(routes, req.url);
  const promises = branch.map(({ route }) => {
    const fetchData = route.component.fetchData;
    return fetchData instanceof Function ? fetchData(store) : Promise.resolve(null);
  });

  return Promise.all(promises).then((data) => {
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
  });
});

module.exports = router;