import { useRouteError } from 'react-router'

export function ErrorBoundary() {
  const error = useRouteError() as Error

  return (
    <main>
      <code>{error.message}</code>
      <pre>{error.stack}</pre>
    </main>
  )
}
