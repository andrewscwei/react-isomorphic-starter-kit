/* eslint-env browser */
/* global $config: true */
/**
 * @file Client entry file.
 */

import * as reducers from './reducers';
import i18next from 'i18next';
import routes from './routes';
import thunk from 'redux-thunk';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

// Set up the store.
const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

// Set up i18n.
const i18n = i18next.init({
  ...($config && $config.i18next || {})
});

i18n.changeLanguage(window.__INITIAL_LOCALE__.locale);
i18n.addResourceBundle(window.__INITIAL_LOCALE__.locale, `common`, window.__INITIAL_LOCALE__.resources, true);

function renderDOM(r) {
  hydrate(
    <AppContainer>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            {renderRoutes(r)}
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </AppContainer>,
    document.getElementById(`app`)
  );
}

renderDOM(routes);

if (module.hot) {
  module.hot.accept(`./routes`, () => {
    const newRoutes = require(`./routes`).default;
    renderDOM(newRoutes);
  });
}
