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
import { hydrate, render } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

// Set up the store.
const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

// Set up i18n.
const i18n = i18next.init({
  ns: [`common`],
  defaultNS: `common`,
  lng: window.__INITIAL_LOCALE__,
  react: {
    wait: true
  },
  interpolation: {
    escapeValue: false // Not needed for React
  },
});

// Require context for all locale translation files and apply them to i18next.

const localeReq = require.context(`../config/locales`, true, /^.*\.json$/);
localeReq.keys().forEach((path) => {
  const locale = path.replace(`./`, ``).replace(`.json`, ``);
  if (!~$config.locales.indexOf(locale)) return;
  i18n.addResourceBundle(locale, `common`, localeReq(path), true);
});

function markup(r) {
  return (
    <AppContainer>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            {renderRoutes(r)}
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </AppContainer>
  );
}

if (process.env.NODE_ENV === `development`) {
  render(markup(routes), document.getElementById(`app`));
}
else {
  hydrate(markup(routes), document.getElementById(`app`));
}

if (module.hot) {
  module.hot.accept(`./routes`, () => {
    const newRoutes = require(`./routes`).default;
    hydrate(markup(newRoutes));
  });
}