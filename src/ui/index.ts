/**
 * @file Loads and parses all translations into a map.
 */

import Worker from 'worker-loader!../workers/web'
import { mountRoot } from '../../lib/dom'
import { useDebug } from '../../lib/utils'
import App from './App'

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

mountRoot(App)
