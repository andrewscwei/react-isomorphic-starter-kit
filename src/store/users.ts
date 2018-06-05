import { Action, ActionType, UsersLoadedAction, UsersState } from '@/types';
import { Dispatch } from 'react-redux';

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await fetch(`//jsonplaceholder.typicode.com/users`);
    const items = await res.json();
    const action: UsersLoadedAction = {
      items,
      type: ActionType.USERS_LOADED,
    };

    dispatch(action);
  };
}

export default function reducer(state: UsersState = { items: [] }, action: Action): UsersState {
  switch (action.type) {
  case ActionType.USERS_LOADED:
    return { ...state,  items: (action as UsersLoadedAction).items };
  default:
    return state;
  }
}
