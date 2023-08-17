/**
 * @file Client app root.
 */

import React, { StrictMode } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useFavicon, useThemeColor } from '../../lib/dom'
import { I18nProvider } from '../../lib/i18n'
import { joinURL } from '../../lib/utils'
import { BASE_PATH, MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import { i18nConfig } from '../locales'
import routesConf from '../routes.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = RootComponentProps

export default function App({ routerProvider }: Props) {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.png'),
    },
  })

  const Container = () => (
    <I18nProvider {...i18nConfig}>
      <Outlet/>
    </I18nProvider>
  )

  const renderRouter = () => routerProvider ?? <RouterProvider router={createBrowserRouter([{ Component: Container, children: routesConf }], { basename: BASE_PATH })}/>

  return (
    <StrictMode>
      {renderRouter()}
    </StrictMode>
  )
}
