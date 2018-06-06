export interface AppState {
  intl: IntlState;
  users: UsersState;
}

export enum AppActionType {
  LOCALE_CHANGED = 'localeChanged',
  USERS_LOADED = 'usersLoaded',
}

export type AppAction =
  | UsersLoadedAction
  | LocaleChangeAction;

export interface User {
  [key: string]: any;
}

export interface UsersState {
  items: ReadonlyArray<User>;
}

export interface UsersLoadedAction {
  items: ReadonlyArray<User>;
  type: AppActionType.USERS_LOADED;
}

export interface IntlState {
  locale: string;
  locales: ReadonlyArray<string>;
  translations: Readonly<TranslationData>;
}

export interface LocaleChangeAction {
  locale: string;
  type: AppActionType.LOCALE_CHANGED;
}
