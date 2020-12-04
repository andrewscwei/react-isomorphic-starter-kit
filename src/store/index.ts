import { applyMiddleware, combineReducers, compose, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import i18n, { I18nState } from './i18n'
import users, { UsersState } from './users'

const composeEnhancers = process.env.NODE_ENV === 'development' && process.env.APP_ENV === 'client' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export interface AppState {
  i18n: I18nState
  users: UsersState
}

export const reducer = combineReducers({
  i18n,
  users,
})

export function createStore(initialState: Partial<AppState> = {}) {
  return _createStore(reducer, process.env.APP_ENV === 'client' && window.__INITIAL_STATE__ || initialState, composeEnhancers(applyMiddleware(thunk)))
}
