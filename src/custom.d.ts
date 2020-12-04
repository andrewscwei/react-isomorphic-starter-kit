declare module 'sitemap';

declare const __BUILD_CONFIG__: { [key: string]: any };
declare const __ASSET_MANIFEST__: AssetManifest;
declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string;
  locales: string;
  dict: TranslationDataDict;
}>;

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

interface TranslationData {
  [key: string]: string;
}

interface TranslationDataDict {
  [locale: string]: TranslationData;
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
