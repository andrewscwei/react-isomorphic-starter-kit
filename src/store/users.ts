import { AppAction, AppActionType, UsersLoadedAction, UsersState } from '@/types';
import { Action, Dispatch } from 'redux';

const initialState: UsersState = {
  items: [],
};

export function fetchUsers() {
  return async (dispatch: Dispatch<AppAction>) => {
    const res = await fetch(`//jsonplaceholder.typicode.com/users`);
    const items = await res.json();
    const action: UsersLoadedAction = {
      items,
      type: AppActionType.USERS_LOADED,
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action: AppAction): UsersState {
  switch (action.type) {
  case AppActionType.USERS_LOADED:
    return { ...state, items: action.items };
  default:
    return state;
  }
}
