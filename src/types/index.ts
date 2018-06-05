
export enum ActionType {
  LOCALE_CHANGED = 'localeChanged',
  USERS_LOADED = 'usersLoaded',
}

export interface Action {
  type: ActionType;
}

export interface User {
  [key: string]: any;
}

export interface UsersState {
  items: ReadonlyArray<User>;
}

export interface UsersLoadedAction extends Action {
  items: ReadonlyArray<User>;
}

export interface IntlState {
  locale: string;
  translations: TranslationData;
}

export interface LocaleChangeAction extends Action {
  locale: string;
}

export interface AppState {
  intl: IntlState;
  users: UsersState;
}
