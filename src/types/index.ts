import { Request } from 'express';
import { Store } from 'react-redux';

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

export interface TranslationData {
  [key: string]: string;
}

export interface TranslationDataDict {
  [locale: string]: TranslationData;
}

export interface LocaleDataDict {
  [locale: string]: ReactIntl.LocaleData;
}

export interface DataComponent {
  fetchData(store: Store<AppState>): void;
}

export interface LocalizedRequest extends Request {
  normalizedPath?: string;
  language?: string;
}

export interface UsersLoadedAction extends Action {
  items: ReadonlyArray<User>;
}

export interface IntlState {
  locale: string;
  translations: TranslationData;
}

export interface RouteData {
  component: string;
  exact?: boolean;
  path: string;
}

export interface LocaleChangeAction extends Action {
  locale: string;
}

export interface AppState {
  intl: IntlState;
  users: UsersState;
}
