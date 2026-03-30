import { useMeta } from '@lib/meta'
import { lazy, Suspense } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { DEBUG } from '@/app.config.js'
import { Component as ClientError } from '@/ui/pages/ClientError/ClientError.js'

type ErrorInfo = {
  body?: string
  message?: string
  status: number
}

const NotFound = lazy(() => import('@/ui/pages/NotFound/NotFound.js').then(m => ({ default: m.Component })))

export function ErrorBoundary() {
  const error = useRouteError()
  const { body = 'No content', message = 'Unknown Error', status } = parseError(error)

  if (status === 404) {
    return <Suspense><NotFound/></Suspense>
  } else if (!DEBUG) {
    return <ClientError/>
  } else {
    useMeta({
      noIndex: true,
    })

    return (
      <main>
        <code>{message}</code>
        <pre>{body}</pre>
      </main>
    )
  }
}

function parseError(error: unknown): ErrorInfo {
  switch (true) {
    case isRouteErrorResponse(error):
      return {
        body: error.data || undefined,
        message: `${error.status} ${error.statusText}`,
        status: error.status,
      }
    case error instanceof Error:
      return {
        body: error.stack || undefined,
        message: error.message || undefined,
        status: -1,
      }
    default:
      return {
        body: undefined,
        message: undefined,
        status: -1,
      }
  }
}
