/**
 * @file Client entry file.
 */

import { loadLazyComponents } from '@lib/dom/index.js'
import { generateLocalizedRoutes } from '@lib/i18n/index.js'
import { debug } from '@lib/utils/debug.js'
import { rethrow } from '@lib/utils/rethrow.js'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { BASE_PATH } from './app.config.js'
import { i18n } from './i18n.config.js'
import { routes } from './routes.config.js'
import { App } from './ui/App.js'
import WebWorker from './workers/web.js?worker'

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
  const localizedRoutes = generateLocalizedRoutes(routes, i18n)
  const container = window.document.getElementById('root') ?? rethrow('Invalid application root')

  await loadLazyComponents(localizedRoutes, { basePath: BASE_PATH })

  hydrateRoot(
    container, (
      <App>
        <RouterProvider router={createBrowserRouter(localizedRoutes, { basename: BASE_PATH })}/>
      </App>
    ),
  )

  debug('Initializing client...', 'OK')
}

render()
work()
