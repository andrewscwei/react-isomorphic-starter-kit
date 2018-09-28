import { Action, Dispatch } from 'redux';

export interface User {
  [key: string]: any;
}

export interface UsersState {
  items: ReadonlyArray<User>;
}

export enum UsersActionType {
  USERS_LOADED = 'users-loaded',
}

export interface UsersLoadedAction {
  items: ReadonlyArray<User>;
  type: UsersActionType.USERS_LOADED;
}

export type UsersAction = UsersLoadedAction;

const initialState: UsersState = {
  items: [],
};

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await fetch('//jsonplaceholder.typicode.com/users');
    const items = await res.json();
    const action = {
      items,
      type: UsersActionType.USERS_LOADED,
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.USERS_LOADED:
    return { ...state, items: action.items };
  default:
    return state;
  }
}
