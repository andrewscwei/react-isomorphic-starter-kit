import Worker from 'worker-loader!../workers/web'
import App from '../App'
import debug from '../utils/debug'
import { mount } from '../utils/dom'

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*'
}

const worker = new Worker()

worker.postMessage({ message: 'Hello, world!' })
worker.addEventListener('message', event => {
  debug(event.data.message)
})

mount(App)
