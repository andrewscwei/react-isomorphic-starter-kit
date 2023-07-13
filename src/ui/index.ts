import Worker from 'worker-loader!../workers/web'
import appConf from '../app.conf'
import mount from '../arch/utils/mount'
import useDebug from '../arch/utils/useDebug'
import App from './App'

if (process.env.NODE_ENV === 'development') window.localStorage.debug = 'app*'
window.__VERSION__ = appConf.version

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

mount(App)
