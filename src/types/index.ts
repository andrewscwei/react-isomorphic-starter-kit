import { Request } from 'express';
import { i18n } from 'i18next';
import { TranslationFunction } from 'react-i18next';
import { Store } from 'react-redux';

export enum ActionType {
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

export interface TranslationData {
  [key: string]: string;
}

export interface TranslationDataDict {
  [locale: string]: TranslationData;
}

export interface IntlProps {
  t: TranslationFunction;
  i18n: i18n;
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
  users: UsersState;
}
