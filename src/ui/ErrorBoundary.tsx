import { useMeta } from '@lib/meta'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { DEBUG } from '@/app.config.js'
import { Component as ClientError } from '@/ui/pages/ClientError/ClientError.js'
import { Component as NotFound } from '@/ui/pages/NotFound/NotFound.js'

type ErrorInfo = {
  body?: string
  message?: string
  status: number
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { body = 'No content', message = 'Unknown Error', status } = parseError(error)

  if (status === 404) {
    return <NotFound/>
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
