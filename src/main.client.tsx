/**
 * @file Client entry file.
 */

import { loadLazyComponents } from '@lib/dom'
import { generateLocalizedRoutes } from '@lib/i18n'
import { createDebug } from '@lib/utils/createDebug'
import { rethrow } from '@lib/utils/rethrow'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { BASE_PATH } from './app.conf'
import { i18n } from './i18n.conf'
import { routes } from './routes.conf'
import { App } from './ui/App'
import WebWorker from './workers/web?worker'

const debug = createDebug()

function work() {
  const worker = new WebWorker()
  worker.postMessage({ message: 'Marco' })
  worker.addEventListener('message', event => {
    const message = event.data.message
    debug('Receiving message from worker...', 'OK', message)
    worker.terminate()
  })
}

async function main() {
  const localizedRoutes = generateLocalizedRoutes(routes, i18n)
  const container = window.document.getElementById('root') ?? rethrow('Invalid application root')

  await loadLazyComponents(localizedRoutes)

  hydrateRoot(
    container, (
      <StrictMode>
        <App>
          <RouterProvider router={createBrowserRouter(localizedRoutes, { basename: BASE_PATH })}/>
        </App>
      </StrictMode>
    ),
  )

  debug('Initializing client...', 'OK')
}

main()
work()
