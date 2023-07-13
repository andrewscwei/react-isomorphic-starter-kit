/**
 * @file Loads and parses all translations into a map.
 */

import Worker from 'worker-loader!../workers/web'
import mountRoot from '../framework/utils/mountRoot'
import useDebug from '../framework/utils/useDebug'
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
