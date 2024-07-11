import { createDebug } from '@lib/utils/createDebug'

const debug = createDebug(undefined, 'worker')

self.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from app...', 'OK', message)

  if (message === 'Marco') {
    self.postMessage({ message: 'Polo' })
  }
})
