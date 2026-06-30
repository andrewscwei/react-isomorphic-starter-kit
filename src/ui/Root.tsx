import { I18nProvider } from '@lib/i18n'
import { reactRouterAdapter } from '@lib/i18n/adapters/react-router'
import { Outlet } from 'react-router'

import i18nConfig from '../i18n.config.js'

export function Component() {
  return (
    <I18nProvider
      {...i18nConfig}
      routerAdapter={reactRouterAdapter}
    >
      <Outlet/>
    </I18nProvider>
  )
}
