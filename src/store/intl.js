import { addLocaleData } from 'react-intl';

const IntlActionType = {
  LOCALE_CHANGED: 'locale-changed',
};

let defaultLocale;
let locales;
let translations = {};

if ((__APP_ENV__ === 'client') && (process.env.NODE_ENV === 'development')) {
  const localeReq = require.context('../../config/locales', true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace('./', '').replace('.json', '');
    if (!~__BUILD_CONFIG__.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path);
  });

  defaultLocale = __BUILD_CONFIG__.locales[0];
  locales = __BUILD_CONFIG__.locales;

  for (const locale of __BUILD_CONFIG__.locales) {
    addLocaleData(require(`react-intl/locale-data/${locale}`));
  }
}
else {
  for (const locale in __INTL_CONFIG__.localeData) {
    if (!__INTL_CONFIG__.localeData.hasOwnProperty(locale)) continue;
    addLocaleData(__INTL_CONFIG__.localeData[locale]);
  }

  defaultLocale = __INTL_CONFIG__.defaultLocale;
  locales = __INTL_CONFIG__.locales;
  translations = __INTL_CONFIG__.dict;
}

const initialState = {
  locale: defaultLocale,
  locales,
  translations: translations[defaultLocale],
};

export function changeLocale(locale) {
  return {
    locale,
    type: IntlActionType.LOCALE_CHANGED,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case IntlActionType.LOCALE_CHANGED:
    return { ...state, locale: action.locale, translations: translations[action.locale] };
  default:
    return state;
  }
}
