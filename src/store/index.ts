import { applyMiddleware, combineReducers, compose, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import users from './users'

const composeEnhancers = process.env.NODE_ENV === 'development' && process.env.APP_ENV === 'client' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({
  users,
})

export function createStore(initialState: Partial<AppState> = {}) {
  return _createStore(reducer, process.env.APP_ENV === 'client' && window.__INITIAL_STATE__ || initialState, composeEnhancers(applyMiddleware(thunk)))
}
