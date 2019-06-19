/**
 * @file Client entry file.
 */

import 'isomorphic-fetch';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import Worker from 'worker-loader!./workers/web';
import App from './containers/App';
import store from './store';

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*';
}

const debug = require('debug')('app');
const worker = new Worker();

worker.postMessage({ message: 'Hello, world!' });
worker.addEventListener('message', event => {
  debug(event.data.message);
});

// Generator for base markup.
const markup = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Route render={(route) => (
        <App route={route}/>
      )}/>
    </BrowserRouter>
  </Provider>
);

// Render the app.
if (process.env.NODE_ENV === 'development') {
  render(markup(), document.getElementById('app'));
}
else {
  hydrate(markup(), document.getElementById('app'));
}