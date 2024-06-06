/**
 * @file Client entry file.
 */

import { initClient } from '@lib/dom'
import { createDebug } from '@lib/utils/createDebug'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import Worker from 'worker-loader!./workers/web'
import { config as i18nConf } from './i18n.conf'
import { config as routesConf } from './routes.conf'
import { App } from './ui/App'

const { basePath } = __BUILD_ARGS__

export const client = initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: basePath })}/>
  </App>
), {
  i18n: i18nConf,
  routes: routesConf,
})

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const debug = createDebug()
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})
