import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import intl, { IntlState } from './intl';
import users, { UsersState } from './users';

const composeEnhancers = process.env.NODE_ENV === 'development' && __APP_ENV__ === 'client' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface AppState {
  intl: IntlState;
  users: UsersState;
}

export const reducer = combineReducers({
  intl,
  users,
});

export default createStore(reducer, __APP_ENV__ === 'client' && window.__INITIAL_STATE__ || {}, composeEnhancers(applyMiddleware(thunk)));
