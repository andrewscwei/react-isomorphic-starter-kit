/**
 * @file Client entry file.
 */

import App from '@/containers/App';
import store, { AppState } from '@/store';
import 'isomorphic-fetch';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

const ConnectedIntlProvider = connect((state: AppState) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

// Generator for base markup.
const markup = () => (
  <Provider store={store}>
    <ConnectedIntlProvider>
      <BrowserRouter>
        <Route render={(route: RouteComponentProps<any>) => (
          <App route={route}/>
        )}/>
      </BrowserRouter>
    </ConnectedIntlProvider>
  </Provider>
);

// Render the app.
if (process.env.NODE_ENV === 'development') {
  render(markup(), document.getElementById('app'));
}
else {
  hydrate(markup(), document.getElementById('app'));
}

if (module.hot) {
  module.hot.accept();
}
