/**
 * Workers entry file.
 */

import Worker from 'worker-loader!./workers/web'
import { useDebug } from '../lib/utils'

const debug = useDebug(undefined, 'worker')

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})
