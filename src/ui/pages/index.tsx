import React from 'react'
import { Outlet, useRouteError } from 'react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import styles from './index.module.css'

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
      <code className={styles.message}>{error.message}</code>
      <pre className={styles.stack}>{error.stack}</pre>
    </main>
  )
}
