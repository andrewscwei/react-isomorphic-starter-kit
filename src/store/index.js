import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import i18n from './i18n';
import users from './users';

const composeEnhancers = process.env.NODE_ENV === 'development' && __APP_ENV__ === 'client' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reducer = combineReducers({
  i18n,
  users,
});

export default createStore(reducer, __APP_ENV__ === 'client' && window.__INITIAL_STATE__ || {}, composeEnhancers(applyMiddleware(thunk)));
