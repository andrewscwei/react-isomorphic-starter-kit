import { useMeta } from '@lib/meta'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { DEBUG } from '../app.config.js'
import { Component as ClientError } from './pages/ClientError/ClientError.js'
import { Component as NotFound } from './pages/NotFound/NotFound.js'

type ErrorInfo = {
  status: number
  message?: string
  body?: string
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { status, message = 'Unknown Error', body = 'No content' } = parseError(error)

  if (status === 404) {
    return <NotFound/>
  }
  else if (!DEBUG) {
    return <ClientError/>
  }
  else {
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
        status: error.status,
        message: `${error.status} ${error.statusText}`,
        body: error.data || undefined,
      }
    case error instanceof Error:
      return {
        status: -1,
        message: error.message || undefined,
        body: error.stack || undefined,
      }
    default:
      return {
        status: -1,
        message: undefined,
        body: undefined,
      }
  }
}
