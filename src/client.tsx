/* eslint-env browser */
/**
 * @file Client entry file.
 */

import App from '@/containers/App';
import routes from '@/routes';
import * as reducers from '@/store';
import theme from '@/styles/theme';
import i18n from 'i18next';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider } from 'styled-components';

// Set up the store.
const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

// Set up i18n.
i18n.init({
  ns: [`common`],
  defaultNS: `common`,
  lng: window.__INITIAL_LOCALE__.locale,
  react: { wait: true },
  interpolation: { escapeValue: false },
});

// Require context for all locale translation files and apply them to i18next so
// that they can be watched by Webpack.
if (process.env.NODE_ENV === `development`) {
  const appConfig = require(`@/../config/app.conf`).default;
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~appConfig.locales.indexOf(locale)) return;
    i18n.addResourceBundle(locale, `common`, localeReq(path), true);
  });
}
else {
  const translations = window.__INITIAL_LOCALE__.translations;
  for (const locale in translations) {
    if (!translations.hasOwnProperty(locale)) continue;
    i18n.addResourceBundle(locale, `common`, translations[locale], true);
  }
}

// Generator for base markup.
const markup = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route render={(route: RouteComponentProps<any>) => (
            <App route={route}/>
          )}/>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </I18nextProvider>
);

// Render the app.
if (process.env.NODE_ENV === `development`) {
  render(markup(), document.getElementById(`app`));
}
else {
  hydrate(markup(), document.getElementById(`app`));
}
