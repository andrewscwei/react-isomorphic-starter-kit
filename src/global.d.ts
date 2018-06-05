declare const __APP_CONFIG__: { [key: string]: any };
declare const __APP_ENV__: string;
declare const __ASSET_MANIFEST__: AssetManifest;
declare const __INTL_CONFIG__: {
  defaultLocale: string;
  locales: ReadonlyArray<string>;
  dict: Readonly<TranslationDataDict>;
};

interface TranslationData {
  [key: string]: string;
}

interface TranslationDataDict {
  [locale: string]: TranslationData;
}

interface AssetManifest {
  [key: string]: any;
}

interface Window {
  __INITIAL_STATE__: any;
}

interface Error {
  status?: number;
}
