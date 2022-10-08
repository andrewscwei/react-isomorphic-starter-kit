import Worker from 'worker-loader!../workers/web'
import App from '../App'
import appConf from '../app.conf'
import { mount } from '../utils/dom'
import useDebug from '../utils/useDebug'

const debug = useDebug()

if (process.env.NODE_ENV === 'development') window.localStorage.debug = 'app*'
window.__VERSION__ = appConf.version

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

mount(App)
