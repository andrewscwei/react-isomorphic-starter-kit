import React from 'react'
import { useRouteError } from 'react-router'
import style from './ErrorBoundary.module.css'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export function ErrorBoundary() {
  const error = useRouteError() as Error

  return (
    <>
      <Header/>
      <main>
        <code className={style.message}>{error.message}</code>
        <pre className={style.stack}>{error.stack}</pre>
      </main>
      <Footer/>
    </>
  )
}
