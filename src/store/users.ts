import request from 'superagent';

export const USERS_LOADED = `@users/loaded`;

const initialState = {
  items: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case USERS_LOADED:
    return { ...state,  items: action.items };
  default:
    return state;
  }
}

export function fetchUsers() {
  return async dispatch => {
    const res = await request.get(`//jsonplaceholder.typicode.com/users`);
    const users = res.body;

    dispatch({
      type: USERS_LOADED,
      items: users,
    });
  };
}
