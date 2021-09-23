import { applyMiddleware, combineReducers, compose, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import users from './users'

const composeEnhancers = process.env.NODE_ENV === 'development' && process.env.APP_ENV === 'client' && (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type PartialAppState = {
  [P in keyof AppState]?: Partial<AppState[P]>
}

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({
  users,
})

export function createStore(initialState: PartialAppState = {}) {
  return _createStore(reducer, process.env.APP_ENV === 'client' && window.__INITIAL_STATE__ || initialState, composeEnhancers(applyMiddleware(thunk)))
}
