/**
 * @file Client entry file.
 */

import { debug } from '@lib/debug'
import { loadLazyComponents } from '@lib/seo'
import { hydrateRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { BASE_PATH } from './app.config.js'
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
  const container = window.document.getElementById('root')

  if (!container) throw Error('Invalid application root')

  await loadLazyComponents(routes, { basePath: BASE_PATH })

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
