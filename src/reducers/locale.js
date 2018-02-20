export const CHANGE_LOCALE = `@locale/changeLocale`;

export const initialState = {
  locale: `en`,
  messages: {}
};

export function changeLocale({ locale, formats, messages }) {
  return {
    type: CHANGE_LOCALE,
    payload: { locale, formats, messages }
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case CHANGE_LOCALE:
    return { ...state, ...action.payload };

  default:
    return state;
  }
}