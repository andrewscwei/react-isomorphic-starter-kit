declare module 'sitemap';

declare const __BUILD_CONFIG__: { [key: string]: any };
declare const __APP_ENV__: string;
declare const __ASSET_MANIFEST__: AssetManifest;
declare const __INTL_CONFIG__: {
  defaultLocale: string;
  localeData: Readonly<LocaleDataDict>;
  locales: ReadonlyArray<string>;
  dict: Readonly<TranslationDataDict>;
};

interface TranslationData {
  [key: string]: string;
}

interface TranslationDataDict {
  [locale: string]: TranslationData;
}

interface LocaleDataDict {
  [locale: string]: ReactIntl.LocaleData;
}

interface RouteData {
  component: string;
  exact?: boolean;
  path: string;
}

interface AssetManifest {
  [key: string]: any;
}

interface Window {
  __INITIAL_STATE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

interface Error {
  status?: number;
}
