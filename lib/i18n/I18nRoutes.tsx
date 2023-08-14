import React, { PropsWithChildren, useContext } from 'react'
import { Route, Routes } from 'react-router'
import { I18nContext } from './I18nProvider'

/**
 * Custom {@link Routes} container that generates child {@link Route} components
 * for all locales supported by {@link I18nProvider}.
 */
export default function I18nRoutes({ children }: PropsWithChildren) {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the value of I18nContext, is the corresponding provider instated?')

  const { defaultLocale, supportedLocales, localeChangeStrategy } = context.state

  switch (localeChangeStrategy) {
    case 'path':
      return (
        <Routes>
          {supportedLocales.map(locale => (
            <Route key={locale} path={locale === defaultLocale ? '/' : locale}>
              {children}
            </Route>
          ))}
        </Routes>
      )
    default:
      return (
        <Routes>
          <Route path={'/'}>
            {children}
          </Route>
        </Routes>
      )
  }
}
