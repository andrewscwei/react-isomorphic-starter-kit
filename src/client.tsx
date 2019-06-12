/**
 * @file Client entry file.
 */

import 'isomorphic-fetch';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import Worker from 'worker-loader!./workers/web';
import App from './containers/App';
import store, { AppState } from './store';

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*';
}

const debug = require('debug')('app');
const worker = new Worker();

worker.postMessage({ message: 'Hello, world!' });
worker.addEventListener('message', event => {
  debug(event.data.message);
});

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
