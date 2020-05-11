import { Action, Dispatch } from 'redux';

export interface User {
  [key: string]: any;
}

export enum UsersActionType {
  LOADED = 'users/LOADED',
}

export interface UsersAction extends Action<UsersActionType> {
  payload: Partial<UsersState>;
}

export interface UsersState {
  items: ReadonlyArray<User>;
}

const initialState: UsersState = {
  items: [],
};

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await fetch('https://reqres.in/api/users')
      .catch((err) => {
        if (err.name !== 'AbortError') throw err;
      });

    if (!res) return;

    const { data: items } = await res.json();
    const action: UsersAction = {
      type: UsersActionType.LOADED,
      payload: {
        items,
      },
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.LOADED:
    return {
      ...state,
      ...action.payload,
    };
  default:
    return state;
  }
}
