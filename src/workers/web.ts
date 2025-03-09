import { debug } from '@lib/debug'

self.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from app...', 'OK', message)

  if (message === 'Marco') {
    self.postMessage({ message: 'Polo' })
  }
})
