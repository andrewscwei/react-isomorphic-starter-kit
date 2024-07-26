import { debug } from '@lib/utils/debug.js'

self.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from app...', 'OK', message)

  if (message === 'Marco') {
    self.postMessage({ message: 'Polo' })
  }
})
