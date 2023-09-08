import React from 'react'
import { Outlet, useRouteError } from 'react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import style from './index.module.css'

export function Component() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError() as Error

  return (
    <main>
      <code className={style.message}>{error.message}</code>
      <pre className={style.stack}>{error.stack}</pre>
    </main>
  )
}
