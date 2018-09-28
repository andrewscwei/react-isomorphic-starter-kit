const UsersActionType = {
  USERS_LOADED: 'users-loaded',
};

const initialState = {
  items: [],
};

export function fetchUsers() {
  return async(dispatch) => {
    const res = await fetch('//jsonplaceholder.typicode.com/users');
    const items = await res.json();
    const action = {
      items,
      type: UsersActionType.USERS_LOADED,
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UsersActionType.USERS_LOADED:
    return { ...state, items: action.items };
  default:
    return state;
  }
}
