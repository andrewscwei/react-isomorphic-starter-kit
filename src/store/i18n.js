import debug from '../utils/debug';
import { getPolyglotByLocale } from '../utils/i18n';

const I18nActionType = {
  LOCALE_CHANGED: 'i18n/LOCALE_CHANGED',
};

const initialState = {
  locale: __I18N_CONFIG__.defaultLocale,
  ltxt: (...args) => getPolyglotByLocale(__I18N_CONFIG__.defaultLocale).t(...args),
};

export function changeLocale(locale) {
  debug('Changing locale...', 'OK', locale);

  return {
    type: I18nActionType.LOCALE_CHANGED,
    payload: {
      locale,
      ltxt: (...args) => getPolyglotByLocale(locale).t(...args),
    },
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case I18nActionType.LOCALE_CHANGED:
    return {
      ...state,
      ...action.payload,
    };
  default:
    return state;
  }
}
