import { createRoot } from 'react-dom/client'
import Worker from 'worker-loader!./workers/web'
import appConf from '../app.conf'
import { markup } from '../utils/dom'
import useDebug from '../utils/useDebug'
import App from './App'

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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = createRoot(document.getElementById('app')!)
app.render(markup(App))
