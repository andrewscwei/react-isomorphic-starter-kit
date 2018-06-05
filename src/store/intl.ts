import { Action, ActionType, IntlState, LocaleChangeAction } from '@/types';
import { addLocaleData } from 'react-intl';

let defaultLocale: string;
let locales: Array<string>;
let translations: TranslationDataDict = {};

if ((__APP_ENV__ === `client`) && (process.env.NODE_ENV === `development`)) {
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~__APP_CONFIG__.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path) as TranslationData;
  });

  defaultLocale = __APP_CONFIG__.locales[0];
  locales = __APP_CONFIG__.locales;

  for (const locale of __APP_CONFIG__.locales) {
    addLocaleData(require(`react-intl/locale-data/${locale}`));
  }
}
else {
  for (const locale in __INTL_CONFIG__.localeData) {
    if (!__INTL_CONFIG__.localeData.hasOwnProperty(locale)) continue;
    addLocaleData(__INTL_CONFIG__.localeData[locale]);
  }

  defaultLocale = __INTL_CONFIG__.defaultLocale;
  locales = __INTL_CONFIG__.locales as Array<string>;
  translations = __INTL_CONFIG__.dict;
}

const initialState: IntlState = {
  locale: defaultLocale,
  locales,
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
