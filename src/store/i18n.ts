/**
 * @file Defines the reducer and actions for the `I18nState`. The `I18nState` persists the most current locale used by
 *       the entire app and provides references to the localization methods of the current locale.
 */

import Polyglot from 'node-polyglot'
import { Action } from 'redux'
import debug from '../utils/debug'
import { getPolyglotByLocale } from '../utils/i18n'

export enum I18nActionType {
  LOCALE_CHANGED = 'i18n/LOCALE_CHANGED',
}

export interface I18nAction extends Action<I18nActionType> {
  locale: string
  ltxt: typeof Polyglot.prototype.t
}

export interface I18nState {
  locale: string
  ltxt: typeof Polyglot.prototype.t
}

const initialState: I18nState = {
  locale: __I18N_CONFIG__.defaultLocale,
  ltxt: (...args) => getPolyglotByLocale(__I18N_CONFIG__.defaultLocale).t(...args),
}

/**
 * Changes the current locale of the entire app.
 *
 * @param locale - The locale to change to.
 *
 * @returns The action to dispatch.
 */
export function changeLocale(locale: string): I18nAction {
  debug('Changing locale...', 'OK', locale)

  return {
    type: I18nActionType.LOCALE_CHANGED,
    locale,
    ltxt: (...args) => getPolyglotByLocale(locale).t(...args),
  }
}

/**
 * Reducer of the `I18nState`.
 *
 * @param state - The current state.
 * @param action - The dispatched action.
 *
 * @returns The resulting state after the dispatched action.
 */
export default function reducer(state = initialState, action: I18nAction): I18nState {
  switch (action.type) {
  case I18nActionType.LOCALE_CHANGED:
    return {
      ...state,
      ...action,
    }
  default:
    return state
  }
}
