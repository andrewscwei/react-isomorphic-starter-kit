import { Action, Dispatch } from 'redux'

export type User = {
  [key: string]: any
}

export enum UsersActionType {
  UPDATED = 'users/UPDATED',
}

export type UsersAction = Action<UsersActionType> & {
  newState: UsersState
}

export type UsersState = User[]

const initialState: UsersState = []

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await fetch('https://reqres.in/api/users')
      .catch(err => {
        if (err.name !== 'AbortError') throw err
      })

    if (!res) return

    const { data: users } = await res.json()
    const action: UsersAction = {
      type: UsersActionType.UPDATED,
      newState: users,
    }

    dispatch(action)
  }
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.UPDATED:
    return action.newState
  default:
    return state
  }
}
