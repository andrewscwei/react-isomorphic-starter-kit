/**
 * @file Loads and parses all translations into a map.
 */

import Worker from 'worker-loader!../workers/web'
import { loadLazyComponents, mountRoot } from '../../lib/dom'
import { useDebug } from '../../lib/utils'
import { VERSION } from '../app.conf'
import routesConf from '../routes.conf'
import App from './App'

window.__VERSION__ = VERSION

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

loadLazyComponents(routesConf).then(() => mountRoot(App))
