import { Action, ActionType, IntlState, LocaleChangeAction } from '@/types';

let defaultLocale: string;
let translations: TranslationDataDict = {};

if ((__APP_ENV__ === `client`) && (process.env.NODE_ENV === `development`)) {
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~__APP_CONFIG__.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path) as TranslationData;
  });
  defaultLocale = __APP_CONFIG__.locales[0];
}
else {
  defaultLocale = __INTL_CONFIG__.defaultLocale;
  translations = __INTL_CONFIG__.dict;
}

const initialState: IntlState = {
  locale: defaultLocale,
  translations: translations[defaultLocale],
};

export function changeLocale(locale: string): LocaleChangeAction {
  return {
    locale,
    type: ActionType.LOCALE_CHANGED,
  };
}

export default function reducer(state = initialState, action: Action): IntlState {
  switch (action.type) {
  case ActionType.LOCALE_CHANGED:
    const t = action as LocaleChangeAction;
    return { ...state, locale: t.locale, translations: translations[t.locale] };
  default:
    return state;
  }
}
