/* globals fetch:true */
import 'isomorphic-fetch';

export const USERS_LOADED = `@users/loaded`;

const initialState = {
  items: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case USERS_LOADED:
    return Object.assign({}, state, { items: action.items });
  default:
    return state;
  }
}

export function fetchUsers() {
  return async function(dispatch) {
    const res = await fetch(`//jsonplaceholder.typicode.com/users`);
    const users = await res.json();

    dispatch({
      type: USERS_LOADED,
      items: users
    });
  };
}