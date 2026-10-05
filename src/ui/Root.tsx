import { I18nProvider } from '@lib/i18n'
import { createReactRouterAdapter } from '@lib/i18n/adapters/react-router'
import { Outlet } from 'react-router'

import i18nConfig from '../i18n.config.js'

export function Component() {
  const routerAdapter = createReactRouterAdapter()

  return (
    <I18nProvider
      {...i18nConfig}
      routerAdapter={routerAdapter}
    >
      <Outlet/>
    </I18nProvider>
  )
}
