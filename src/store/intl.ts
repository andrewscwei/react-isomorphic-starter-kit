import { Action, ActionType, IntlState, LocaleChangeAction, TranslationData, TranslationDataDict } from '@/types';

// for (const locale of $APP_CONFIG.locales) {
//   addLocaleData($LOCALE_CONFIG.localeData[locale]);
// }

const translations: TranslationDataDict = {};

// Require context for all locale translation files and apply them to i18next so
// that they can be watched by Webpack.
if (process.env.NODE_ENV === `development`) {
  const appConfig = require(`@/../config/app.conf`).default;
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~appConfig.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path) as TranslationData;
  });
}
else {
  for (const locale in $LOCALE_CONFIG.translations) {
    if (!$LOCALE_CONFIG.translations.hasOwnProperty(locale)) continue;
    translations[locale] = $LOCALE_CONFIG.translations[locale] as TranslationData;
  }
}

const initialState: IntlState = {
  locale: `en`,
  translations: translations[`en`],
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
