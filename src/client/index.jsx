/**
 * @file Client entry file.
 */

import * as reducers from './reducers';
import routes from '../routes';
import thunk from 'redux-thunk';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

const renderDOM = (r) => {
  hydrate(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          {renderRoutes(r)}
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById(`app`)
  );
};

renderDOM(routes);

if (module.hot) {
  module.hot.accept(`../routes`, () => {
    const newRoutes = require(`../routes`).default;
    renderDOM(newRoutes);
  });
}
