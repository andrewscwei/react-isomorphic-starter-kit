/**
 * @file Client entry file.
 */

import * as reducers from './reducers';
import routes from './routes';
import thunk from 'redux-thunk';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { render } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

const store = createStore(combineReducers(reducers), window.__INITIAL_STATE__, applyMiddleware(thunk));

const AppRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  );
};

render(<AppRouter />, document.querySelector(`#app`));