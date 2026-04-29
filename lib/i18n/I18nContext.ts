import { createContext, type Dispatch } from 'react'

import { type GetLocalizedPath } from './types/GetLocalizedPath.js'
import { type GetLocalizedString } from './types/GetLocalizedString.js'
import { type I18nConfig } from './types/I18nConfig.js'
import { type Locale } from './types/Locale.js'
import { type RouterAdapter } from './types/RouterAdapter.js'

export type I18nState = {
  locale: Locale
  getLocalizedPath: GetLocalizedPath
  getLocalizedString: GetLocalizedString
} & I18nConfig

export type I18nAction = ChangeLocaleAction | ResetLocaleAction

type ResetLocaleAction = {
  type: '@i18n/RESET_LOCALE'
}

type ChangeLocaleAction = {
  locale: Locale
  type: '@i18n/CHANGE_LOCALE'
}

type ContextValue = {
  dispatch?: Dispatch<I18nAction>
  router: RouterAdapter
  state: I18nState
}

export const I18nContext = createContext<ContextValue | undefined>(undefined)

if (process.env.NODE_ENV === 'development') {
  I18nContext.displayName = 'I18nContext'
}
