declare const $ASSET_MANIFEST: { [key: string]: any };
declare const $LOCALE_CONFIG: any;

interface Window {
  __INITIAL_STATE__: any;
  __INITIAL_LOCALE__: any;
}

interface Error {
  status?: number;
}
