/**
 * @file Client entry file.
 */

import { debug } from '@lib/debug'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, matchRoutes } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { BASE_PATH } from './app.config.js'
import { routes } from './routes.config.js'
import { App } from './ui/App.js'
import WebWorker from './workers/web.js?worker'

async function loadLazyComponents() {
  const matches = matchRoutes(routes, window.location, BASE_PATH)?.filter(t => t.route.lazy)

  if (!matches || matches.length === 0) return

  await Promise.all(matches.map(async ({ route }) => {
    if (typeof route.lazy !== 'function') return

    const routeModule = await route.lazy?.()

    Object.assign(route, {
      ...routeModule,
      lazy: undefined,
    })
  }))
}

function work() {
  const worker = new WebWorker()
  worker.postMessage({ message: 'Marco' })
  worker.addEventListener('message', event => {
    const message = event.data.message
    debug('Receiving message from worker...', 'OK', message)
    worker.terminate()
  })
}

async function render() {
  const container = window.document.getElementById('root')

  if (!container) throw Error('Invalid application root')

  await loadLazyComponents()

  hydrateRoot(
    container, (
      <App>
        <RouterProvider router={createBrowserRouter(routes, { basename: BASE_PATH })}/>
      </App>
    ),
  )

  debug('Initializing client...', 'OK')
}

render()
work()
