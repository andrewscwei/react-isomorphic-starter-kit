import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Worker from 'worker-loader!./workers/web'
import appConf from '../app.conf'
import useDebug from '../utils/useDebug'
import App from './App'

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!
const locals = window.__LOCALS__ ?? {}

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*'
  createRoot(container).render(<App locals={locals}/>)
}
else {
  window.__VERSION__ = appConf.version
  hydrateRoot(container, <App locals={locals}/>)
}
