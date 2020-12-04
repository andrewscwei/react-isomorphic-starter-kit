/**
 * @file Client entry file.
 */

import { hydrate, render } from 'react-dom'
import Worker from 'worker-loader!./workers/web'
import App from './containers/App'
import debug from './utils/debug'
import { markup } from './utils/dom'

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*'
}

const worker = new Worker()

worker.postMessage({ message: 'Hello, world!' })
worker.addEventListener('message', event => {
  debug(event.data.message)
})

// Render the app.
if (process.env.NODE_ENV === 'development') {
  render(markup(App), document.getElementById('app'))
}
else {
  hydrate(markup(App), document.getElementById('app'))
}
