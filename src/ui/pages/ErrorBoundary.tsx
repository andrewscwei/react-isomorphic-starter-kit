import React from 'react'
import { useRouteError } from 'react-router'
import styles from './ErrorBoundary.module.css'

export function ErrorBoundary() {
  const error = useRouteError() as Error

  return (
    <main>
      <code className={styles.message}>{error.message}</code>
      <pre className={styles.stack}>{error.stack}</pre>
    </main>
  )
}
