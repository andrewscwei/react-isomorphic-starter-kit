/* eslint-env browser */
/**
 * @file Client entry file.
 */

import * as reducers from './reducers';
import i18n from './plugins/i18n-client';
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

const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

i18n.changeLanguage(window.__I18N__.locale);
i18n.addResourceBundle(window.__I18N__.locale, `common`, window.__I18N__.resources, true);

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
