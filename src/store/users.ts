import { Action, Dispatch } from 'redux'

export type User = Record<string, any>

export enum UsersActionType {
  LOADED = 'users/LOADED',
}

export interface UsersAction extends Action<UsersActionType> {
  users: ReadonlyArray<User>
}

export type UsersState = ReadonlyArray<User>

const initialState: UsersState = []

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await fetch('https://reqres.in/api/users')
      .catch(err => {
        if (err.name !== 'AbortError') throw err
      })

    if (!res) return

    const { data } = await res.json()
    const action: UsersAction = {
      type: UsersActionType.LOADED,
      users: data,
    }

    dispatch(action)
  }
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.LOADED:
    return action.users
  default:
    return state
  }
}
