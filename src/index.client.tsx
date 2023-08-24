/**
 * @file Loads and parses all translations into a map.
 */

import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import Worker from 'worker-loader!./workers/web'
import { initClient } from '../lib/dom'
import { useDebug } from '../lib/utils'
import { BASE_PATH } from './app.conf'
import i18nConf from './i18n.conf'
import routesConf from './routes.conf'
import App from './ui/App'

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

export default initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: BASE_PATH })}/>
  </App>
), { i18n: i18nConf, routes: routesConf })
