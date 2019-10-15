
export const UsersActionType = {
  LOADED: 'users/LOADED',
};

const initialState = {
  items: [],
};

export function fetchUsers() {
  return async dispatch => {
    const res = await fetch('//jsonplaceholder.typicode.com/users')
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });

    if (!res) return;

    const items = await res.json();
    const action = {
      type: UsersActionType.LOADED,
      payload: {
        items,
      },
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action) {
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
