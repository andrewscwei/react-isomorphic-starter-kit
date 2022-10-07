import Worker from 'worker-loader!../workers/web'
import App from '../App'
import { mount } from '../utils/dom'
import useDebug from '../utils/useDebug'

const debug = useDebug()

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*'
}

const worker = new Worker()

worker.postMessage({ message: 'Hello, world!' })
worker.addEventListener('message', event => {
  debug(event.data.message)
})

mount(App)
